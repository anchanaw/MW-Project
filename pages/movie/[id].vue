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
    <div class="cast-wrapper" v-if="!loading && movie">

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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#app";
import { useMovieStore } from "~/stores/movie";
import { useAuthStore } from "~/stores/auth";
import AddToWatchlistPopup from "~/components/watchlist/AddToWatchlistPopup.vue";

const route = useRoute();
const movieStore = useMovieStore();
const auth = useAuthStore();

const showAddPopup = ref(false);
const loading = ref(true);

const movieId = String(route.params.id);

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
      m.id !== movie.value.id &&               // ไม่เอาเรื่องเดิม
      currentGenres.value.some(g =>
        m.genres.includes(g)                   // genre ซ้ำอย่างน้อย 1 ตัว
      )
    )
    .slice(0, 10);
});

const formattedRuntime = computed(() => {
  if (!movie.value?.runtime) return "";

  const hours = Math.floor(movie.value.runtime / 60);
  const minutes = movie.value.runtime % 60;

  return `${hours}h ${minutes}m`;
});

const openAddPopup = () => {
  if (!auth.isAuthenticated) {
    navigateTo("/profile");
    return;
  }
  showAddPopup.value = true;
};

onMounted(async () => {
  console.log("📄 movie detail mounted:", movieId);

  await movieStore.initMovies();

  if (!movie.value) {
    console.warn("❌ movie not found in store");
    loading.value = false;
    return;
  }

  console.log("▶️ calling fetchCast with:", movieId);
  await movieStore.fetchCast(movieId);
  console.log("▶️ after fetchCast:", movieStore.castCache);

  console.log("🎬 movie:", movie.value);
  console.log("🎭 cast:", cast.value);

  loading.value = false;
});
</script>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  background: #111;
  color: #fff;
  padding: 50px;
  gap: 40px;
  font-family: 'Lato', sans-serif;
}

.top-section {
  display: flex;
  gap: 40px;
}

.left .poster {
  width: 260px;
  border-radius: 10px;
}

/* Right side */
.right {
  flex: 1;
}


/* Title */
.right h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
}

/* CAST SECTION — แถวล่าง */
.cast-section {
  margin-top: 10px;
}

.cast-section h2 {
  font-size: 22px;
  margin-bottom: 20px;
}

/* Genres */
.genres {
  opacity: 0.8;
  font-size: 16px;
  margin-bottom: 50px;
}

.dot {
  margin: 0 10px;
}

/* Overview */
.overview-section h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.overview {
  line-height: 1.6;
  font-size: 16px;
  font-weight: 400;
  max-width: 650px;
  opacity: 0.9;
}

/* Score + Button */
.score-section {
  display: flex;
  align-items: center;
  gap: 90px;
  margin-top: 56px;
}

.score-box {
  width: 81px;
  height: 95px;
  padding: 15px 15px;
  background: #D9D9D91A;
  border: 1px solid #A41B1B;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-title {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  opacity: 0.85;
  margin-bottom: 5px;
}

.score-value {
  color: #F33F3F;
  font-size: 36px;
  font-weight: 700;
}


.outof {
  font-size: 14px;
  opacity: 0.7;
}

/* Add Button */
.add-btn {
  width: 200px;
  height: 63px;
  background: #ff4646;
  color: #111;
  border: none;
  padding: 12px 35px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
}

.add-btn:hover {
  background: #ff5d5d;
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
  overflow-x: auto;
  padding-bottom: 10px;
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
