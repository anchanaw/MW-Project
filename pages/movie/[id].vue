<template>
  <div class="detail-page" v-if="movie">

    <!-- Left Section (Poster) -->
    <div class="left">
      <img :src="movie.img" alt="Movie Poster" class="poster" />
    </div>

    <!-- Right Section -->
    <div class="right">
      <h1>{{ movie.title }} ({{ movie.year }})</h1>

      <p class="genres">{{ movie.genres }}</p>

      <div class="overview-section">
        <h2>Overview</h2>
        <p class="overview">{{ movie.overview }}</p>
      </div>

      <div class="score-section">
        <div class="score-box">
          <span class="score">{{ movie.rating }}</span>
          <span class="outof">/100</span>
        </div>

        <button class="add-btn">
          Add to Watchlist
        </button>
      </div>
    </div>
    <div class="cast-section">
        <h2>Cast</h2>

        <div class="cast-grid">
          <div
            class="cast-card"
            v-for="c in movie.cast"
            :key="c.id"
          >
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
  padding: 50px;
  gap: 40px;
  background: #111;
  color: #fff;
  font-family: Lato, sans-serif;
}

/* LEFT SIDE (Poster) */
.left .poster {
  width: 260px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0px 0px 8px #000;
}

/* RIGHT SIDE */
.right {
  flex: 1;
}

/* Title */
.right h1 {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 8px;
}

/* Genres & Runtime */
.genres {
  opacity: 0.8;
  font-size: 16px;
  margin-bottom: 25px;
}

/* Overview Section */
.overview-section h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.overview {
  line-height: 1.6;
  font-size: 15px;
  max-width: 650px;
  opacity: 0.9;
}

/* SCORE + WATCHLIST BUTTON */
.score-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin: 30px 0 40px;
}

.score-box {
  padding: 15px 22px;
  background: #00000066;
  border: 1px solid #444;
  border-radius: 6px;
  text-align: center;
  width: 90px;
}

.score {
  display: block;
  color: #ff4646;
  font-size: 30px;
  font-weight: 700;
}

.outof {
  font-size: 14px;
  opacity: 0.7;
}

/* Add Button */
.add-btn {
  background: #ff4646;
  color: #111;
  border: none;
  padding: 12px 35px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.add-btn:hover {
  background: #ff5d5d;
}

/* CAST SECTION */
.cast-section {
  margin-top: 40px;
}

.cast-section h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

/* Cast Grid */
.cast-grid {
  display: flex;
  gap: 25px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 10px;
}

/* Cast Card */
.cast-card {
  width: 150px;
  cursor: pointer;
}

.cast-img {
  width: 150px;
  height: 180px;
  border-radius: 8px;
  object-fit: cover;
}

/* Cast Name + Role */
.cast-name {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 600;
}

.cast-role {
  font-size: 13px;
  opacity: 0.7;
  margin-top: 2px;
}

</style>
