import React, { useState } from 'react';
import { ThemeType } from '../types';
import { motion } from 'motion/react';
import { Plus, Trash2, Palette, Send } from 'lucide-react';

interface PollFormProps {
  onSubmit: (data: { question: string; options: string[]; theme: ThemeType }) => void;
  currentTheme: ThemeType;
}

export const PollForm: React.FC<PollFormProps> = ({ onSubmit, currentTheme }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [theme, setTheme] = useState<ThemeType>(currentTheme);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question && options.every(opt => opt.trim())) {
      onSubmit({ question, options, theme });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleSubmit}
      className="w-full space-y-8"
    >
      <div className="space-y-4">
        <label className="text-[14px] uppercase tracking-[2px] font-black text-white/40">Question</label>
        <input
          required
          placeholder="ENTER YOUR QUESTION..."
          className="w-full bg-[#111111] border border-white/10 rounded-2xl p-6 text-2xl font-black uppercase outline-none focus:border-[#0052FF] transition-all placeholder:opacity-20"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <label className="text-[14px] uppercase tracking-[2px] font-black text-white/40">Options</label>
        {options.map((opt, i) => (
          <div key={i} className="flex gap-3">
            <input
              required
              placeholder={`OPTION ${i + 1}`}
              className="flex-1 bg-[#111111] border border-white/10 rounded-2xl p-5 outline-none focus:border-[#0052FF] transition-all font-bold uppercase"
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value.toUpperCase())}
            />
            {options.length > 2 && (
              <button 
                type="button"
                onClick={() => handleRemoveOption(i)} 
                className="p-5 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        {options.length < 5 && (
          <button
            type="button"
            onClick={handleAddOption}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[2px] opacity-40 hover:opacity-100 transition-opacity p-2 ml-auto"
          >
            <Plus size={14} /> Add option
          </button>
        )}
      </div>

      <div className="space-y-4">
        <label className="text-[14px] uppercase tracking-[2px] font-black text-white/40 flex items-center gap-2">
          <Palette size={16} /> Theme Override
        </label>
        <div className="grid grid-cols-4 gap-3">
          {(['bold', 'neon', 'pastel', 'minimal'] as ThemeType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`p-4 rounded-xl border transition-all uppercase text-[10px] font-black tracking-widest ${
                theme === t ? 'bg-white text-black border-white scale-105' : 'border-white/10 hover:bg-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-6 rounded-2xl bg-white text-black font-black text-xl uppercase tracking-widest hover:bg-white/90 shadow-2xl transition-all"
      >
        <div className="flex items-center justify-center gap-3">
          <Send size={24} /> Create Artisan Poll
        </div>
      </motion.button>
    </motion.form>
  );
};
