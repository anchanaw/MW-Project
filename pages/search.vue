<template>
  <div class="search-page">
    <h1 class="search-title">
      Search Results
    </h1>

    <p v-if="!searchResults.length" class="loading-text">
      No results found
    </p>

    <div v-else class="movie-grid">
      <MovieCard
        v-for="movie in searchResults"
        :key="movie.id"
        :movie="movie"
        @add-to-list="openAddPopup(movie)"
      />
    </div>
    <AddToWatchlistPopup :open="showAddPopup" :movie="selectedMovie" @close="showAddPopup = false" />

  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import MovieCard from "~/components/MovieCard.vue";
import { useMainStore } from "~/stores/main";
import AddToWatchlistPopup from "~/components/watchlist/AddToWatchlistPopup.vue";


const { searchResults } = storeToRefs(useMainStore());
const showAddPopup = ref(false);
const selectedMovie = ref(null);

const openAddPopup = (movie) => {
  selectedMovie.value = movie
  showAddPopup.value = true
}
</script>

<style scoped>
.search-page {
  padding: 20px;
  color: #fff;
}

.search-title {
  font-family: 'Lato', sans-serif;
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
