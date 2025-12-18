<template>
  <div class="history-page">

    <div class="history-header">
      <button class="clear-btn" @click="clearHistory">Clear history</button>
    </div>

    <div class="movie-grid">
      <MovieCard v-for="movie in history" :key="movie.id" v-bind="movie" :class="{ viewed: movie.isViewed }"
        @add-to-list="openAddPopup(movie)" />
    </div>

    <AddToWatchlistPopup :open="showAddPopup" :movie="selectedMovie" @close="showAddPopup = false" />

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import MovieCard from '~/components/MovieCard.vue'
import AddToWatchlistPopup from '~/components/watchlist/AddToWatchlistPopup.vue'

import { useMainStore } from '~/stores/main'
import { useAuthStore } from '~/stores/auth'

const store = useMainStore()
const auth = useAuthStore()
const { history } = storeToRefs(store)
const route = useRoute()

/* ===== popup state (ตัวเดียวพอ) ===== */
const showAddPopup = ref(false)
const selectedMovie = ref(null)

/* ===== open popup ===== */
const openAddPopup = (movie) => {
  selectedMovie.value = movie
  showAddPopup.value = true
}

/* ===== other ===== */
const clearHistory = () => {
  store.clearAllHistory()
}

watch(
  () => route.fullPath,
  (newVal) => {
    if (newVal === '/history') {
      store.loadHistoryFromLocalStorage()
    }
  },
  { immediate: true }
)

onMounted(() => {
  store.loadHistoryFromLocalStorage()
})
</script>


<style scoped>
.history-page {
  padding: 30px;
  color: #fff;
}

.history-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.clear-btn {
  background: none;
  border: none;
  color: #ff4f4f;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

.viewed {
  border-radius: 6px;
}

/* BACKDROP */
.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
}

/* POPUP CONTAINER */
.popup-container {
  background: #1d1d1d;
  padding: 30px;
  width: 700px;
  max-height: 300px;
  border-radius: 10px;
  border: 1px solid #444;
  color: white;
  position: relative;
  font-family: 'Lato', sans-serif;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.watchlist-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

/* HEADER */
.popup-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.popup-label-text {
  color: #ddd;
  font-size: 16px;
}

.movie-title {
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
}

.to-watchlist {
  color: #ddd;
  font-size: 16px;
  margin-bottom: 21px;
}

/* WATCHLIST ITEM */
.watchlist-option {
  display: flex;
  align-items: center;
  width: 247px;
  height: 41px;
  gap: 15px;
  background: #000;
  padding: 14px 18px;
  border-radius: 6px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background 0.15s;
}

.watchlist-option:hover {
  border: 1px #ff5555;
}

.list-icon {
  width: 30px;
  height: 30px;
  background: #e6e6e6;
  color: black;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.list-title {
  font-size: 15px;
  font-weight: 600;
}

/* NEW WATCHLIST BUTTON */
.new-watchlist {
  width: 247px;
  height: 41px;
  background: #ff3b3b;
  padding: 14px;
  border-radius: 6px;
  border: none;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  margin-top: auto;
}

.plus-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  /* วงกลมขาว */
  color: #000;
  /* + สีดำ */

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 16px;
  font-weight: 800;
  line-height: 1;
}

.new-watchlist {
  background: #ff3b3b;
  color: #000;
  /* ตัวหนังสือสีดำ */
  border: none;
  border-radius: 6px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 12px 16px;
  font-weight: 700;
  cursor: pointer;
}

.create-popup {
  position: relative;
  width: 700px;
  height: 300px;
  background: #161616;
  border: 1px solid #E1E1E1;
  border-radius: 4px;
  padding: 30px;
  padding-bottom: 80px;
  box-sizing: border-box;
  color: #E1E1E1;
}

.create-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}

.form-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

.input-label {
  font-size: 16px;
  font-weight: 700;
}

.input-box {
  width: 295px;
  height: 40px;
  padding: 8px 10px;
  background: #161616;
  border: 1px solid #E1E1E1;
  border-radius: 6px;
  color: #E1E1E1;
  margin-left: 41px;
}

.textarea-box {
  width: 295px;
  height: 140px;
  padding: 10px;
  background: #161616;
  border: 1px solid #E1E1E1;
  border-radius: 6px;
  color: #E1E1E1;
  resize: none;
}

.cancel-btn,
.save-btn {
  position: absolute;
}

.cancel-btn {
  right: 150px;
  bottom: 30px;
  background: none;
  border: none;
  color: #F33F3F;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.save-btn {
  right: 10px;
  bottom: 20px;
  width: 110px;
  height: 41px;
  background: #F33F3F;
  color: black;
  padding: 8px 28px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.save-btn:hover {
  background: #ff5d5d;
}
</style>
