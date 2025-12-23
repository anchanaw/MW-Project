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
    // SET CURRENT MOVIE
    // =========================
    setCurrentMovie(movie) {
      this.currentMovie = movie;

      // เริ่มจับเวลา 5 วิ
      this.addToHistoryAfterDelay(movie);
    },

    // =========================
    // ADD HISTORY IMMEDIATE
    // =========================
    addToHistory(movie) {
      // กันซ้ำ
      this.history = this.history.filter(i => i.id !== movie.id);

      // push ใหม่
      this.history.unshift({
        ...movie,
        viewedAt: new Date().toISOString(),
        isViewed: true
      });

      // limit 50
      if (this.history.length > 50) {
        this.history.splice(50);
      }

      // persist
      this.saveHistoryToLocalStorage();
    },

    // =========================
    // ADD HISTORY AFTER DELAY
    // =========================
    addToHistoryAfterDelay(movie, userId, delay = 5000) {
      if (!userId) return;

      if (this._historyTimer) {
        clearTimeout(this._historyTimer);
      }

      this._historyTimer = setTimeout(() => {
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
        this._historyTimer = null;
      }, delay);
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
    // CLEAR SINGLE HISTORY
    // =========================
    removeHistoryItem(id) {
      this.history = this.history.filter(i => i.id !== id);
      this.saveHistoryToLocalStorage();
    },

    // =========================
    // CLEAR ALL HISTORY
    // =========================
    clearAllHistory() {
      this.history = [];
      if (process.client) {
        localStorage.removeItem("history");
      }
    },

    // =========================
    // SAVE → LocalStorage
    // =========================
    saveHistoryToLocalStorage(userId) {
      if (!process.client || !userId) return;

      const key = `history_${userId}`;
      localStorage.setItem(key, JSON.stringify(this.history));
    },

    // =========================
    // LOAD → LocalStorage
    // =========================
    loadHistoryFromLocalStorage(userId) {
      if (!process.client || !userId) {
        this.history = [];
        return;
      }

      const key = `history_${userId}`;
      const data = localStorage.getItem(key);
      this.history = data ? JSON.parse(data) : [];
    }
  }
});
