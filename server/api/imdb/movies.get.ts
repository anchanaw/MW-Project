import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
  const params = new URLSearchParams({
    types: "MOVIE",
  });

  const url = `https://api.imdbapi.dev/titles?${params.toString()}`;

  return await $fetch(url);
});
