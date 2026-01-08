<template>
  <div class="history-page">

    <div class="history-header">
      <button class="clear-btn" @click="clearHistory">Clear history</button>
    </div>

    <div class="movie-grid">
      <MovieCard v-for="movie in history" :key="movie.id" :movie="movie" :class="{ viewed: movie.isViewed }"
        @add-to-list="openAddPopup(movie)" />
    </div>

    <AddToWatchlistPopup :open="showAddPopup" :movie="selectedMovie" @close="showAddPopup = false" />

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

/* ================= COMPONENTS ================= */
import MovieCard from '~/components/MovieCard.vue'
import AddToWatchlistPopup from '~/components/watchlist/AddToWatchlistPopup.vue'

/* ================= STORES ================= */
import { useMainStore } from '~/stores/main'
import { useAuthStore } from '~/stores/auth'

const store = useMainStore()
const auth = useAuthStore()
const { history } = storeToRefs(store)

/* ================= ROUTE ================= */
const route = useRoute()

/* ================= POPUP STATE ================= */
const showAddPopup = ref(false)
const selectedMovie = ref(null)

/* ================= POPUP ACTION ================= */
const openAddPopup = (movie) => {
  selectedMovie.value = movie
  showAddPopup.value = true
}

/* ================= HISTORY ACTION ================= */
const clearHistory = () => {
  store.clearAllHistory()
}

/* ================= WATCH ROUTE ================= */
watch(
  () => route.fullPath,
  (path) => {
    if (path === '/history') {
      store.loadHistoryFromLocalStorage()
    }
  },
  { immediate: true }
)

/* ================= LIFECYCLE ================= */
onMounted(() => {
  if (auth.isAuthenticated) {
    store.loadHistoryFromLocalStorage(auth.user.id)
  }
})
</script>

<style scoped>
/* ================= PAGE ================= */
.history-page {
  padding: 30px;
  color: #fff;
}

/* ================= HEADER ================= */
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

/* ================= MOVIE GRID ================= */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

.viewed {
  border-radius: 6px;
}

/* ================= POPUP BACKDROP ================= */
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

/* ================= POPUP CONTAINER ================= */
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
</style>
