import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    movies: [
      {
        id: 1,
    title: 'Top Gun: Maverick',
    year: 2022,
    img: '/movies/topgun-poster.jpg',
    rating: 83,
    genres: "Action, Drama",
    runtime: "2h 11m",
    overview:
      "After more than thirty years of service as one of the Navy’s top aviators, and dodging the advancement in rank that would ground him, Pete “Maverick” Mitchell finds himself training a detachment of TOP GUN graduates for a specialized mission the likes of which no living pilot has ever seen.",
    cast: [
      {
        id: 1,
        name: "Tom Cruise With a Long Name",
        role: "Capt. Pete 'Maverick' Mitchell",
        img: "/cast/tom-cruise.jpg"
          }
        ]
      },
      {
        id: 2,
        title: 'Fantastic Beasts: The Secrets of Dumbledore',
        year: 2022,
        img: '/movies/fantastic-poster.jpg',
        rating: 68,
        cast: []
      }
    ],

    watchlists: [],
    searchResults: [],
    history: [],
    currentMovie: null,
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

      // ⭐ persist
      this.saveHistoryToLocalStorage();
    },

    // =========================
    // ADD HISTORY AFTER DELAY
    // =========================
    addToHistoryAfterDelay(movie, delay = 5000) {
      // clear timer เดิม
      if (this._historyTimer) {
        clearTimeout(this._historyTimer);
      }

      this._historyTimer = setTimeout(() => {
        // กันซ้ำ
        this.history = this.history.filter(i => i.id !== movie.id);

        // push รายการใหม่
        this.history.unshift({
          ...movie,
          viewedAt: new Date().toISOString(),
          isViewed: true
        });

        // limit
        if (this.history.length > 50) {
          this.history.splice(50);
        }

        // persist
        this.saveHistoryToLocalStorage();

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
    // ⭐ SAVE → LocalStorage
    // =========================
    saveHistoryToLocalStorage() {
      if (process.client) {
        localStorage.setItem("history", JSON.stringify(this.history));
      }
    },

    // =========================
    // ⭐ LOAD → LocalStorage
    // =========================
    loadHistoryFromLocalStorage() {
      if (process.client) {
        const data = localStorage.getItem("history");
        if (data) {
          this.history = JSON.parse(data);
        }
      }
    }
  }
});
