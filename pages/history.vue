<template>
  <div class="history-page">

    <div class="history-header">
      <button class="clear-btn" @click="clearHistory">Clear history</button>
    </div>

    <div class="movie-grid">
      <MovieCard
        v-for="(movie, index) in historyList"
        :key="index"
        :movie="movie"
      />
    </div>

  </div>
</template>

<script setup>
import MovieCard from '~/components/moviecard.vue'

const movies = [
  { id: 1, title: 'Top Gun: Maverick', year: 2022, img: '/movies/topgun-poster.jpg', rating: 83 },
  { id: 2, title: 'Fantastic Beasts: The Secrets of Dumbledore', year: 2022, img: '/movies/fantastic-poster.jpg', rating: 68 },
];
const desiredCount = 5

const showMovies = Array.from({ length: desiredCount }, (_, i) => {
  const m = movies[i % movies.length]
  return { ...m }
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

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}
</style>

