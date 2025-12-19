import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
  console.log("🔥 PING HIT");
  return { ok: true };
});
