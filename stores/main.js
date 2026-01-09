import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    watchlists: [],
    searchResults: [],

    history: [],
    currentMovie: null,

    _historyTimer: null,
  }),

  actions: {
    // =========================
    // ADD HISTORY (DELAYED)
    // =========================
    addToHistoryAfterDelay(movie, userId) {
      if (!movie || !userId) return;

      this.clearHistoryTimer();

      console.log("⏳ start history timer", movie.id);

      this._historyTimer = setTimeout(() => {
        this.addToHistory(movie, userId);
        this._historyTimer = null;
        console.log("✅ history saved");
      }, 5000);
    },

    // =========================
    // ADD HISTORY IMMEDIATE
    // =========================
    addToHistory(movie, userId) {
      this.history = this.history.filter(i => i.id !== movie.id);

      this.history.unshift({
        ...movie,
        viewedAt: new Date().toISOString(),
        isViewed: true
      });

      if (this.history.length > 50) {
        this.history.splice(50);
      }

      this.saveHistoryToLocalStorage(userId);
    },

    // =========================
    // CLEAR TIMER
    // =========================
    clearHistoryTimer() {
      if (this._historyTimer) {
        clearTimeout(this._historyTimer);
        this._historyTimer = null;
      }
    },

    // =========================
    // REMOVE SINGLE HISTORY
    // =========================
    removeHistoryItem(id, userId) {
      this.history = this.history.filter(i => i.id !== id);
      this.saveHistoryToLocalStorage(userId);
    },

    // =========================
    // CLEAR ALL HISTORY
    // =========================
    clearAllHistory(userId) {
      this.history = [];

      if (!import.meta.client || !userId) return;

      localStorage.removeItem(`history_${userId}`);
    },

    // =========================
    // SAVE → LocalStorage
    // =========================
    saveHistoryToLocalStorage(userId) {
      if (!import.meta.client || !userId) return;

      localStorage.setItem(
        `history_${userId}`,
        JSON.stringify(this.history)
      );
    },

    // =========================
    // LOAD → LocalStorage
    // =========================
    loadHistoryFromLocalStorage(userId) {
      if (!import.meta.client || !userId) return;

      const data = localStorage.getItem(`history_${userId}`);
      this.history = data ? JSON.parse(data) : [];
    }
  }
});
