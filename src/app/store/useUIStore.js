import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create()(
  persist(
    (set, get) => ({
      // UI preferences
      sidebarOpen: true,
      theme: 'light',
      viewMode: 'grid', // 'grid' | 'list' | 'table'
      
      // Filter state
      filters: {
        dateRange: 'last7days',
        status: 'all',
        transporter: 'all',
      },

      // Driver management state
      selectedDrivers: [],
      driverSearchTerm: '',
      showDriverSearch: false,
      
      // Actions
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      setTheme: (theme) => set({ theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),
      resetFilters: () => set({
        filters: { dateRange: 'last7days', status: 'all', transporter: 'all' }
      }),

      // Driver management actions
      addDriver: (driver) => set((state) => ({
        selectedDrivers: [...state.selectedDrivers, {
          ...driver,
          tempId: driver.tempId || Date.now(), // Ensure tempId exists
          rating: driver.rating || {
            punctuality: 0,
            professionalism: 0,
            overall: 0,
            comments: ''
          }
        }]
      })),

      removeDriver: (driverId) => set((state) => ({
        selectedDrivers: state.selectedDrivers.filter(d => 
          d.tempId !== driverId && d.id !== driverId
        )
      })),

      updateDriverRating: (driverId, ratingField, value) => set((state) => ({
        selectedDrivers: state.selectedDrivers.map(driver =>
          (driver.tempId === driverId || driver.id === driverId)
            ? {
                ...driver,
                rating: { ...driver.rating, [ratingField]: value }
              }
            : driver
        )
      })),

      updateDriver: (driverId, updatedDriver) => set((state) => ({
        selectedDrivers: state.selectedDrivers.map(driver =>
          (driver.tempId === driverId || driver.id === driverId)
            ? { ...driver, ...updatedDriver }
            : driver
        )
      })),

      setSelectedDrivers: (drivers) => set({ selectedDrivers: drivers }),

      clearSelectedDrivers: () => set({ selectedDrivers: [] }),

      setDriverSearchTerm: (term) => set({ driverSearchTerm: term }),

      setShowDriverSearch: (show) => set({ showDriverSearch: show }),
    }),
    { 
      name: 'ui-store',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
        viewMode: state.viewMode,
        filters: state.filters,
        // Don't persist driver management state - it's session-specific
      })
    }
  )
);