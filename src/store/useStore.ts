import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Video } from '../data/database';
import { INITIAL_VIDEOS } from '../data/database';

interface AppState {
  savedVideos: Video[];
  savedPlayerIds: string[];
  searchHistory: string[];
  currentView: 'home' | 'player' | 'videos' | 'tournaments' | 'players';
  selectedPlayerId: string | null;
  addVideo: (video: Video) => void;
  removeVideo: (id: string) => void;
  toggleSaveVideo: (id: string) => void;
  toggleSavePlayer: (id: string) => void;
  addToHistory: (query: string) => void;
  setCurrentView: (view: 'home' | 'player' | 'videos' | 'tournaments' | 'players') => void;
  setSelectedPlayer: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      savedVideos: INITIAL_VIDEOS,
      savedPlayerIds: [],
      searchHistory: [],
      currentView: 'home',
      selectedPlayerId: null,
      addVideo: (video) =>
        set((state) => ({
          savedVideos: [...state.savedVideos, { ...video, addedAt: new Date().toISOString().split('T')[0], isSaved: true }],
        })),
      removeVideo: (id) =>
        set((state) => ({
          savedVideos: state.savedVideos.filter((v) => v.id !== id),
        })),
      toggleSaveVideo: (id) =>
        set((state) => ({
          savedVideos: state.savedVideos.map((v) =>
            v.id === id ? { ...v, isSaved: !v.isSaved } : v
          ),
        })),
      toggleSavePlayer: (id) =>
        set((state) => ({
          savedPlayerIds: state.savedPlayerIds.includes(id)
            ? state.savedPlayerIds.filter((pid) => pid !== id)
            : [...state.savedPlayerIds, id],
        })),
      addToHistory: (query) =>
        set((state) => ({
          searchHistory: [query, ...state.searchHistory.filter((h) => h !== query)].slice(0, 20),
        })),
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedPlayer: (id) => set({ selectedPlayerId: id }),
    }),
    {
      name: 'triton-poker-db',
      partialize: (state) => ({
        savedVideos: state.savedVideos,
        savedPlayerIds: state.savedPlayerIds,
        searchHistory: state.searchHistory,
      }),
    }
  )
);
