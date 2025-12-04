<template>
  <div class="history-page">

    <div class="history-header">
      <button class="clear-btn" @click="clearHistory">Clear history</button>
    </div>

    <div class="movie-grid">
      <MovieCard
        v-for="(movie, index) in historyList"
        :key="movie.id"
        v-bind="movie"
        :class="{ viewed: movie.isViewed }"
      />
    </div>

  </div>
</template>

<script setup>
import MovieCard from '~/components/moviecard.vue'
import { useMainStore } from '~/stores/main'
import { storeToRefs } from 'pinia'

const store = useMainStore()
const { history } = storeToRefs(store)

// ⭐ ใช้ history จาก store
const historyList = history

// ⭐ เคลียร์ประวัติ
const clearHistory = () => {
  store.clearAllHistory()
}
console.log("store = ", store)

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
  font-family: Lato, sans-serif;
  font-size: 16px;
  font-weight: 700;
}

.clear-btn {
  background: none;
  border: none;
  color: #ff4f4f;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

/* grid แบบในภาพ */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

/* ⭐ ถ้าอยากให้มีกรอบแดงสำหรับหนังที่ดูแล้ว */
.viewed {
  border: 2px solid #ff4f4f;
  border-radius: 8px;
}
</style>
