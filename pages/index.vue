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

    <!-- Search area -->
    <div class="search-area">
      <img src="/icons/search-icon.png" class="search-icon" alt="search">

      <input v-model="keyword" @keyup.enter="goSearch" type="text" placeholder="Search for movies by title" />

      <button class="search-btn" @click="goSearch">search</button>
    </div>

    <h2>Popular movies right now</h2>

    <!-- Movie grid -->
    <div class="movie-grid">
      <MovieCard v-for="movie in movieStore.popularMovies" :key="movie.id" :movie="movie" @add-to-list="openAddPopup(movie)"/>
    </div>

    <AddToWatchlistPopup :open="showAddPopup" :movie="selectedMovie" @close="showAddPopup = false" />

  </div>
</template>


<script setup>
/* ===== core ===== */
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

/* ===== stores ===== */
import { useMovieStore } from "~/stores/movie";
import { navigateTo } from "#app";

/* ===== components ===== */
import AddToWatchlistPopup from "~/components/watchlist/AddToWatchlistPopup.vue";

/* ===== store ===== */
const movieStore = useMovieStore();
const store = useMainStore();

/* ===== state ===== */
const showAddPopup = ref(false);
const selectedMovie = ref(null);
const keyword = ref('');

/* ===== router ===== */
const router = useRouter();

/* ===== methods ===== */
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
        path: '/search',
        query: { q: keyword.value }
    });
};


const openAddPopup = (movie) => {
  selectedMovie.value = movie
  showAddPopup.value = true
}

/* ===== lifecycle ===== */
onMounted(() => {
  movieStore.initMovies();
});
</script>


<style scoped>
.main-container {
  flex: 1;
  color: #E1E1E1;
  padding: 60px;
  overflow-y: auto;
  font-family: 'Lato', sans-serif;
}

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

/* TITLE (แทน h1) */
.welcome-title {
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 21px;
}

/* highlight คุมสีอย่างเดียว */
.highlight {
  color: #ff4646;
}

/* DESCRIPTION */
.welcome-desc {
  font-size: 20px;
  font-weight: 400;
  line-height: 1.4;
  margin-top: 14px;
}

/* HINT LINE */
.welcome-hint {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  font-size: 20px;
  font-weight: 400;
  line-height: 100%;
  margin-top: 14px;
}


.welcome-plus-icon {
  width: 24px;
  height: 35px;
  display: inline-block;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

/* ตอน hover: เปลี่ยนรูปเป็นอีกไฟล์ */
.welcome-plus-icon:hover {
  content: url('/icons/plus-icon-hover.svg');
  opacity: 1;
}



/* CHECK ICON */
.check-icon {
  width: 28px;
  height: 25px;
  vertical-align: middle;
  cursor: pointer;
  margin-left: 6px;
}

.check-icon.active {
  content: url('/icons/check-icon-green.png');
}

/* Search section */
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

  transition: background 0.2s ease, border 0.2s ease;
}

.search-area:focus-within {
  background: #FFFFFF1A;
  border: 1px solid #444;
}

/* input inside the box */
.search-area input {
  flex: 1;
  height: 100%;
  padding: 0 12px 0 50px;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 15px;
  -webkit-appearance: none;
  appearance: none;
}

/* placeholder */
.search-area input::placeholder {
  color: #777;
}

/* search icon inside input */
.search-icon {
  position: absolute;
  left: 14px;
  width: 20px;
  height: 20px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 0.7;
}

/* search button */
.search-btn {
  position: absolute;
  right: -2px;
  height: 45px;
  padding: 0 25px;
  background: #ff4646;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #000;
}


.search-btn:hover {
  background: #ff5c5c;
}

/* Popular movies */
h2 {
  font-family: 'Lato', sans-serif;
  margin-bottom: 35px;
  font-size: 32px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 1.5px;
}

/* Grid 5 movie cards */
.movie-grid {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
}
</style>
