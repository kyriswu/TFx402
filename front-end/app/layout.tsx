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
      <body className="font-fira-sans">
        {children}
      </body>
    </html>
  );
}
