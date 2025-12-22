import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return { credits: [] };
  }

  const url = `https://api.imdbapi.dev/titles/${id}/credits`;
  const data = await $fetch(url);

  return data;
});
