// contexts/wallet-context.tsx
import { create } from 'zustand';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  enrollmentId?: string;
  resourceId?: string;
  courseId?: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchBalance: (userId: string) => Promise<void>;
  addFunds: (
    userId: string,
    amount: number,
    enrollmentId?: string
  ) => Promise<void>;
  makePayment: (
    userId: string,
    amount: number,
    courseId?: string,
    resourceId?: string
  ) => Promise<void>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,

  fetchBalance: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/user/${userId}/balance`);
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      set({
        balance: data.balance,
        transactions: data.transactions,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch balance',
        isLoading: false,
      });
    }
  },

  addFunds: async (userId, amount, enrollmentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/user/${userId}/balance/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, enrollmentId }),
      });

      if (!response.ok) throw new Error('Failed to add funds');

      const data = await response.json();
      set((state) => ({
        balance: data.newBalance,
        transactions: [data.transaction, ...state.transactions],
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to add funds',
        isLoading: false,
      });
      throw err;
    }
  },

  makePayment: async (userId, amount, courseId, resourceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/user/${userId}/balance/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, courseId, resourceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }

      const data = await response.json();
      set((state) => ({
        balance: data.newBalance,
        transactions: [data.transaction, ...state.transactions],
        isLoading: false,
      }));
      return data;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Payment failed',
        isLoading: false,
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
