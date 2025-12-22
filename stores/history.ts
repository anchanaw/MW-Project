import { defineStore } from "pinia";

export const useHistoryStore = defineStore("history", {
  state: () => ({
    history: [] as any[],
  }),

  actions: {
    markAsViewed(movie: any) {
      const exists = this.history.find(m => m.id === movie.id);
      if (exists) return;

      this.history.push({
        ...movie,
        viewedAt: new Date().toISOString(),
      });
    },
  },
});
