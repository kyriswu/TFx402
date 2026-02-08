import 'dotenv/config';
import { Agent } from '@xmtp/agent-sdk';
import TronWebPkg from 'tronweb';
const TronWeb = TronWebPkg.TronWeb || TronWebPkg;

// 1. 初始化波场连接 (用于执行交易)
const tronWeb = new TronWeb({
    fullHost: 'https://api.nileex.io', // 使用 Nile 测试网
    privateKey: process.env.TRON_PRIVATE_KEY // Agent 的波场私钥
});

// 2. 初始化 XMTP Agent (用于接收指令)
const agent = await Agent.createFromEnv(); 

// 3. 监听消息
agent.on('text', async (ctx) => {
    const text = ctx.message.content.text;

    // 假设指令格式: "pay Txyz... 100"
    if (text.startsWith('pay ')) {
        const parts = text.split(' ');
        const toAddress = parts[1];
        const amount = parts[2];

        // 检查地址是否是合法的波场地址
        if (!tronWeb.isAddress(toAddress)) {
            await ctx.sendText("⚠️ 错误：这不是一个有效的波场(TRON)地址！");
            return;
        }

        await ctx.sendText(`🤖 收到指令！正在通过波场网络向 ${toAddress} 转账 ${amount} TRX...`);

        try {
            // --- 这里是核心：调用 TRON 网络进行转账 ---
            const tradeObj = await tronWeb.transactionBuilder.sendTrx(
                toAddress,
                tronWeb.toSun(amount), // 转换单位
                tronWeb.defaultAddress.base58
            );
            const signedTxn = await tronWeb.trx.sign(tradeObj);
            const receipt = await tronWeb.trx.sendRawTransaction(signedTxn);
            // ------------------------------------------

            await ctx.sendText(`✅ 支付成功！\n交易哈希: ${receipt.txid}\n查看: https://nile.tronscan.org/#/transaction/${receipt.txid}`);
        } catch (e) {
            console.error(e);
            await ctx.sendText(`❌ 支付失败: ${e.message}`);
        }
    }
});

await agent.start();