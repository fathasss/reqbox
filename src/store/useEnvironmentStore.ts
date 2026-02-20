import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Environment {
  id: string;
  name: string;
  baseUrl: string;
}

interface EnvironmentState {
  environments: Environment[];
  selectedEnvironmentId: string | null;
  addEnvironment: (env: Omit<Environment, 'id'>) => void;
  removeEnvironment: (id: string) => void;
  setSelectedEnvironment: (id: string | null) => void;
}

const useEnvironmentStore = create<EnvironmentState>()(
  persist(
    (set) => ({
      environments: [
        { id: '1', name: 'Production', baseUrl: 'https://api.example.com' },
        { id: '2', name: 'Staging', baseUrl: 'https://staging.example.com' },
      ],
      selectedEnvironmentId: null,
      
      addEnvironment: (env) => set((state) => ({
        environments: [...state.environments, { ...env, id: Date.now().toString() }]
      })),
      
      removeEnvironment: (id) => set((state) => ({
        environments: state.environments.filter(e => e.id !== id),
        selectedEnvironmentId: state.selectedEnvironmentId === id ? null : state.selectedEnvironmentId
      })),
      
      setSelectedEnvironment: (id) => set({ selectedEnvironmentId: id }),
    }),
    {
      name: 'mobile-postman-environments',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useEnvironmentStore;
