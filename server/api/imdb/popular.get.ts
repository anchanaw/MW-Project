import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
  const params = new URLSearchParams({
    types: "MOVIE",
    sortBy: "SORT_BY_POPULARITY",
    sortOrder: "DESC",
    minVoteCount: "5000",
    minAggregateRating: "7.0",
  });

  const url = `https://api.imdbapi.dev/titles?${params.toString()}`;
  const data: any = await $fetch(url);

  return {
    ...data,
    titles: data.titles.slice(0, 20), 
  };
});
