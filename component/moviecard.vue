<script setup>
// Props ที่รับเข้ามา
defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, required: true },
  year: { type: [String, Number], required: false },
  img: { type: String, required: true },
  rating: { type: Number, required: false }
});
</script>

<template>
  <div class="movie-card">

    <!-- พื้นที่โปสเตอร์: NuxtLink เพื่อไป /movie/:id -->
    <NuxtLink :to="`/movie/${id}`" class="poster" aria-label="View movie details">
      <img :src="img" :alt="title" class="poster-img" />
    </NuxtLink>

    <!-- ปุ่ม + มุมซ้ายบน ของโปสเตอร์ -->
    <!-- @click.stop หยุดไม่ให้ event bubble ไปยัง NuxtLink ของ poster -->
    <button class="plus" @click.stop="$router.push(`/add/${id}`)" aria-label="Add to list">+</button>

    <!-- แถบคะแนน (ใต้โปสเตอร์) -->
    <div class="rating-bar" role="group" aria-label="rating">
      <span class="emoji" aria-hidden="true">😃</span>
      <span class="score">{{ rating ?? '-' }}</span><span class="outof">/100</span>
    </div>

    <!-- ข้อมูลชื่อและปี -->
    <div class="meta">
      <p class="title">{{ title }}</p>
      <p class="year" v-if="year">({{ year }})</p>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  width: 200px;
  border-radius: 10px;
  overflow: visible;
  background: #0f0f0f;
  color: #fff;
  font-family: Inter, Roboto, sans-serif;
}

/* Poster area (link) */
.poster {
  display: block;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}
.poster-img {
  width: 100%;
  display: block;
  object-fit: cover;
  border-radius: 8px;
}

/* + button (absolute relative to .movie-card) */
.plus {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
}

/* Rating bar */
.rating-bar {
  background: #171717;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin-top: 8px;
  border-radius: 6px;
}
.emoji { font-size: 16px; }
.score { color: #b8ff7a; font-weight: 700; }
.outof { color: #9aa; font-size: 12px; }

/* Meta area */
.meta {
  padding: 8px 4px 0;
}
.title {
  margin: 0;
  font-size: 15px;
  line-height: 1.2;
  color: #fff;
}
.year {
  margin: 6px 0 0;
  color: #9c9c9c;
  font-size: 13px;
}
</style>
