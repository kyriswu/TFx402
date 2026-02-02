import 'dotenv/config';
import express, { json } from 'express';
import fs from 'fs';

import { getProductById, getProductsBySellerId, getProductsByStatus, getRandomProduct, addProduct, updateProduct, deleteProduct } from './db/db_products.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { sendTrx,createWallet,getBalance,getAccount,executePayment} from './wallet.js';
import { loginOrRegister, getUserInfoBySocialPlatform, updateUserWalletAddress, approveContract } from './db/db_users.js';
import { encryptPrivateKey, decryptPrivateKey } from './util.js';
import {  
createSpendingKey,
getSpendingKeyById,
getSpendingKeyByAccessKey,
getSpendingKeysByUserId,
updateSpendingKey,
deleteSpendingKey,
updateBudgetUsage,
updateStatus,
resetBudget,
incrementRateUsage,
canPay,
getKeysNeedingReset} from './db/db_spending_keys.js';
import { authenticateToken } from './middleware.js'; // 导入中间件

const app = express();
const PORT = 4000;

// 中间件示例：解析 JSON，增加请求体大小限制
app.use(json({ limit: '50mb' }));

// CORS 中间件：允许跨域请求
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}); 

// 静态文件服务：提供 file 文件夹下的图片访问
app.use('/file', express.static('file'));

// 路由
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

/**
 * 核心接口：接收前端传来的 Code，换取 Token
 */
app.post('/api/auth/google', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Code is required' });
    }

    console.log(code)

    // 配置 Google Client
    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_AUTH_CALLBACK_URL // 必须与 Google Console 配置完全一致
    );
    console.log(client)
    try {
        // 1. 用 Code 换取 Google 的 Tokens (包含 id_token, access_token)
        const { tokens } = await client.getToken(code);
        console.log('Google Tokens:', tokens);
        // 2. 验证 id_token 的合法性，并解析用户信息
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        // payload 包含: email, name, picture, sub (google user id)
        const { sub, email, name, picture } = payload;

        // 3. 【业务逻辑】在这里查询或注册你的数据库用户
        // let user = await db.User.find({ googleId: sub });
        // if (!user) user = await db.User.create({ ... });

        // 4. 签发你自己的后端 Session Token (用于后续 API 调用)
        const appToken = jwt.sign(
            { userId: sub, email, platform: "google" }, // 你的用户标识
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Google Auth Success:', { userId: sub, email, name });


        const socialData = {
            social_platform: 'google',
            social_platform_user_id: sub,
            username: name,
            avatar_url: picture,
            email
        };

        let walletData = {};
        let userInfo = {}
        try {
            const existingUser = await getUserInfoBySocialPlatform('google', sub);
            
            // if (!existingUser) {
            //     // Create new wallet
            //     const wallet = await createWallet();
            //     walletData = {
            //         wallet_address: wallet.address,
            //         public_key: wallet.publicKey,
            //         private_key_encrypted: encryptPrivateKey(wallet.privateKey)
            //     };
            // }
            
            const { user, isNewUser } = await loginOrRegister(socialData, walletData);
            userInfo = user;
        } catch (error) {
            console.error('User registration error:', error);
        }

        // 5. 返回数据给前端
        res.json({
            message: 'Login successful',
            appToken: appToken,       // 用于访问你的 Express API
            user: { name, email, picture, platform: "google" },
            // 【关键】将原始 id_token 返回给前端，用于 Web3 AA (Sui zkLogin / MPC)
            googleIdToken: tokens.id_token,
            walletAddress: userInfo.wallet_address || null
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
});

app.post('/updateWallet', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ code: -1, error: 'Wallet address is required' });
        }

        const user = await getUserInfoBySocialPlatform('google', userId);
        await updateUserWalletAddress(user.id, walletAddress);

        res.status(200).json({ code: 0, message: 'Wallet address updated successfully' });
    } catch (error) {
        console.error('updateWallet error:', error);
        res.status(500).json({ code: -1, error: error.message });
    }
});

