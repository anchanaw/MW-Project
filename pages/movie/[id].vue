<template>
  <div class="detail-page" v-if="movie">

    <!-- ⭐ TOP Section -->
    <div class="top-section">

      <!-- Poster -->
      <div class="left">
        <img :src="movie.img" alt="Movie Poster" class="poster" />
      </div>

      <!-- Right Content -->
      <div class="right">
        <h1>{{ movie.title }} ({{ movie.year }})</h1>
        <p class="genres">{{ movie.genres }}</p>

        <div class="overview-section">
          <h2>Overview</h2>
          <p class="overview">{{ movie.overview }}</p>
        </div>

        <div class="score-section">
          <div class="score-box">
            <span class="score-title">Score</span>
            <span class="score-value">{{ movie.rating }}</span>
          </div>

          <button class="add-btn">Add to Watchlist</button>
        </div>
      </div>
    </div>

    <!-- ⭐ CAST LAYER -->
    <div class="cast-section">
      <h2>Cast</h2>

      <div class="cast-grid">
        <div class="cast-card" v-for="c in movie.cast" :key="c.id">
          <img :src="c.img" class="cast-img" />
          <p class="cast-name">{{ c.name }}</p>
          <p class="cast-role">{{ c.role }}</p>
        </div>
      </div>
    </div>

  </div>
</template>



<script setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useMainStore } from "~/stores/main";

const store = useMainStore();
const route = useRoute();

// ⭐ ดึงหนังแบบ reactive
const movie = computed(() =>
  store.movies.find((m) => m.id === Number(route.params.id))
);

// ⭐ โหลด history เมื่อเข้าหน้า
onMounted(() => {
  store.loadHistoryFromLocalStorage();

  // ⭐ เริ่มจับเวลา 5 วิ เพื่อบันทึก history
  if (movie.value) {
    store.setCurrentMovie(movie.value);
  }
});

// ⭐ ถ้าออกก่อน 5 วิ → ยกเลิก timer
onBeforeUnmount(() => {
  store.clearHistoryTimer();
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
  font-family: Lato, sans-serif;
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
  background: #161616;
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
  color: #ff4646;
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

/* ⭐ CAST SECTION (ด้านล่างแนวนอน) */
.cast-section {
  width: 100%;
  margin-top: 20px;
}

.cast-section h2 {
  font-size: 20px;
  margin-bottom: 15px;
}

/* ให้ cast อยู่แถวล่างเต็มความกว้าง */
.cast-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 25px;
  overflow-x: auto;
  padding-bottom: 10px;
}


/* cast card */
.cast-card {
  width: 150px;
}

.cast-img {
  width: 150px;
  height: 190px;
  border-radius: 4px 4px 0 0;
  object-fit: cover;
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
</style>
