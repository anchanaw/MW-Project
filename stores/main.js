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

    // อื่น ๆ
    watchlists: [],
    searchResults: [],
    history: [],
    currentMovie: null,
  }),

  actions: {
    // ตั้ง current movie และเริ่ม timer เก็บ history แบบ delayed
    setCurrentMovie(movie) {
      this.currentMovie = movie;

      // เริ่ม timer เก็บ history หากผู้ใช้อยู่ในหน้ารายละเอียดนานพอ
      this.addToHistoryAfterDelay(movie);
    },

    // เพิ่มเข้า history ทันที (ไม่ delay) — ถ้าจำเป็นจะเรียกโดยตรง
    addToHistory(movie) {
      // ลบรายการเดิมก่อนกันซ้ำ
      this.history = this.history.filter(i => i.id !== movie.id);

      // ใส่รายการใหม่ไว้บนสุด
      this.history.unshift({
        ...movie,
        viewedAt: new Date().toISOString(),
        isViewed: true
      });

      // ถ้าต้องการจำกัดจำนวน history
      if (this.history.length > 50) {
        this.history.splice(50);
      }
    },

    // เก็บ history แบบ delay (default 5000 ms = 5s)
    addToHistoryAfterDelay(movie, delay = 5000) {
      // เคลียร์ timer เดิมก่อน (กันการตั้ง timer ซ้อน)
      if (this._historyTimer) {
        clearTimeout(this._historyTimer);
        this._historyTimer = null;
      }

      this._historyTimer = setTimeout(() => {
        // กันซ้ำ
        this.history = this.history.filter(item => item.id !== movie.id);

        // ใส่เข้าข้างบนสุดพร้อม metadata
        this.history.unshift({
          ...movie,
          viewedAt: new Date().toISOString(),
          isViewed: true
        });

        // ลบ timer reference เพราะเสร็จแล้ว
        this._historyTimer = null;

        // ถ้าจำกัดความยาว
        if (this.history.length > 50) {
          this.history.splice(50);
        }
      }, delay);
    },

    // ถ้าต้องการยกเลิก timer (เช่น เมื่อออกจากหน้านี้เร็ว ๆ)
    clearHistoryTimer() {
      if (this._historyTimer) {
        clearTimeout(this._historyTimer);
        this._historyTimer = null;
      }
    },

    // ตัวช่วยอื่น ๆ เช่น ลบ history รายการเดียว หรือ clear all
    removeHistoryItem(id) {
      this.history = this.history.filter(i => i.id !== id);
    },

    clearAllHistory() {
      this.history = [];
    }
    
  }
  
});