app.post('/approveContract', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await getUserInfoBySocialPlatform('google', userId);
        await approveContract(user.id);

        res.status(200).json({ code: 0, message: 'approved successfully' });
    } catch (error) {
        console.error('approveContract error:', error);
        res.status(500).json({ code: -1, error: error.message });
    }
});

//添加、编辑公用接口 - 支出密钥
app.post('/saveKeys', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        let access_key
        const {
            id,
            name,
            spending_limit,
            period_seconds,
            rate_limit,
            status,
            metadata,
            currency,
            budget_limit,
            budget_usage,
            budget_period,
            approval_mode,
            auto_approve_limit,
            rate_limit_max,
            rate_limit_period,
            current_rate_usage,
            allowed_addresses,
            blocked_addresses,
            allowed_skills,
            allowed_merchant_categories,
            alert_threshold_percent,
            expires_at
        } = req.body;
        if (!id) {
            access_key = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        }

        const user = await getUserInfoBySocialPlatform('google', userId)
        console.log(budget_usage)
        const payload = {
            user_id: user.id,
            name: name || null,
            access_key,
            status: (status || 'ACTIVE').toUpperCase(),
            currency: currency || 'USDT',
            budget_limit: budget_limit ?? spending_limit ?? 0,
            budget_usage: budget_usage || 0,
            budget_period: budget_period || 'TOTAL',
            approval_mode: approval_mode || 'HYBRID',
            auto_approve_limit: auto_approve_limit || 0,
            rate_limit_max: rate_limit_max ?? rate_limit ?? -1,
            rate_limit_period: rate_limit_period || 'DAILY',
            current_rate_usage: current_rate_usage ?? 0,
            allowed_addresses: allowed_addresses ?? null,
            blocked_addresses: blocked_addresses ?? null,
            allowed_skills: allowed_skills ?? null,
            allowed_merchant_categories: allowed_merchant_categories ?? null,
            alert_threshold_percent: alert_threshold_percent ?? 80,
            expires_at: expires_at || null,
            metadata: metadata || {},
            period_seconds: period_seconds
        };

        let keyData
        if (!id) {
            const newKeyId = await createSpendingKey(payload);
            keyData = await getSpendingKeyById(newKeyId);
        }else{
            keyData = await updateSpendingKey(id, payload);
        }
       

        res.status(201).json({ code: 0, data: keyData });
    } catch (error) {
        console.error('addKeys error:', error);
        res.status(500).json({ code: -1, error: error.message });
    }
});
app.post('/listKeys', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        // 可选：从请求体接收筛选/分页参数（如果后端实现支持）
        // const { status, limit, offset } = req.body;
        const user = await getUserInfoBySocialPlatform('google', userId)

        const keys = await getSpendingKeysByUserId(user.id);
        res.status(200).json({ code: 0, data: keys });
    } catch (error) {
        console.error('listKeys error:', error);
        res.status(500).json({ code: -1, error: error.message });
    }
});



app.post('/test', async (req, res) => {
    // sendTrx(process.env.PLATFORM_PK, "TELin7GWhGircd9NyNM3h7aewufzYbr7wb", 1).then((tx)=>{
     try{   

        const tx = await executePayment("TELin7GWhGircd9NyNM3h7aewufzYbr7wb", "TUzz9HKrE5sgzn5RmGKG35caEyqvawoKga", 1, "txid:001");
    

        res.status(200).json({ code: 0, data: tx });
    }catch(err){
        res.status(500).json({ code: -1, error: err.message });
    }
});


app.post('/getWalletInfo', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        
        const user = await getUserInfoBySocialPlatform('google', userId)
        console.log(user)
        const balance = await getBalance(user.wallet_address);
        const account = await getAccount(user.wallet_address);
        res.status(200).json({ code: 0, data: { balance, account, address: user.wallet_address, is_approved: user.is_approved } });

    } catch (error) {
        res.status(500).json({ code: -1, error: error.message });
    }
});



// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});