<template>
  <div v-if="movie" class="movie-card">

    <NuxtLink :to="`/movie/${movie.id}`" class="poster">
      <img :src="movie.img" :alt="movie.title" class="poster-img" />
    </NuxtLink>

    <button class="plus" @click.stop="handleAdd" aria-label="Add to list">
      <img src="/icons/plus-icon.svg" alt="Add" />
    </button>

    <div class="rating-bar">
      <img :src="emojiFor(movie.rating)" class="emoji" />
      <span class="score">{{ movie.rating ?? 'N/A' }}</span>
      <span class="outof">/100</span>
    </div>

    <div class="meta">
      <p class="title" v-html="formatTitle(movie.title)"></p>
      <p class="year" v-if="movie.year">({{ movie.year }})</p>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

/* ================= PROPS ================= */
const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

/* ================= EMITS ================= */
const emit = defineEmits(['add-to-list'])

/* ================= STORE ================= */
const auth = useAuthStore()

/* ================= HELPERS ================= */
const emojiFor = (rating) => {
  if (typeof rating !== 'number') return '/emojis/normal-35-and-80.png'
  if (rating >= 70) return '/emojis/great-80.png'
  if (rating >= 40) return '/emojis/normal-35-and-80.png'
  return '/emojis/awful-35.png'
}

const formatTitle = (text = '') =>
  text.replace(/\./g, '.<br>')

/* ================= ACTION ================= */
const handleAdd = () => {
  if (!auth.isAuthenticated) {
    navigateTo('/profile')
    return
  }

  emit('add-to-list')
}
</script>

<style scoped>
/* ================= CARD ================= */
.movie-card {
  position: relative;
  width: 150px;
  height: 340px;
  background: #0f0f0f;
  border-radius: 4px;
  color: #fff;
  font-family: Inter, Roboto, sans-serif;
}

.movie-card:hover {
  filter: brightness(0.7);
}

/* ================= POSTER ================= */
.poster {
  display: block;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  height: 225px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

/* ================= ADD BUTTON ================= */
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

/* ================= RATING ================= */
.rating-bar {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 6px;
  padding: 5px;
  font-family: 'Lato', sans-serif;
}

.rating-bar .emoji {
  width: 20px;
  height: 19px;
}

.score {
  font-size: 16px;
  color: #E1E1E1;
}

.outof {
  margin-top: 3px;
  font-size: 10px;
  color: #E1E1E1;
}

/* ================= META ================= */
.meta {
  padding: 8px 4px 0;
}

.title {
  margin: 0;
  font-size: 16px;
  color: #E1E1E1;
}

.year {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 300;
  opacity: 0.8;
  color: #E1E1E1;
}
</style>