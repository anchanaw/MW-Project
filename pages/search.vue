<template>
  <div class="search-page">

    <h1 class="search-title">
      Search Results: movies by <span>{{ query }}</span>
    </h1>

    <p v-if="loading" class="loading-text">Searching...</p>

    <div v-else class="movie-grid">
      <MovieCard v-for="movie in results" :key="movie.id" :title="movie.title" :img="movie.img" :year="movie.year" :rating="movie.rating"/>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MovieCard from '~/components/moviecard.vue';
import { useMainStore } from '~/stores/main';


const route = useRoute();
const query = ref(route.query.query?.toLowerCase() || "");

const loading = ref(true);
const results = ref([]);

const store = useMainStore();
const dummyMovies = store.movies;


// ฟังก์ชันค้นหา
const fetchSearch = async () => {
  loading.value = true;

  await new Promise((r) => setTimeout(r, 300));

  if (!query.value) {
    results.value = [];
  } else {
    results.value = dummyMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.value)
    );
  }

  loading.value = false;
};

// โหลดครั้งแรก
onMounted(fetchSearch);

// โหลดใหม่ทุกครั้งที่ query เปลี่ยน
watch(
  () => route.query.query,
  (newVal) => {
    query.value = newVal?.toLowerCase() || "";
    fetchSearch();
  }
);
</script>


<style scoped>
.search-page {
  padding: 20px;
  color: #fff;
}

.search-title {
  font-family: Lato, sans-serif;
  font-size: 32px;
  font-weight: 250;
  letter-spacing: 1px;
  margin-bottom: 20px;
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
