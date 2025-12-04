<script setup>
import { useRoute } from 'vue-router';
import { useMainStore } from '~/stores/main';
import { computed } from 'vue';
import { onBeforeUnmount } from 'vue';

const route = useRoute();
const store = useMainStore();

const movieId = Number(route.params.id);

// 🔥 โหลดจาก store (เพราะคุณเก็บทุกอย่างใน store).
const movie = computed(() =>
  store.movies.find(m => m.id === movieId)
);

// dummy cast data (เอาไว้ก่อน)
const cast = computed(() => movie.value.cast);

if (movie.value) {
  store.setCurrentMovie(movie.value);
}

onBeforeUnmount(() => {
  store.clearHistoryTimer();
});

</script>

<template>
  <div class="detail-page" v-if="movie">

    <div class="header-box">

      <!-- LEFT: Poster -->
      <div class="poster-box">
        <img :src="movie.img" class="poster" />
      </div>

      <!-- RIGHT: Movie Info -->
      <div class="info-box">
        <h1 class="title">
          {{ movie.title }}
          <span class="year">({{ movie.year }})</span>
        </h1>

        <p class="meta">Action, Drama • 2h 11m</p>

        <h3 class="section-title">Overview</h3>
        <p class="overview">
          After more than thirty years of service as one of the Navy's top aviators, and dodging the advancement in rank
          that would ground him, Pete "Maverick" Mitchell finds himself training a detachment of TOP GUN graduates for a
          specialized mission the likes of which no living pilot has ever seen.
        </p>

        <div class="actions">
          <!-- Score -->
          <div class="score-box">
            <div class="label">Score</div>
            <div class="score">{{ movie.rating }}</div>
          </div>

          <!-- Add button -->
          <button class="add-btn">Add to Watchlist</button>
        </div>
      </div>

    </div>

    <!-- Cast -->
    <h2 class="cast-title">Cast</h2>

    <div class="cast-grid">
      <div class="cast-card" v-for="c in cast" :key="c.id">
        <img :src="c.img" class="cast-img" />
        <p class="cast-name">{{ c.name }}</p>
        <p class="cast-role">{{ c.role }}</p>
      </div>
    </div>


  </div>
</template>
<style scoped>
.detail-page {
  padding: 40px;
  color: #fff;
  font-family: Lato, sans-serif;
}

.header-box {
  display: flex;
  gap: 40px;
}

.poster-box {
  width: 250px;
  flex-shrink: 0;
}

.poster {
  width: 100%;
  border-radius: 10px;
}

.info-box {
  flex: 1;
}

.title {
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 10px;
}

.year {
  color: #aaa;
}

.meta {
  color: #bbb;
  margin-bottom: 20px;
}

.section-title {
  margin-top: 20px;
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 8px;
}

.overview {
  width: 80%;
  color: #ddd;
  line-height: 1.5;
}

.actions {
  display: flex;
  align-items: center;
  gap: 90px;
  margin-top: 25px;
}

.score-box {
  background: #222;
  padding: 12px 18px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #A41B1B;
}

.score-box .label {
  font-size: 14px;
  color: #bbb;
}

.score-box .score {
  font-size: 28px;
  font-weight: 700;
  color: #ff4646;
}

.add-btn {
  width: 200px;
  height: 63px;
  padding: 31px 23px;
  background: #ff4646;
  border: none;
  border-radius: 6px;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.add-btn:hover {
  background: #ff5c5c;
}

/* Cast Section */
.cast-title {
  margin-top: 50px;
  font-size: 28px;
  margin-bottom: 20px;
}

.cast-grid {
  display: flex;
  gap: 20px;
}

.cast-card {
  width: 150px;
}

.cast-img {
  width: 100%;
  border-radius: 6px;
  margin-bottom: 8px;
}

.cast-name {
  font-size: 15px;
  font-weight: 600;
}

.cast-role {
  font-size: 13px;
  color: #bbb;
}
</style>
