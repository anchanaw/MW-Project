<template>
  <div class="history-page">

    <div class="history-header">
      <button class="clear-btn" @click="clearHistory">Clear history</button>
    </div>

    <div class="movie-grid">
      <MovieCard
        v-for="movie in history"
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
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const store = useMainStore()
const { history } = storeToRefs(store)
const route = useRoute()

// ⭐ โหลด history ทุกครั้งที่เข้าหน้านี้
onMounted(() => {
  store.loadHistoryFromLocalStorage()
})

// ⭐ โหลดซ้ำเมื่อเปลี่ยน route มาที่ /history
watch(
  () => route.fullPath,
  (newVal) => {
    if (newVal === '/history') {
      store.loadHistoryFromLocalStorage()
    }
  },
  { immediate: true }
)

const clearHistory = () => {
  store.clearAllHistory()
}

definePageMeta({
  middleware: ['auth']
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

/* ⭐ ทำให้หนังที่ดูแล้วมีกรอบแดง */
.viewed {
  border: 2px solid #ff4f4f;
  border-radius: 6px;
}
</style>
