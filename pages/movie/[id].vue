<template>
  <div class="detail-page" v-if="movie">

    <!-- TOP Section -->
    <div class="top-section">

      <!-- Poster -->
      <div class="left">
        <img :src="movie.img" alt="Movie Poster" class="poster" />
      </div>

      <!-- Right Content -->
      <div class="right">
        <h1>{{ movie.title }} ({{ movie.year }})</h1>

        <p class="genres">
          {{ movie.genres }}
          <span v-if="formattedRuntime" class="dot">•</span>
          <span v-if="formattedRuntime">{{ formattedRuntime }}</span>
        </p>

        <div class="overview-section">
          <h2>Overview</h2>
          <p class="overview">{{ movie.overview }}</p>
        </div>

        <div class="score-section">
          <div class="score-box">
            <span class="score-title">Score</span>
            <span class="score-value">{{ movie.rating }}</span>
          </div>

          <button class="add-btn" @click="openAddPopup">
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>

    <!-- CAST SECTION -->
    <a-spin :spinning="loading">
      <div class="cast-wrapper">
        <div class="cast-section">
          <h2>Cast</h2>

          <div v-if="cast.length" class="cast-grid">
            <div class="cast-card" v-for="c in cast" :key="c.id">
              <img class="cast-img" :src="c.img" />
              <p class="cast-name">{{ c.name }}</p>
              <p class="cast-role">{{ c.role }}</p>
            </div>
          </div>

          <p v-else class="empty">
            Cast information is not available for this title.
          </p>
        </div>
      </div>
    </a-spin>

    <!-- RELATED MOVIES -->
    <div class="related-section" v-if="relatedMovies.length">
      <h2>Related Movies</h2>

      <div class="related-grid">
        <div class="related-card" v-for="m in relatedMovies" :key="m.id" @click="navigateTo(`/movie/${m.id}`)">
          <img :src="m.img" class="related-img" />
          <p class="related-title">{{ m.title }}</p>
          <span class="related-year">{{ m.year }}</span>
        </div>
      </div>
    </div>

  </div>

  <AddToWatchlistPopup :open="showAddPopup" :movie="movie" @close="showAddPopup = false" />
</template>

<script setup>
/* ================= IMPORTS ================= */
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#app";
import { message } from "ant-design-vue";

import { useMovieStore } from "~/stores/movie";
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";

import AddToWatchlistPopup from "~/components/watchlist/AddToWatchlistPopup.vue";

/* ================= STORES & ROUTE ================= */
const route = useRoute();
const movieStore = useMovieStore();
const auth = useAuthStore();
const mainStore = useMainStore();

/* ================= STATE ================= */
const showAddPopup = ref(false);
const loading = ref(true);

const movieId = String(route.params.id);

/* ================= COMPUTED ================= */
const movie = computed(() =>
  movieStore.allMovies.find(m => m.id === movieId)
);

const cast = computed(() =>
  movieStore.getCastByMovie(movieId)
);

const currentGenres = computed(() => {
  if (!movie.value?.genres) return [];
  return movie.value.genres.split(",").map(g => g.trim());
});

const relatedMovies = computed(() => {
  if (!movie.value) return [];

  return movieStore.allMovies
    .filter(m =>
      m.id !== movie.value.id &&
      currentGenres.value.some(g => m.genres.includes(g))
    )
    .slice(0, 10);
});

const formattedRuntime = computed(() => {
  if (!movie.value?.runtime) return "";

  const hours = Math.floor(movie.value.runtime / 60);
  const minutes = movie.value.runtime % 60;

  return `${hours}h ${minutes}m`;
});

/* ================= METHODS ================= */
const openAddPopup = () => {
  if (!auth.isAuthenticated) {
    navigateTo("/profile");
    return;
  }
  showAddPopup.value = true;
};

/* ================= LIFECYCLE ================= */
onMounted(async () => {
  console.log("📄 movie detail mounted:", movieId);

  await movieStore.initMovies();

  if (!movie.value) {
    console.warn("❌ movie not found");
    loading.value = false;
    return;
  }

  await movieStore.fetchCast(movieId);
  loading.value = false;

  if (auth.isAuthenticated) {
    mainStore.addToHistoryAfterDelay(movie.value, auth.user.id);
  }
});

onUnmounted(() => {
  mainStore.clearHistoryTimer();
});
</script>

<style scoped>
/* ================= PAGE ================= */
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 50px;
  color: #fff;
  font-family: 'Lato', sans-serif;
}

/* ================= TOP SECTION ================= */
.top-section {
  display: flex;
  gap: 40px;
}

.left .poster {
  width: 260px;
  border-radius: 10px;
}

.right {
  flex: 1;
}

/* ================= TITLE ================= */
.right h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
}

/* ================= GENRES ================= */
.genres {
  font-size: 16px;
  margin-bottom: 50px;
  opacity: 0.8;
}

.dot {
  margin: 0 10px;
}

/* ================= OVERVIEW ================= */
.overview-section h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.overview {
  max-width: 650px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  opacity: 0.9;
}

/* ================= SCORE + BUTTON ================= */
.score-section {
  display: flex;
  align-items: center;
  gap: 90px;
  margin-top: 56px;
}

.score-box {
  width: 81px;
  height: 95px;
  padding: 15px;
  background: #D9D9D91A;
  border: 1px solid #A41B1B;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-title {
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: 700;
  opacity: 0.85;
}

.score-value {
  font-size: 36px;
  font-weight: 700;
  color: #F33F3F;
}

/* ================= ADD BUTTON ================= */
.add-btn {
  width: 200px;
  height: 63px;
  padding: 12px 35px;

  background: #ff4646;
  color: #111;
  border: none;
  border-radius: 6px;

  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.add-btn:hover {
  background: #ff5d5d;
}

/* ================= CAST SECTION ================= */
:deep(.ant-spin) {
  margin-top: 20px;
}

.cast-section {
  width: 100%;
  margin-top: 20px;
}

.cast-section h2 {
  font-size: 20px;
  margin-bottom: 15px;
}

.cast-grid {
  display: flex;
  gap: 25px;
  padding-bottom: 10px;
  overflow-x: auto;
  align-items: flex-start;
}

.cast-card {
  flex: 0 0 auto;
  width: 150px;
}

.cast-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 10px;
}

.cast-name {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
}

.cast-role {
  font-size: 14px;
  opacity: 0.7;
}

/* ================= RELATED MOVIES ================= */
.related-section {
  margin-top: 98px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.related-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.related-title {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
}

.related-year {
  font-size: 12px;
  opacity: 0.6;
}
</style>