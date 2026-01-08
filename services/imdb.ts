import { api } from "./api";

export const imdbApi = {
  // หน้าแรกเท่านั้น
  getPopularForHome() {
    return api.get("/api/imdb/popular");
  },

  // (เผื่อหน้าอื่น)
  getTitles() {
    return api.get("/api/imdb/titles");
  },
};
