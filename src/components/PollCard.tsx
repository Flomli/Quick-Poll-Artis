import React from 'react';
import { Poll } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Share2, Wallet } from 'lucide-react';
import { cn } from './ThemeWrapper';

interface PollCardProps {
  poll: Poll;
  onVote: (optionId: string) => void;
  hasVoted?: boolean;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, onVote, hasVoted }) => {
  const isBold = poll.theme === 'bold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "max-w-3xl w-full",
        !isBold && "p-8 rounded-3xl border bg-card-app border-app shadow-2xl backdrop-blur-sm"
      )}
    >
      <div className="mb-10">
        <h3 className={cn(
          "text-3xl font-display font-bold tracking-tight mb-4 leading-tight",
          isBold && "bold-headline"
        )}>
          {poll.question}
        </h3>
        <p className="text-sm opacity-50 font-bold uppercase tracking-[2px] flex items-center gap-2">
          {poll.totalVotes.toLocaleString()} votes cast
          {hasVoted && (
            <span className="flex items-center gap-1 text-emerald-500">
              <CheckCircle2 size={14} /> Recorded
            </span>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {poll.options.map((option) => {
          const percent = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
          
          return (
            <motion.button
              key={option.id}
              whileHover={!hasVoted ? { scale: 1.01, x: 5 } : {}}
              whileTap={!hasVoted ? { scale: 0.99 } : {}}
              disabled={hasVoted}
              onClick={() => onVote(option.id)}
              className={cn(
                "w-full relative h-[72px] rounded-2xl border border-white/5 bg-[#111111] overflow-hidden flex items-center px-6 transition-all",
                !hasVoted && "cursor-pointer hover:border-white/20",
                hasVoted && "cursor-default"
              )}
            >
              {/* Progress Fill */}
              {hasVoted && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#0052FF] to-[#00F0FF] opacity-15 z-10"
                />
              )}
              
              <div className="relative z-20 w-full flex justify-between items-center">
                <span className="text-lg font-bold uppercase tracking-tight">{option.text}</span>
                {hasVoted && (
                  <span className="text-xl font-black font-mono tracking-tighter">{percent}%</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center opacity-40 text-[10px] font-bold uppercase tracking-[2px]">
        <button className="flex items-center gap-2 hover:opacity-100 transition-opacity">
          <Share2 size={14} /> Share Artisan Poll
        </button>
        <div className="flex items-center gap-2">
          <Wallet size={12} /> Base Network
        </div>
      </div>
    </motion.div>
  );
};
