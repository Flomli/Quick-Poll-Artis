/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/web3';
import { ThemeWrapper } from './components/ThemeWrapper';
import { PollForm } from './components/PollForm';
import { PollCard } from './components/PollCard';
import { CheckInButton } from './components/CheckInButton';
import { Poll, ThemeType } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Plus, ListFilter, Sparkles, LogOut, ArrowLeft } from 'lucide-react';

const queryClient = new QueryClient();

function PollApp() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [view, setView] = useState<'landing' | 'create' | 'poll'>('landing');
  const [theme, setTheme] = useState<ThemeType>('bold');
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  const [recentPolls, setRecentPolls] = useState<Poll[]>([
    {
      id: '1',
      question: "WHAT'S THE GOAT ASSET ON BASE?",
      options: [
        { id: 'a', text: 'ETH (The Classic) 💎', votes: 64 },
        { id: 'b', text: 'USDC (Stability) 💵', votes: 22 },
        { id: 'c', text: 'New Memes (Degen Mode) 🐸', votes: 14 }
      ],
      theme: 'bold',
      createdAt: Date.now(),
      totalVotes: 100
    }
  ]);

  const handleCreatePoll = (data: { question: string; options: string[]; theme: ThemeType }) => {
    const newPoll: Poll = {
      id: Math.random().toString(36).substr(2, 9),
      question: data.question.toUpperCase(),
      options: data.options.map(opt => ({ id: Math.random().toString(36).substr(2, 5), text: opt, votes: 0 })),
      theme: data.theme,
      createdAt: Date.now(),
      authorAddress: address,
      totalVotes: 0
    };
    
    setRecentPolls([newPoll, ...recentPolls]);
    setActivePoll(newPoll);
    setTheme(data.theme);
    setView('poll');
    setHasVoted(false);
  };

  const handleVote = (optionId: string) => {
    if (!activePoll || hasVoted) return;
    
    const updatedOptions = activePoll.options.map(opt => 
      opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    );
    
    const updatedPoll = {
      ...activePoll,
      options: updatedOptions,
      totalVotes: activePoll.totalVotes + 1
    };
    
    setActivePoll(updatedPoll);
    setHasVoted(true);
    setRecentPolls(prev => prev.map(p => p.id === activePoll.id ? updatedPoll : p));
  };

  return (
    <ThemeWrapper theme={theme}>
      <nav className="h-20 px-10 flex items-center justify-between border-b border-white/10">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => { setView('landing'); setTheme('bold'); }}
        >
          <span className="text-[#0052FF] text-2xl font-black">●</span>
          <h1 className="text-2xl font-black tracking-tighter">
            QUICK POLL ARTIST
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[12px] text-white/40 font-bold uppercase tracking-widest hidden sm:block">NO API • ON-CHAIN DATA</span>
          {isConnected ? (
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 rounded-full border border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF] text-xs font-bold uppercase">
                Base Mainnet
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <button 
                  onClick={() => disconnect()}
                  className="p-2.5 rounded-xl border border-white/10 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => connect({ connector: connectors[0] })}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-black uppercase text-xs tracking-wider hover:bg-white/90 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 p-10 min-h-[calc(100vh-140px)]">
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {view === 'landing' && (
              <motion.div 
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <div className="text-[#FF00E5] italic font-medium">#DailyVibeCheck</div>
                  <h2 className="bold-headline">
                    WHAT'S THE<br />GOAT ASSET<br />ON BASE?
                  </h2>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setView('create')}
                    className="px-10 py-5 rounded-2xl bg-white text-black font-black text-lg uppercase tracking-wider hover:bg-white/90 transition-all active:scale-95"
                  >
                    Create a Poll
                  </button>
                </div>

                <div className="space-y-8 pt-10">
                  <p className="text-xs uppercase tracking-[4px] font-bold text-white/40">Recent Artisan Polls</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentPolls.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => { setActivePoll(p); setTheme(p.theme); setView('poll'); }}
                        className="p-6 rounded-2xl border border-white/10 bg-[#111111] cursor-pointer hover:border-white/30 transition-all group"
                      >
                        <span className="text-[10px] uppercase font-bold text-white/30 mb-2 block">{p.theme} theme</span>
                        <h4 className="text-xl font-black mb-4 line-clamp-2 uppercase tracking-tight">{p.question}</h4>
                        <div className="flex justify-between items-center text-white/40 text-[10px] uppercase font-bold tracking-widest">
                          <span>{p.totalVotes} votes</span>
                          <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'create' && (
              <motion.div 
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <button 
                  onClick={() => setView('landing')}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-white/50 hover:text-white transition-opacity"
                >
                  <ArrowLeft size={14} /> Back to dashboard
                </button>
                <div className="max-w-xl">
                  <PollForm onSubmit={handleCreatePoll} currentTheme={theme} />
                </div>
              </motion.div>
            )}

            {view === 'poll' && activePoll && (
              <motion.div 
                key="poll-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <button 
                  onClick={() => setView('landing')}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-white/50 hover:text-white transition-opacity"
                >
                  <ArrowLeft size={14} /> Return landing
                </button>
                <div className="flex flex-col gap-10">
                  <PollCard poll={activePoll} onVote={handleVote} hasVoted={hasVoted} />
                  
                  {hasVoted && (
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 max-w-xl">
                      <p className="font-black uppercase tracking-tight text-emerald-500 text-lg">Vote Captured!</p>
                      <p className="text-xs text-emerald-500/70 font-bold uppercase tracking-widest mt-1">Processed locally on-chain simulation</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="bg-[#111111] rounded-[32px] p-8 border border-white/10 flex flex-col gap-10">
          <div className="space-y-4">
            <p className="text-[14px] uppercase tracking-[2px] text-white/40 font-bold">Custom Design</p>
            <div className="grid grid-cols-2 gap-3">
              {(['bold', 'neon', 'pastel', 'minimal'] as ThemeType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`h-[50px] rounded-xl border flex items-center justify-center text-[13px] font-bold uppercase transition-all ${
                    theme === t ? 'bg-white text-black border-white' : 'border-white/10 text-white hover:bg-white/5'
                  }`}
                >
                  {t === 'bold' ? 'DEEP SPACE' : t === 'neon' ? 'NEON DREAM' : t === 'pastel' ? 'PASTEL SOFT' : 'MINIMALIST'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[14px] uppercase tracking-[2px] text-white/40 font-bold">Export Tools</p>
            <div className="flex flex-col gap-2">
              <button className="h-[50px] rounded-xl border border-white/10 text-white font-bold uppercase text-[13px] hover:bg-white/5 transition-all">
                GENERATE SHARE LINK
              </button>
              <button className="h-[50px] rounded-xl border border-white/10 text-white font-bold uppercase text-[13px] hover:bg-white/5 transition-all">
                COPY FRAME URL
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <CheckInButton />
          </div>
        </aside>
      </main>

      <footer className="h-[60px] px-10 flex items-center justify-between text-[11px] text-white/30 uppercase tracking-[2px] font-bold border-t border-white/5">
        <div>TOTAL VOTES: {recentPolls.reduce((acc, p) => acc + p.totalVotes, 0).toLocaleString()} • LAST VOTE: JUST NOW</div>
        <div className="flex items-center gap-6">
          <span>POWERED BY BASE</span>
          <span>GAS COST: &lt;$0.01</span>
        </div>
      </footer>
    </ThemeWrapper>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PollApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
