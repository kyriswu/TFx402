import 'dotenv/config';
import * as TronWebPkg from "tronweb";
import { updatePaymentLogStatus } from './db/db_payment_logs.js';  

const contractADDRESS = "TRKtn1GBHG8VUUtxZ6VFRhsYfboZ1nV3sW"

// 从包中提取 TronWeb 类
// 注意：有时候可能是 TronWebPkg.TronWeb，视具体编译环境而定
const TronWeb = TronWebPkg.TronWeb;

const tronWeb = new TronWeb({
    fullHost: process.env.TRON_FULL_NODE,
    privateKey: process.env.PLATFORM_WALLET_PRIVATE_KEY
});
export async function sendTrx(userPrivateKey, to, amountSun) {

    tronWeb.setPrivateKey(userPrivateKey);

    const tx = await tronWeb.trx.sendTransaction(
        to,
        amountSun
    );

    console.log(tx);

    return tx;
}
 
export async function getConfirmedTransaction(txid) {
    const txInfo = await tronWeb.trx.getConfirmedTransaction(txid);
    console.log(txInfo.ret);
    
    return txInfo.ret;
}

export async function getTransactionInfo(txid) {
  try {
    const info = await tronWeb.trx.getTransactionInfo(txid);
    return info
  } catch (e) {
    return false;
  }
}
export async function createWallet() {
    const account = await TronWeb.createAccount();
    
    return {
        address: account.address.base58,
        privateKey: account.privateKey,
        publicKey: account.publicKey
    };
}
export async function getBalance(address) {
    try {
        const balance = await tronWeb.trx.getBalance(address);
        return balance;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getAccount(address) {
    const account = await tronWeb.trx.getAccount(address);
    return account;
}

export async function getUSDTBalance(address) {
    const contract = await tronWeb.contract().at("TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf");
    const balance = await contract.balanceOf(address).call();
    // USDT 在 TRON 上通常是 6 位小数
    console.log(`USDT Balance: ${balance / 1_000_000}`);
    return balance;
}

export async function executePayment(buyer, seller, amount, orderId) {

    const agentPayAddress = "TS9vEcWUkPZ9LtiC2D5XtM8e8ZDwgS82K2";
    const agentPayContract = await tronWeb.contract().at(agentPayAddress);

//      console.log("buyer valid:", tronWeb.isAddress(buyer));
// console.log("seller valid:", tronWeb.isAddress(seller));

    const tx = await agentPayContract.executePayment(buyer, seller, amount, orderId).send({
        feeLimit: 100_000_000
    });
    console.log("交易已广播，TXID:", tx);
    return tx;
}

export async function executeBatchPayment(buyer, seller, amount, orderId) {

    const agentPayAddress = contractADDRESS; //agentPayBatch 合约地址
    const agentPayContract = await tronWeb.contract().at(agentPayAddress);
        const tx = await agentPayContract.executeBatchPayments(buyer, seller, amount, orderId).send({
        feeLimit: 100_000_000
    });
    console.log("批量交易已广播，batchId:", tx);
    return tx;
}

export async function validateBatchPayment(buyer, seller, amount, orderId) {

    const agentPayAddress = contractADDRESS; // AgentPayBatch 合约地址
    const agentPayContract = await tronWeb.contract().at(agentPayAddress);

    const result = await agentPayContract.simulateBatchValidation(buyer, seller, amount, orderId).call();
    return result;
}




export async function transferWithAuthorization(contractAddress, payload) {
    const {authorization, signature} = payload;
    // 这里的 signature 应该是一个字符串,然后需要验证，但是为了简化流程，这里直接使用
    try {
        const contract = await tronWeb.contract().at(contractAddress);
        // const tx = await contract.transferWithAuthorization(
        //     authorization.from,
        //     authorization.to,
        //     authorization.amount,
        //     authorization.nonce,
        //     authorization.deadline,
        //     signature
        // ).send({ feeLimit: 100_000_000 });
        console.log(authorization)
         const tx = await contract.executePayment(authorization.from, authorization.to, authorization.value, "fsdfjsldkjf").send({
        feeLimit: 100_000_000
    });
    console.log("交易成功，TXID:", tx);
     
        return { success: true, txId: tx};
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function checkTxStatus(txID) {
let confirmed = false;
let attempts = 0;
const maxAttempts = 60; // 最多轮询 60 次（1分钟）

while (!confirmed && attempts < maxAttempts) {
    try {
        const txInfo = await tronWeb.trx.getTransactionInfo(txID);
        console.log('查询交易状态:', txInfo);
        if (!txInfo || Object.keys(txInfo).length === 0) {
            console.log('交易不存在或尚未确认，等待中...');
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
        }

        const contractRet = txInfo.receipt?.result || '未知';
        if (contractRet === 'SUCCESS') {
            console.log('✅ 交易成功 (SUCCESS)');
            console.log('区块高度:', txInfo.blockNumber);
            console.log('Energy 使用:', txInfo.receipt?.energy_usage_total);
            console.log('Fee (sun):', txInfo.receipt?.net_fee);
            confirmed = true;
            const events = await getEvents(txID);
            for (const event of events) {
                if (event.event_name !== 'PaymentExecuted') {
                    continue;
                }
                // 解析事件数据，根据需要处理
                const invoice_id = event.result.orderId.replace(/^orderId/, '');
                const updateData = {
                    tx_hash : txID,
                    tx_status : 'success',
                    block_height: txInfo.blockNumber,
                    gas_fee_paid: txInfo.receipt?.net_fee + txInfo.receipt?.energy_usage_total, // 手续费(bandwidth + energy,单位TRX)
                    settlement_time: txInfo.blockTimeStamp, // 完成时间
                    batch_id: txID,
                    batch_index: event.event_index,
                }
                await updatePaymentLogStatus(invoice_id, updateData);
            }
            
            return txInfo;
        } else {
            console.log(`❌ 交易失败: ${contractRet}`);
            confirmed = true;
            return txInfo;
        }
    } catch (err) {
        console.error('查询失败:', err);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

if (!confirmed) {
    console.log('轮询超时，交易确认失败');
}
}

/**
 * Fetches events associated with a specific transaction ID from the TRON blockchain.
 *
 * @async
 * @function getEvents
 * @param {string} transactionId - The ID of the transaction for which to fetch events.
 * @returns {Promise<Array>} A promise that resolves to an array of event data associated with the transaction.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getEvents(transactionId) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'TRON-PRO-API-KEY': 'b8ffb487-90b6-47b1-9f68-017c50be4d3c'
        }
    };

    try {
        const base = process.env.TRONGRID_API_BASE || 'https://nile.trongrid.io';
        const response = await fetch(`${base}/v1/transactions/${transactionId}/events?only_confirmed=true`, options);
        if (!response.ok) {
            const txt = await response.text();
            throw new Error(`TronGrid returned ${response.status}: ${txt}`);
        }
        const data = await response.json();
        return (data && data.data) ? data.data : [];
    } catch (err) {
        console.error('getEvents error:', err);
        throw err;
    }
}

    

//     const options = {method: 'GET', headers: {accept: 'application/json'}};

// fetch(`https://api.shasta.trongrid.io/v1/transactions/${transactionId}/events`, options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

//   =========

//   setInterval(async () => {
//     try {
//       // 获取最新区块号
//       const latestBlock = await tronWeb.trx.getCurrentBlock();
//       const currentBlock = latestBlock.block_header.raw_data.number;

//       if (currentBlock <= lastBlockChecked) return;
//       lastBlockChecked = currentBlock;

//       // 查询合约最近事件（limit 20-50，根据需要调整）
//       const events = await tronWeb.event.getEventsByContractAddress(
//         contractAddress,
//         {
//           event_name: 'PaymentExecuted',     // 事件名
//           only_confirmed: true,              // 只取已确认的
//           limit: 20,                         // 每轮最多取 20 条
//           order_by: 'block_timestamp,desc',  // 最新先
//           // 可选过滤：since: timestamp（毫秒），min_block: number
//         }
//       );

//       if (events && events.data && events.data.length > 0) {
//         for (const event of events.data) {
//           const { result, block_timestamp, transaction_id } = event;
//           console.log('新 PaymentExecuted 事件！');
//           console.log('Payer:', tronWeb.address.fromHex(result.payer));
//           console.log('Recipient:', tronWeb.address.fromHex(result.recipient));
//           console.log('Amount:', tronWeb.toDecimal(result.amount));  // uint256 转数字
//           console.log('OrderId:', tronWeb.toUtf8(result.orderId));   // string 转可读
//           console.log('TxID:', transaction_id);
//           console.log('Time:', new Date(block_timestamp).toISOString());

//           // 这里可以：存数据库、发 webhook、通知用户等
//         }
//       }
//     } catch (err) {
//       console.error('监听出错:', err);
//     }
//   }, 5000);  // 每 5 秒查一次（TRON 出块 ~3 秒，可调到 3000-10000 ms）
// }

    export async function stakeTrxForEnergy(myAddress) {
        // --- 场景 1: 质押 TRX 获取能量 (Freeze) ---
        // 在 Stake 2.0 中，这叫 "FreezeBalanceV2"
        // 注意: 质押后 TRX 会被锁定 14 天 (测试网可能不同，但机制一样)
        try {
            console.log("1. 正在质押 1000 TRX 以获取能量...");

            // freezeBalanceV2(amount, resource, options)
            // resource: 'ENERGY' 或 'BANDWIDTH'
            const freezeTx = await tronWeb.transactionBuilder.freezeBalanceV2(
                tronWeb.toSun(1000), // 质押 1000 TRX
                "ENERGY",            // 获取资源类型：能量
                myAddress            // 接收资源的所有者 (通常是自己)
            );

            // 签名并广播
            const signedFreeze = await tronWeb.trx.sign(freezeTx);
            const receiptFreeze = await tronWeb.trx.sendRawTransaction(signedFreeze);
            console.log("质押交易 Hash:", receiptFreeze.txid);

            // 等待几秒让链上确认...
            await new Promise(r => setTimeout(r, 5000));

            return receiptFreeze;
        } catch (e) {
            console.error("质押失败 (可能已经质押过了或余额不足):", e);
            throw e;
        }
    }
export async function stakeTrx(amountInTrx) {
    try {

        const contractAddress = contractADDRESS;
    const contract = await tronWeb.contract().at(contractAddress);

        // 将 TRX 转换为 Sun (1 TRX = 1,000,000 Sun)
        const amountInSun = tronWeb.toSun(amountInTrx);

        console.log(`正在质押 ${amountInTrx} TRX...`);
        
        // 调用合约 stake 方法，附带 value
        const txId = await contract.stake().send({
            callValue: amountInSun,
            feeLimit: 100_000_000 // 建议设置高一点的 feeLimit 防止能量不足
        });
        // 在 stakeTrx 函数里加这一行日志
console.log("当前正在执行质押的钱包地址是:", tronWeb.defaultAddress.base58);

        console.log("质押成功，交易哈希:", txId);

        
    } catch (error) {
        console.error("质押失败:", error);
    }
}

export async function getUserAssetValue(userAddress) { // 如果你是从外部传入地址
// export async function getUserAssetValue() {
    try {
        const contractAddress = contractADDRESS; 
        
        // 获取当前默认地址 (如果你是在后端 Node.js 环境，需要确保设置了 defaultAddress 或者传入 userAddress)
        // 假设你已经在外部设置了 tronWeb.setAddress(...) 或者在初始化时配了 privateKey
        // const userAddress = tronWeb.defaultAddress.base58; 

        // 1. 【核心修改】补充 getAssetValue 的 ABI 定义
        const abi = [
            {
                "inputs": [{"internalType": "address","name": "user","type": "address"}], // 输入参数：用户地址
                "name": "getAssetValue",
                "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],   // 输出参数：资产数值
                "stateMutability": "view", // 重点：这是 view 函数，不消耗能量
                "type": "function"
            }
        ];

        console.log(`正在查询地址 ${userAddress} 的资产...`);

        // 2. 初始化合约
        const contract = tronWeb.contract(abi, contractAddress);

        // 3. 调用方法
        // 注意：因为是查询(view)，所以用 .call() 而不是 .send()
        const valueInSun = await contract.getAssetValue(userAddress).call();
        
        // 4. 处理返回结果 (TronWeb 返回的是 BigNumber对象)
        // 将 SUN 转回 TRX 显示
        const valueInTrx = tronWeb.fromSun(valueInSun.toString());
        
        console.log(`查询成功! 当前资产价值: ${valueInTrx} TRX`);
        return valueInTrx;

    } catch (error) {
        console.error("查询资产失败:", error);
        throw error;
    }
}

export async function getStakePrincipal(userAddress) {
    try {
        const contractAddress = contractADDRESS;

        const abi = [
            {
                "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
                "name": "getStakePrincipal",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        const contract = tronWeb.contract(abi, contractAddress);
        const valueInSun = await contract.getStakePrincipal(userAddress).call();
        const valueInTrx = tronWeb.fromSun(valueInSun.toString());
        return valueInTrx;
    } catch (error) {
        console.error("查询质押本金失败:", error);
        throw error;
    }
}

// 也可以查询当前汇率 (TotalAssets / TotalShares) 仅供参考
export async function getExchangeRate() {
    const contractAddress = contractADDRESS;
    const contract = await tronWeb.contract().at(contractAddress);
    const totalAssets = await contract.totalAssets().call();
    const totalShares = await contract.totalShares().call();
    console.log(`当前总资产: ${tronWeb.fromSun(totalAssets.toString())} TRX, 总股份: ${totalShares.toString()}`);
    const assets = BigInt(totalAssets.toString());
    const shares = BigInt(totalShares.toString());
    if (shares === 0n) return { rate: 1, yieldPercent: 0 };
    const bps = (assets - shares) * 10000n / shares;
    const yieldPercent = Number(bps) / 100;
    const rate = 1 + (yieldPercent / 100);
    return { rate, yieldPercent };
}

export async function unstakeTrx(amountTrxWanted) {
    try {

        const contractAddress = contractADDRESS;
        const contract = await tronWeb.contract().at(contractAddress);
        
        const amountSunWanted = tronWeb.toSun(amountTrxWanted);
        
        // 1. 获取当前状态
        const totalAssets = await contract.totalAssets().call();
        const totalShares = await contract.totalShares().call();
        
        // 2. 反向计算需要的 Share 数量
        // Formula: SharesNeeded = (AmountWanted * TotalShares) / TotalAssets
        // 为了防止精度丢失导致取出的稍微少一点点，建议稍微向上取整或由用户直接输入 shares
        let sharesToBurn =  tronWeb.BigNumber(amountSunWanted)
                            .times(totalShares)
                            .div(totalAssets)
                            .integerValue(tronWeb.BigNumber.ROUND_CEIL); // 向上取整

        console.log(`申请提取 ${amountTrxWanted} TRX, 预计销毁股份: ${sharesToBurn.toString()}`);

        // 3. 调用 unstake
        const txId = await contract.unstake(sharesToBurn.toString()).send({
            feeLimit: 100_000_000
        });

        console.log("提现申请提交:", txId);
        alert("提现成功！");

    } catch (error) {
        console.error("提现失败:", error);
        // 如果错误包含 "Insufficient liquidity"，提示用户等待管理员释放资金
        if (error.toString().includes("Insufficient liquidity")) {
            alert("资金池流动性不足，请等待管理员解质押后重试。");
        }
    }
}

export async function injectReward(rewardAmount) {
    // 假设你今天通过投票赚了 50 TRX，或者省下了 50 TRX 手续费
    // 你决定把这 50 TRX 分给所有用户
    // const rewardAmount = 50; 

    console.log(`准备注入分红: ${rewardAmount} TRX`);

    try {
        const contract = await tronWeb.contract().at(contractADDRESS);
        
        // 调用 injectReward
        const txId = await contract.injectReward().send({
            callValue: tronWeb.toSun(rewardAmount), // 发送 TRX
            feeLimit: 100_000_000
        });

        console.log(`✅ 分红注入成功! 交易哈希: ${txId}`);
        console.log(`🚀 所有用户的资产价值已上涨！`);

    } catch (e) {
        console.error("注入失败:", e);
    }


}