// src copy/features/mixer/types/hooks.types.ts
import type { MixPool } from './mixer';

export interface MixFormLogicProps {
  initialPoolId?: string;
  initialAmount?: string;
  initialNote?: string;
  initialDelayHours?: number;
  onMixSuccess?: () => void;
}

export interface UseMixFormLogicReturn {
  // Состояния
  amount: string;
  note: string;
  amountError: string;
  selectedPool: string;
  delayHours: number;
  isMixing: boolean;
  
  // Данные
  availablePools: MixPool[];
  user: any;
  
  // Обработчики
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNoteChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePoolChange: (poolId: string) => void;
  handleDelayHoursChange: (hours: number) => void;
  handleMix: () => Promise<void>;
  
  // Вспомогательные функции
  validateAmount: (value: string) => boolean;
  calculateFee: () => number;
  getPoolById: (id: string) => MixPool | undefined;
}