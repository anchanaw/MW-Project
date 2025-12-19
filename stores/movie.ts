import { defineStore } from "pinia";

const STORAGE_KEY = "all_movies";

export const useMovieStore = defineStore("movie", {
    state: () => ({
        allMovies: [] as any[],
        loading: false,
    }),

    getters: {
        popularMovies: (state) => {
            return [...state.allMovies]
                .filter(m => m.rating !== null && m.voteCount !== null)
                .map(m => ({
                    ...m,
                    popularityScore:
                        m.rating * 0.75 +
                        Math.log10(m.voteCount + 1) * 30,
                }))
                .sort((a, b) => b.popularityScore - a.popularityScore)
                .slice(0, 20);
        },
    },

    actions: {
        async initMovies() {
            // 1️⃣ เช็ก localStorage ก่อน
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
                this.allMovies = JSON.parse(cached);
                return;
            }

            this.loading = true;

            try {
                const res: any = await $fetch("/api/imdb/movies");

                this.allMovies = res.titles.map((item: any) => ({
                    id: item.id,
                    title: item.primaryTitle,
                    year: item.startYear,
                    img: item.primaryImage?.url || "/images/no-poster.png",
                    rating: item.rating?.aggregateRating
                        ? Math.round(item.rating.aggregateRating * 10)
                        : null,
                    voteCount: item.rating?.voteCount || null,
                    genres: item.genres?.join(", ") || "",
                    runtime: item.runtimeSeconds
                        ? Math.round(item.runtimeSeconds / 60)
                        : null,
                    overview: item.plot || "",
                }));

                // 2️⃣ เก็บลง localStorage
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(this.allMovies)
                );
            } finally {
                this.loading = false;
            }
        },
    },
});
