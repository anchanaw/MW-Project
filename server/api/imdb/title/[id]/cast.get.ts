import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  return await $fetch(`https://api.imdbapi.dev/titles/${id}/credits`);
});
