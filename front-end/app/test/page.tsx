'use client';

import { useEffect, useState } from 'react';

export default function ConnectTron() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      if (typeof window === 'undefined') return;

      const tronLink = (window as any).tronWeb;

      if (!tronLink) {
        alert('请先安装 TronLink');
        return;
      }

      // 请求授权
      await tronLink.request({ method: 'tron_requestAccounts' });

      const addr = tronLink.defaultAddress.base58;
      setAddress(addr);
    };

    connect();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex items-center justify-center">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-4">
        {address ? (
          <p>Connected: {address}</p>
        ) : (
          <p>Connecting...</p>
        )}
      </div>
    </div>
  );
}
