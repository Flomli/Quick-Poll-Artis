export type ThemeType = 'neon' | 'pastel' | 'minimal' | 'bold';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  theme: ThemeType;
  createdAt: number;
  authorAddress?: string;
  totalVotes: number;
}

export interface VoteRecord {
  pollId: string;
  optionId: string;
  voterAddress: string;
  timestamp: number;
}
