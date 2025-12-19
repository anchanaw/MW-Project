import { defineStore } from "pinia";

export interface Cast {
  id: string;
  name: string;
  role: string;
  img: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number | null;
  img: string;
  rating: number | null;
  voteCount: number | null;
  genres: string;
  runtime: number | null;
  overview: string;
}

const STORAGE_KEY = "all_movies";

export const useMovieStore = defineStore("movie", {
  state: () => ({
    allMovies: [] as Movie[],
    castCache: {} as Record<string, Cast[]>,
    loading: false,
  }),

  /* ===============================
     GETTERS
  =============================== */
  getters: {
    // ⭐ Popular (Top Rated + vote)
    popularMovies: (state) => {
      return [...state.allMovies]
        .filter(m => m.rating !== null && m.voteCount !== null)
        .map(m => ({
          ...m,
          popularityScore:
            m.rating! * 0.75 +
            Math.log10(m.voteCount! + 1) * 30,
        }))
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 20);
    },

    // 🎭 ดึง cast จาก cache
    getCastByMovie:
      (state) => (movieId: string) =>
        state.castCache[movieId] || [],
  },

  /* ===============================
     ACTIONS
  =============================== */
  actions: {
    /* ===== โหลดหนังทั้งหมดครั้งเดียว ===== */
    async initMovies() {
      if (this.allMovies.length) return;

      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        this.allMovies = JSON.parse(cached);
        return;
      }

      this.loading = true;
      try {
        const res: any = await fetch("/api/imdb/movies");

        this.allMovies = (res.titles || []).map((item: any): Movie => ({
          id: item.id,
          title: item.primaryTitle,
          year: item.startYear ?? null,
          img: item.primaryImage?.url || "/images/no-poster.png",
          rating: item.rating?.aggregateRating
            ? Math.round(item.rating.aggregateRating * 10)
            : null,
          voteCount: item.rating?.voteCount ?? null,
          genres: item.genres?.join(", ") || "",
          runtime: item.runtimeSeconds
            ? Math.round(item.runtimeSeconds / 60)
            : null,
          overview: item.plot || "",
        }));

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(this.allMovies)
        );
      } finally {
        this.loading = false;
      }
    },

    /* ===== ดึง cast (มี cache) ===== */
    async fetchCast(movieId: string) {
      if (this.castCache[movieId]) {
        return this.castCache[movieId];
      }

      try {
        const res: any = await $fetch(
          `/api/imdb/titles/${movieId}/credits`
        );

        const credits = Array.isArray(res?.credits)
          ? res.credits
          : [];

        console.log("🎯 RAW credits:", credits);

        const cast = credits
          .filter(
            (c: any) =>
              c?.name &&
              typeof c.name.displayName === "string"
          )
          .slice(0, 10)
          .map((c: any) => ({
            id: c.name.id,
            name: c.name.displayName,
            role: Array.isArray(c.characters)
              ? c.characters.join(", ")
              : "",
            img: c.name.primaryImage?.url || "/images/no-avatar.png",
          }));

        console.log("🎭 FINAL cast:", cast);

        this.castCache[movieId] = cast;
        return cast;
      } catch (err) {
        console.error("fetchCast failed", err);
        this.castCache[movieId] = [];
        return [];
      }
    },
  },
});
