import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  console.log("🔥 CREDITS API HIT");

  const id = event.context.params?.id;
  console.log("🎬 movie id:", id);

  if (!id) {
    return { credits: [] };
  }

  const url = `https://api.imdbapi.dev/titles/${id}/credits`;
  console.log("➡️ fetch:", url);

  const data: any = await $fetch(url);

  return data; // return JSON ตรง ๆ
});
