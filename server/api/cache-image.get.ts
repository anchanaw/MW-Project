import { defineEventHandler, getQuery } from "h3";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const { url, id } = getQuery(event);

  if (!url || !id || typeof url !== "string" || typeof id !== "string") {
    event.node.res.statusCode = 400;
    return "Invalid params";
  }

  const imagesDir = path.resolve("public/cast");
  const filePath = path.join(imagesDir, `${id}.jpg`);

  // ถ้ามีไฟล์แล้ว → ใช้ไฟล์เดิม
  if (fs.existsSync(filePath)) {
    return `/cast/${id}.jpg`;
  }

  // ถ้ายังไม่มี → download
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());

  fs.mkdirSync(imagesDir, { recursive: true });
  fs.writeFileSync(filePath, buffer);

  return `/cast/${id}.jpg`;
});
