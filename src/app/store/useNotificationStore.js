import { create } from 'zustand';

export const useNotificationStore = create()((set, get) => ({
  notifications: [],
  
  addNotification: (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    
    set((state) => ({
      notifications: [notification, ...state.notifications]
    }));
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 3000);
    
    return id;
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearAll: () => set({ notifications: [] }),
  
  // Helper methods
  success: (message) => get().addNotification(message, 'success'),
  error: (message) => get().addNotification(message, 'error'),
  warning: (message) => get().addNotification(message, 'warning'),
  info: (message) => get().addNotification(message, 'info'),
}));