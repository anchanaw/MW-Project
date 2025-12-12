<template>
    <div class="watchlist-page">

        <!-- Header -->
        <div class="watchlist-header">
            <h1 class="watchlist-title">
                {{ watchlist?.title }}
            </h1>

            <button class="edit-btn">✏️</button>
        </div>

        <!-- About Section -->
        <div class="watchlist-description">
            <h3 class="desc-title">About this watchlist</h3>
            <p class="desc-text">
                {{ watchlist.description || "No description added." }}
            </p>
        </div>

        <!-- Stats Section -->
        <div class="watchlist-stats">
            <div class="stat-box">
                <span class="label">ITEMS ON LIST</span>
                <span class="value">{{ watchlist.movies.length }}</span>
            </div>

            <div class="stat-box">
                <span class="label">UNWATCHED RUNTIME</span>
                <span class="value">14h 30m</span>
            </div>

            <div class="stat-box">
                <span class="label">AVERAGE SCORE</span>
                <span class="value">73</span>
            </div>
        </div>

        <!-- Movie List -->
        <div class="movies-grid">
            <div v-for="movie in watchlist.movies" :key="movie.id" class="movie-card">
                <img :src="movie.poster" class="poster" />
                <div class="movie-info">
                    <h4>{{ movie.title }}</h4>
                    <p>{{ movie.year }}</p>
                    <span class="score">{{ movie.score }}/100</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const auth = useAuthStore();

const id = Number(route.params.id);
const watchlist = auth.user.watchlists.find(w => w.id === id);
</script>

<style scoped>
.watchlist-page {
    margin-left: 30px;
    margin-top: 26px;
    font-family: 'Lato', sans-serif;
}

.watchlist-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.watchlist-title {
    font-size: 38px;
    font-weight: 700;
    color: #E1E1E1;
}

.watchlist-description {
  margin-bottom: 70px;
  color: #E1E1E1;

}

.desc-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.desc-text {
  font-size: 16px;
  line-height: 1.4;
}


.watchlist-stats {
    display: flex;
    gap: 40px;
    margin-bottom: 20px;
}

.stat-box {
  background: #2a2a2a;
  padding: 20px 10px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #ff3b3b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 121px; /* สูงเท่ากัน */
}

.stat-box:nth-child(1) {
  width: 168px;
}

.stat-box:nth-child(2) {
  width: 253px;
}

.stat-box:nth-child(3) {
  width: 190px;
}

.stat-box .label {
    display: block;
    color: #bbb;
    font-size: 20px;
    margin-bottom: 8px;
}

.stat-box .value {
    color: #ff3b3b;
    font-size: 38px;
    font-weight: 600;
}

.movies-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.movie-card {
    width: 160px;
}

.poster {
    width: 100%;
    border-radius: 6px;
}

.movie-info {
    margin-top: 6px;
    color: #fff;
}

.score {
    color: #6aff63;
}
</style>
