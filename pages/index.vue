<template>
  <div class="main-container">

    <!-- Welcome box -->
    <div class="welcome-box">
      <div class="welcome-title">
        Welcome to <span class="highlight">Watchlists</span>
      </div>

      <div class="welcome-desc">
        Browse movies, add them to watchlists, and share them with friends.
      </div>

      <div class="welcome-hint">
        <span>Just click</span>

        <img class="welcome-plus-icon" src="/icons/plus-icon.svg" alt="Add movie" />

        <span>to add a movie, the poster to see more details or</span>

        <img class="check-icon" :src="isChecked ? '/icons/check-icon-green.png' : '/icons/check-icon.png'"
          @click="isChecked = !isChecked" alt="Watched" />

        <span>to mark the movie as watched.</span>
      </div>
    </div>

    <div class="search-area">
      <img src="/icons/search-icon.png" class="search-icon" alt="search">

      <a-input v-model:value="keyword" placeholder="Search for movies by title" @pressEnter="goSearch"
        class="search-input" />

      <a-button type="primary" class="search-btn" @click="goSearch">
        Search
      </a-button>
    </div>


    <h2>Popular movies right now</h2>

    <!-- Movie grid -->
    <div class="movie-grid">
      <MovieCard v-for="movie in movieStore.popularMovies" :key="movie.id" :movie="movie"
        @add-to-list="openAddPopup(movie)" />
    </div>

    <AddToWatchlistPopup :open="showAddPopup" :movie="selectedMovie" @close="showAddPopup = false" />

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { navigateTo } from "#app";

/* ================= STORES ================= */
import { useMovieStore } from "~/stores/movie";
import { useMainStore } from "~/stores/main";

/* ================= COMPONENTS ================= */
import MovieCard from "~/components/MovieCard.vue";
import AddToWatchlistPopup from "~/components/watchlist/AddToWatchlistPopup.vue";

/* ================= STORE INSTANCES ================= */
const movieStore = useMovieStore();
const store = useMainStore();

/* ================= ROUTER ================= */
const router = useRouter();

/* ================= STATE ================= */
const showAddPopup = ref(false);
const selectedMovie = ref(null);
const keyword = ref("");
const isChecked = ref(false);

/* ================= METHODS ================= */
const goSearch = () => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return;

  const results = movieStore.allMovies.filter(m => {
    const matchTitle = m.title?.toLowerCase().includes(q);
    const matchOverview = m.overview?.toLowerCase().includes(q);
    return matchTitle || matchOverview;
  });

  store.searchResults = results;

  navigateTo({
    path: "/search",
    query: { q: keyword.value }
  });
};

const openAddPopup = (movie) => {
  selectedMovie.value = movie;
  showAddPopup.value = true;
};

/* ================= LIFECYCLE ================= */
onMounted(() => {
  movieStore.initMovies();
});
</script>

<style scoped>
/* ================= PAGE ================= */
.main-container {
  flex: 1;
  color: #E1E1E1;
  padding: 60px;
  overflow-y: auto;
  font-family: 'Lato', sans-serif;
}

/* ================= WELCOME BOX ================= */
.welcome-box {
  display: flex;
  flex-direction: column;
  width: 988px;
  background-color: #D9D9D91A;
  border: 1px solid #A41B1B;
  padding: 20px 20px 33px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.welcome-title {
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 21px;
}

.highlight {
  color: #ff4646;
}

.welcome-desc {
  font-size: 20px;
  line-height: 1.4;
  margin-top: 14px;
}

/* ================= HINT ================= */
.welcome-hint {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 20px;
  margin-top: 14px;
}

.welcome-plus-icon {
  width: 24px;
  height: 35px;
  cursor: pointer;
}

.welcome-plus-icon:hover {
  content: url('/icons/plus-icon-hover.svg');
}

.check-icon {
  width: 28px;
  height: 25px;
  cursor: pointer;
  margin-left: 6px;
}

/* ================= SEARCH ================= */
.search-area {
  position: relative;
  display: flex;
  align-items: center;
  width: 988px;
  height: 45px;
  margin-bottom: 30px;
  background: #1b1b1b;
  border: 1px solid #D9D9D94D;
  border-radius: 8px;
}

.search-area:focus-within {
  background: #FFFFFF1A;
  border-color: #444;
}

.search-area input {
  flex: 1;
  padding: 0 12px 0 50px;
  background: transparent;
  border: none;
  color: white;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 20px;
  opacity: 0.7;
}

.search-btn {
  position: absolute;
  right: -2px;
  height: 45px;
  padding: 0 25px;
  background: #ff4646;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

/* ================= MOVIES ================= */
h2 {
  margin-bottom: 35px;
  font-size: 32px;
  font-weight: 400;
  letter-spacing: 1.5px;
}

.movie-grid {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
}
</style>
