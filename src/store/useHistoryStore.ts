import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface HistoryItem {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  timestamp: number;
  statusCode: number;
  duration: number;
  ok: boolean;
}

interface HistoryState {
  history: HistoryItem[];
  addToHistory: (request: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
}

const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      
      addToHistory: (request) => {
        const newItem: HistoryItem = {
          ...request,
          id: uuidv4(),
          timestamp: Date.now(),
        };
        set((state) => ({
          history: [newItem, ...state.history].slice(0, 50), // Keep last 50 requests
        }));
      },

      clearHistory: () => set({ history: [] }),
      
      deleteHistoryItem: (id) => set((state) => ({
        history: state.history.filter((item) => item.id !== id),
      })),
    }),
    {
      name: 'mobile-postman-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useHistoryStore;
