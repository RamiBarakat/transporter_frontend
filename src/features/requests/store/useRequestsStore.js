import { create } from 'zustand';
import { persist } from 'zustand/middleware';

//only search exists now, keep for future
export const useRequestsStore = create()(
  persist(
    (set, get) => ({
      // Search and filters
      filters: {
        search: '',
        status: 'all',
        priority: 'all',
        dateRange: 'all',
      },
      
      // UI state
      viewMode: 'table',
      
      // Actions
      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),
      
      resetFilters: () => set({
        filters: { search: '', status: 'all', priority: 'all', dateRange: 'all' }
      }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // Helper getters
      hasActiveFilters: () => {
        const { filters } = get();
        return filters.search !== '' || 
               filters.status !== 'all' || 
               filters.priority !== 'all' ||
               filters.dateRange !== 'all';
      },
    }),
    { 
      name: 'requests-store',
      partialize: (state) => ({ 
        filters: state.filters,
        viewMode: state.viewMode 
      })
    }
  )
);