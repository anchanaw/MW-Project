<script setup>
// Props ที่รับเข้ามา
defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, required: true },
  year: { type: [String, Number], required: false },
  img: { type: String, required: true },
  rating: { type: Number, required: false }
});

const emojiFor = (rating) => {
  if (rating >= 70) return "/emojis/great-80.png"
  if (rating >= 40) return "/emojis/normal-35-and-80.png"
  return "/emojis/awful-35.png"
}

const formatTitle = (text) => {
  return text.replace(":", ":<br>");
};

</script>

<template>
  <div class="movie-card">

    <!-- พื้นที่โปสเตอร์: NuxtLink เพื่อไป /movie/:id -->
    <NuxtLink :to="`/movie/${id}`" class="poster" aria-label="View movie details">
      <img :src="img" :alt="title" class="poster-img" />
    </NuxtLink>

    <button class="plus" @click.stop="$router.push(`/add/${id}`)" aria-label="Add to list">
      <img src="/icons/plus-icon.svg" alt="Add" />
    </button>

    <!-- แถบคะแนน (ใต้โปสเตอร์) -->
    <div class="rating-bar">
      <img :src="emojiFor(rating)" class="emoji" />
      <span class="score">{{ rating }}</span>
      <span class="outof">/100</span>
    </div>

    <!-- ข้อมูลชื่อและปี -->
    <div class="meta">
      <p class="title" v-html="formatTitle(title)"></p>
      <p class="year" v-if="year">({{ year }})</p>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  width: 150px;
  border-radius: 4px;
  overflow: visible;
  background: #0f0f0f;
  color: #fff;
  font-family: Inter, Roboto, sans-serif;
  position: relative;
}

.movie-card:hover {
  filter: brightness(0.7);

}
/* Poster area (link) */
.poster {
  display: block;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

.plus {
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.plus img {
  width: 24px;
  height: 35px;
  transition: 0.25s ease;
}

.plus:hover img {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
  filter: brightness(5.5) saturate(2) contrast(2);
}


/* Rating bar */
.rating-bar,.score,.outof {
    font-family: Lato, sans-serif;

}
.rating-bar {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 6px;
  padding: 5px;
  color: #fff;
}

.rating-bar .emoji {
  width: 20px;
  height: 19px;
}


.score {
  color: #E1E1E1;
  font-size: 16px;
  font-weight: 400;
}

.outof {
  color: #E1E1E1;
  font-size: 10px;
  font-weight: 400;
}

/* Meta area */
.meta {
  padding: 8px 4px 0;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: #E1E1E1;
}

.year {
  margin: 6px 0 0;
  color: #E1E1E1;
  font-size: 16px;
  font-weight: 300;
  opacity: 0.8;
}
</style>
