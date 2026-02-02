import 'dotenv/config';
import * as TronWebPkg from "tronweb";

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

     console.log("buyer valid:", tronWeb.isAddress(buyer));
console.log("seller valid:", tronWeb.isAddress(seller));

    const tx = await agentPayContract.executePayment(buyer, seller, amount, orderId).send({
        feeLimit: 100_000_000
    });
    console.log("交易成功，TXID:", tx);
    return tx;
}




