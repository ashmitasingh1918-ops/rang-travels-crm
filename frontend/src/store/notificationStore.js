import { create } from 'zustand';
import { notificationService } from '../services/notificationService';

export const useNotificationStore = create((set, get) => ({
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await notificationService.getAll();
      set({ items: data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createItem: async (itemData) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await notificationService.create(itemData);
      set({ items: [...get().items, newItem], isLoading: false });
      return newItem;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  }
}));
