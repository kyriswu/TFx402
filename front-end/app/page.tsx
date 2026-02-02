'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AgentPayLandingPage() {
  const handleLogin = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const apibaseUrl = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    console.log(apibaseUrl);

    if (!apibaseUrl) {
      console.error('Google Client ID is not configured');
      return;
    }

    if (!redirect_uri) {
      console.error('Redirect URI is not configured');
      return;
    }

    const options = {
      redirect_uri: redirect_uri,
      client_id: apibaseUrl,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'openid',
      ].join(' '),
    };

    const qs = new URLSearchParams(options).toString();
    window.location.href = `${rootUrl}?${qs}`;
  };


  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
                <svg className="w-5 h-5 text-[#050505]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-wide">AgentPay</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer">Features</a>
              <a href="#risk" className="text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer">Risk Controls</a>
              <a href="#policies" className="text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer">Policies</a>
              <a href="#security" className="text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer">Security</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogin}
                className="px-4 py-2 rounded-lg bg-white text-[#050505] font-medium hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
              >
                Sign in with Google
              </button>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-white/20 text-white hover:border-white/40 transition-colors duration-200 cursor-pointer"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#22D3EE]/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                Bank-grade security • Social login ready
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                The Trusted Financial Layer
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]">
                  for Autonomous Agents
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-300 max-w-xl">
                Manage risk, set limits, and authorize transactions for your AI agents using seamless social login and bank-grade security policies.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-[#050505] font-semibold hover:shadow-lg hover:shadow-[#22D3EE]/30 transition-all duration-200 cursor-pointer text-center"
                >
                  Get started with Google
                </button>
                <a
                  href="#policies"
                  className="px-6 py-3 rounded-lg border border-white/20 text-white hover:border-white/40 transition-colors duration-200 cursor-pointer text-center"
                >
                  View policy examples
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 text-sm text-slate-400">
                <div>
                  <div className="text-white text-xl font-semibold">99.99%</div>
                  Policy uptime
                </div>
                <div>
                  <div className="text-white text-xl font-semibold">24/7</div>
                  Risk monitoring
                </div>
                <div>
                  <div className="text-white text-xl font-semibold">SOC2</div>
                  Compliant
                </div>
              </div>
            </div>

            {/* Glassmorphism Demo */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] opacity-30 blur-2xl"></div>
              <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-300">Agent Policy Console</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#10B981]/20 text-[#10B981]">Risk Check passed</span>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#0B1220] border border-white/10 p-4">
                    <div className="text-xs text-slate-400 mb-2">Active Limit</div>
                    <div className="text-2xl font-semibold text-white">$25,000 / day</div>
                    <div className="text-xs text-slate-500 mt-1">Auto-approve under $250</div>
                  </div>
                  <div className="rounded-xl bg-[#0B1220] border border-white/10 p-4">
                    <div className="text-xs text-slate-400 mb-2">Pending Transaction</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Agent #2042</div>
                        <div className="text-xs text-slate-500">Vendor: Sentinel Cloud</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">$1,250</div>
                        <div className="text-xs text-[#EF4444]">High Risk Blocked</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                  Real-time policy enforcement
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold">Built for trust and control</h2>
            <p className="text-slate-400 mt-3">Minimalist workflows with transparent security at every step.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Transparent flows',
                body: 'Visualize every agent payment with auditable policy trails and instant alerts.',
              },
              {
                title: 'Connection graph',
                body: 'Understand how agents, wallets, and vendors connect with live network mapping.',
              },
              {
                title: 'Glass-grade security',
                body: 'Glassmorphism cards reveal exactly what the agent is allowed to do.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-white/20 hover:shadow-lg hover:shadow-white/5 transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#050505]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Controls */}
      <section id="risk" className="py-20 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Real-time risk intelligence</h2>
              <p className="text-slate-400 mb-8">
                Score every transaction instantly. Approve safe actions and stop high-risk requests before funds move.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <div className="text-white font-medium">Risk Check passed</div>
                    <div className="text-xs text-slate-500">Vendor: Atlas Compute</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#10B981]/20 text-[#10B981]">Approved</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <div className="text-white font-medium">High Risk Blocked</div>
                    <div className="text-xs text-slate-500">Vendor: Shadow API</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#EF4444]/20 text-[#EF4444]">Blocked</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="text-sm text-slate-300 mb-4">Live Risk Feed</div>
              <div className="space-y-3">
                {[
                  { label: 'Agent #118', status: 'Approved', color: 'text-[#10B981]' },
                  { label: 'Agent #2042', status: 'Blocked', color: 'text-[#EF4444]' },
                  { label: 'Agent #509', status: 'Approved', color: 'text-[#10B981]' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg bg-[#0B1220] border border-white/10 px-4 py-3">
                    <span className="text-slate-200 text-sm">{row.label}</span>
                    <span className={`text-xs font-semibold ${row.color}`}>{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies */}
      <section id="policies" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Policy templates for every agent</h2>
              <p className="text-slate-400 mb-6">
                Define guardrails in plain language or write advanced policies with developer-friendly syntax.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-300">Policy Builder</span>
                  <span className="text-xs text-slate-500">Version 2.1</span>
                </div>
                <pre className="text-xs text-slate-200 font-jetbrains-mono bg-[#0B1220] border border-white/10 rounded-xl p-4 overflow-x-auto">
{`policy "agent_ops" {
  allow vendors in ["Atlas", "Nova"]
  limit daily_spend <= 25000
  require mfa for spend > 1000
  block categories in ["gambling", "unknown"]
}`}
                </pre>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Connection Map</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Visualize agent-to-wallet connections with live node status.
                </p>
                <div className="rounded-xl bg-[#0B1220] border border-white/10 p-4">
                  <svg className="w-full h-40" viewBox="0 0 400 160" aria-hidden="true">
                    <defs>
                      <linearGradient id="line" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                      </linearGradient>
                    </defs>
                    <line x1="40" y1="80" x2="200" y2="40" stroke="url(#line)" strokeWidth="2" />
                    <line x1="200" y1="40" x2="360" y2="90" stroke="url(#line)" strokeWidth="2" />
                    <line x1="200" y1="40" x2="200" y2="130" stroke="url(#line)" strokeWidth="2" />
                    <circle cx="40" cy="80" r="10" fill="#10B981" />
                    <circle cx="200" cy="40" r="12" fill="#8B5CF6" />
                    <circle cx="360" cy="90" r="10" fill="#22D3EE" />
                    <circle cx="200" cy="130" r="10" fill="#EF4444" />
                  </svg>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Transparent approvals</h3>
                <p className="text-sm text-slate-400">
                  Every decision is logged with instant audit trails and explainable AI notes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 bg-[#0B1220]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Security you can prove</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10">
            Built with bank-grade encryption, continuous compliance monitoring, and secure social login.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'SOC 2 Type II', body: 'Continuous audits and verified controls.' },
              { title: 'Zero-Trust Access', body: 'Every agent action is verified and scoped.' },
              { title: 'Encrypted Vault', body: 'Keys never leave the secured runtime.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-white/0 backdrop-blur-xl p-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Ready to activate AgentPay?</h2>
            <p className="text-slate-400 mb-8">
              The Trusted Financial Layer for Autonomous Agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={handleLogin}
                className="px-6 py-3 rounded-lg bg-white text-[#050505] font-semibold hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
              >
                Sign in with Google
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-lg border border-white/20 text-white hover:border-white/40 transition-colors duration-200 cursor-pointer"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>© 2026 AgentPay. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">Privacy</a>
            <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">Terms</a>
            <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
