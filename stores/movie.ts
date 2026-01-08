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
        const res = await fetch("/api/imdb/movies");
        const data = await res.json();

        this.allMovies = (data.titles || []).map((item: any): Movie => ({
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

    /* ===== ดึง cast ===== */
    async fetchCast(movieId: string) {
      if (this.castCache[movieId]) {
        return this.castCache[movieId];
      }

      try {
        const res = await fetch(`/api/imdb/titles/${movieId}/cast`);
        const data = await res.json();

        const credits = Array.isArray(data?.credits)
          ? data.credits
          : [];

        const cast = credits
          .filter((c: any) =>
            c.category === "actor" || c.category === "actress"
          )
          .slice(0, 20)
          .map((c: any) => ({
            id: c.name?.id,
            name: c.name?.displayName,
            role: c.characters?.[0] || "Unknown role",
            img: c.name?.primaryImage?.url || "/images/no-avatar.jpg",
          }));


        this.castCache[movieId] = cast;
        console.log("🔥 fetchCast called:", movieId);
        console.log("RAW credits:", data?.credits);

        return cast;
      } catch (err) {
        console.error("fetchCast failed", err);
        return [];
      }
    },
  },
});
