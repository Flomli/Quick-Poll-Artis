import React from 'react';
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CHECK_IN_CONTRACT_ADDRESS, CHECK_IN_ABI } from '../lib/web3';
import { motion } from 'motion/react';
import { Loader2, Zap, ShieldCheck } from 'lucide-react';
import { encodeFunctionData } from 'viem';

export const CheckInButton: React.FC = () => {
  const { isConnected, address, chain } = useAccount();
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Base Builder Code: bc_jjidt7s3
  // Hex representation: 62635f6a6a6a696474377333
  const BUILDER_CODE_SUFFIX = '62635f6a6a6a696474377333';

  const handleCheckIn = async () => {
    if (!isConnected || !address || !chain) return;
    
    try {
      // 1. Encode the function data using ABI
      const baseData = encodeFunctionData({
        abi: CHECK_IN_ABI,
        functionName: 'checkIn',
      });

      // 2. Append the builder code suffix
      const attributedData = `${baseData}${BUILDER_CODE_SUFFIX}` as `0x${string}`;

      // 3. Send the attributed transaction
      sendTransaction({
        to: CHECK_IN_CONTRACT_ADDRESS as `0x${string}`,
        data: attributedData,
        chain: chain,
        account: address,
      });
    } catch (err) {
      console.error('Failed to encode/send attributed transaction:', err);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-[20px] bg-gradient-to-br from-[#0052FF] to-[#002D8F] text-white">
      <div className="text-center">
        <h4 className="text-lg font-black tracking-tight mb-2">
          DAILY CHECK-IN
        </h4>
        <p className="text-[12px] opacity-80 leading-relaxed font-bold uppercase tracking-tight">
          Boost your voting power! Free mint, pay only gas on Base.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isPending || isConfirming || isSuccess}
        onClick={handleCheckIn}
        className="w-full py-3 rounded-xl bg-white text-black font-black uppercase text-[14px] tracking-widest disabled:opacity-50 transition-all shadow-lg"
      >
        <span className="flex items-center justify-center gap-2">
          {isPending || isConfirming ? (
            <Loader2 className="animate-spin" size={16} />
          ) : isSuccess ? (
            <ShieldCheck size={16} />
          ) : (
            'CLAIM STREAK'
          )}
        </span>
      </motion.button>

      {error && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] text-white font-bold max-w-[200px] text-center uppercase tracking-tighter opacity-60">
            {error.message.includes('User rejected') ? 'Transaction rejected' : 'Error checking in.'}
          </p>
          <p className="text-[8px] text-red-300 font-mono opacity-50 break-all max-w-[200px] text-center">
            {error.message.substring(0, 100)}...
          </p>
        </div>
      )}
      
      {isSuccess && (
        <p className="text-[10px] text-white font-black uppercase tracking-widest animate-pulse">
          SUCCESS! YOU ARE CHECKED IN.
        </p>
      )}
    </div>
  );
};
