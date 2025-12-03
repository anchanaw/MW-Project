<template>
  <div class="search-page">

    <!-- Title -->
    <h1 class="search-title">
      Search Results: movies by <span>{{ query }}</span>
    </h1>

    <!-- Loading -->
    <p v-if="loading" class="loading-text">Searching...</p>

    <!-- Result Grid -->
    <div v-else class="movie-grid">
      <MovieCard
        v-for="movie in results"
        :key="movie.id"
        :movie="movie"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MovieCard from '~/components/moviecard.vue';

const route = useRoute();
const query = route.query.query || ""; // เช่น "Tom Cruise"

const loading = ref(true);
const results = ref([]);

// ⭐ Dummy data (รอ API จริง)
const dummyMovies = [
  { id: 1, title: 'Top Gun: Maverick', year: 2022, img: '/movies/topgun-poster.jpg', rating: 83 },
  { id: 2, title: 'Fantastic Beasts: The Secrets of Dumbledore', year: 2022, img: '/movies/fantastic-poster.jpg', rating: 68 },
];

// ⭐ โหลดผลลัพธ์ (ตอนนี้ยังใช้ dummy)
const fetchSearch = async () => {
  loading.value = true;

  // จำลองโหลด API
  await new Promise((r) => setTimeout(r, 500));

  results.value = dummyMovies; // เอา dummy มาแสดงก่อน

  loading.value = false;
};

onMounted(() => fetchSearch());
</script>

<style scoped>
.search-page {
  padding: 20px;
  color: #fff;
}

.search-title {
  font-size: 26px;
  margin-bottom: 20px;
}

.search-title span {
  color: #ffcc55; /* เหลืองอ่อนแบบ UI */
}

.loading-text {
  font-size: 16px;
  color: #aaa;
  margin-top: 10px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
  margin-top: 15px;
}
</style>
