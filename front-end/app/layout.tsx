import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Professional Admin Dashboard with Dynamic Navigation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-fira-sans bg-[#050505] text-slate-100">
        {children}
      </body>
    </html>
  );
}
