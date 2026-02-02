'use client';

import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { SmartAccount, AAWrapProvider, SendTransactionMode } from '@particle-network/aa';
// 从环境变量读取（强烈推荐！不要硬编码）
const PROJECT_ID = '232b0faa-b22e-40e5-abcd-dcb888c0d306';
const CLIENT_KEY = 'cSAo1vU2lAy7E4NieXmz92Aw6w4PYB2Hw508lYUT';
const APP_ID = 'a4646b7e-fc83-45dd-9498-4aa9ecc28ebc';

// 私钥（仅测试！生产移除或改成用户输入）
const PRIVATE_KEY = '0x6b1ef23fe4895982f780da464c635466f2fc135eea832d40ff7c90902043fa2b';

export default function Page() {
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  const [smartAddress, setSmartAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('初始化中...');
  const [error, setError] = useState<string | null>(null);

  // 自定义 EIP-1193 Provider（优化签名支持）
  const customEIP1193Provider = useMemo(() => {
    if (!PRIVATE_KEY) throw new Error('私钥缺失');

    const wallet = new ethers.Wallet(PRIVATE_KEY);
    const jsonRpcProvider = new ethers.JsonRpcProvider('https://evmtestnet.confluxrpc.com');
    const signer = wallet.connect(jsonRpcProvider);

    return {
      request: async ({ method, params }: { method: string; params: any[] }) => {
        switch (method) {
          case 'eth_requestAccounts':
          case 'eth_accounts':
            return [wallet.address];

          case 'eth_chainId':
            return '0x47'; // 71 in hex

          case 'eth_getBalance':
          case 'eth_call':
          case 'eth_estimateGas':
          case 'eth_blockNumber':
          case 'eth_gasPrice':
            return jsonRpcProvider.send(method, params);

          case 'personal_sign':
          case 'eth_sign':
            const [data] = params;
            return signer.signMessage(ethers.getBytes(data));

          case 'eth_signTypedData_v4':
            const [, typedData] = params;
            return signer.signTypedData(
              typedData.domain,
              typedData.types,
              typedData.message
            );

          default:
            return jsonRpcProvider.send(method, params);
        }
      },
    };
  }, []);

  useEffect(() => {
    if (!PROJECT_ID || !CLIENT_KEY || !APP_ID) {
      setError('缺少 Particle 配置（PROJECT_ID / CLIENT_KEY / APP_ID）');
      setStatus('配置错误');
      return;
    }

    try {
      const sa = new SmartAccount(customEIP1193Provider, {
        projectId: PROJECT_ID,
        clientKey: CLIENT_KEY,
        appId: APP_ID,
        aaOptions: {
          accountContracts: {
            // 选项1：推荐 BICONOMY v2.0.0（更好 gasless 支持）
            SIMPLE: [
              {
                version: '2.0.0',
                chainIds: [71], // Conflux eSpace 主网；测试网用 [71]
              },
            ],

            // 选项2：如果 BICONOMY 不行，换 SIMPLE（更轻量）
            // SIMPLE: [{ version: '2.0.0', chainIds: [1030] }],

            // 可同时支持多个实现
            // LIGHT: [{ version: '1.0.0', chainIds: [1030] }],
          },
        },
      });

      setSmartAccount(sa);

      // 获取 counterfactual 地址
      sa.getAddress()
        .then((addr) => {
          setSmartAddress(addr);
          setStatus(`Smart Account 初始化成功！地址: ${addr}`);
        })
        .catch((err) => {
          setError(err.message || '获取地址失败');
          setStatus('获取地址失败');
        });
    } catch (err: any) {
      setError(err.message || 'SmartAccount 初始化异常');
      setStatus('初始化失败');
    }
  }, [customEIP1193Provider]);

  // 发送 gasless 示例交易
  const sendExampleTx = async () => {
    if (!smartAccount) {
      setError('SmartAccount 未就绪');
      return;
    }

    setStatus('准备发送...');
    setError(null);

    try {
      const tx = {
        to: '0x000000000000000000000000000000000000dEaD',
        value: ethers.parseEther('0.0001').toString(),
        data: '0x',
      };

      const feeQuotes = await smartAccount.getFeeQuotes([tx]);

      const selected = feeQuotes.verifyingPaymasterGasless || feeQuotes.verifyingPaymaster || feeQuotes.userPaid;

      if (!selected) throw new Error('无可用 fee quote（检查 dashboard Paymaster 信用）');

      const { userOp, userOpHash } = selected;
      const txHash = await smartAccount.sendUserOperation({ userOp, userOpHash });

      setStatus(`交易发送成功！Hash: ${txHash}`);
    } catch (err: any) {
      setError(err.message || '交易失败');
      setStatus('交易失败');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 py-12">
      <div className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h1 className="text-2xl font-semibold text-white">Particle AA + 自定义私钥</h1>

        <p className="mt-4 text-slate-300">
          <strong>状态：</strong> {status}
        </p>
        {smartAddress && (
          <p className="text-slate-300">
            <strong>Smart Account 地址：</strong> {smartAddress}
          </p>
        )}
        {error && (
          <p className="text-[#EF4444]">
            <strong>错误：</strong> {error}
          </p>
        )}

        <div className="mt-8">
          <button
            onClick={sendExampleTx}
            disabled={!smartAccount}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-[#050505] font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            发送 0.0001 CFX（尝试 Gasless）
          </button>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          注意：私钥硬编码仅测试用！生产请用安全方式（如用户导入或后端签名）。确保 Particle Dashboard 已启用对应 Paymaster。
        </p>
      </div>
    </div>
  );
}