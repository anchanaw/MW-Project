<template>
    <div v-if="!loading && watchlist" class="watchlist-page">

        <!-- HEADER -->
        <div class="watchlist-header">
            <h1 class="watchlist-title">
                {{ watchlist.title }}
            </h1>

            <button class="edit-btn" @click="goToEdit">
                <img src="/icons/edit-icon.png" class="edit-icon" />
            </button>
        </div>

        <!-- DESCRIPTION -->
        <div class="watchlist-description">
            <h3 class="desc-title">
                About this watchlist
            </h3>

            <p class="desc-text">
                {{ watchlist.description || "No description added." }}
            </p>
        </div>

        <!-- STATS -->
        <div class="watchlist-stats">

            <div class="stat-box">
                <span class="label">ITEMS ON LIST</span>
                <span class="value">
                    {{ watchlist.movies.length }}
                </span>
            </div>

            <div class="stat-box">
                <span class="label">UNWATCHED RUNTIME</span>
                <span class="value">
                    {{ unwatchedRuntime }}
                </span>
            </div>

            <div class="stat-box">
                <span class="label">AVERAGE SCORE</span>
                <span class="value">
                    {{ averageScore }}
                </span>
            </div>

        </div>

        <!-- MOVIES -->
        <div class="movies-grid">
            <WatchlistMovieCard v-for="movie in watchlist.movies" :key="movie.id" v-bind="movie"
                @toggle="auth.toggleWatched(watchlist.id, movie.id)" />
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { navigateTo } from "#app"

import { useAuthStore } from "~/stores/auth"
import WatchlistMovieCard from "~/components/WatchlistMovieCard.vue"

/* ================= STATE ================= */
const route = useRoute()
const auth = useAuthStore()

const id = Number(route.params.id)
const loading = ref(true)

/* ================= COMPUTED ================= */
const watchlist = computed(() => {
    if (!auth.user?.watchlists) return null
    return auth.user.watchlists.find(w => w.id === id) || null
})

const averageScore = computed(() => {
    if (!watchlist.value) return 0

    const rated = watchlist.value.movies.filter(
        m => typeof m.rating === "number" && m.rating > 0
    )

    if (!rated.length) return 0

    const total = rated.reduce(
        (sum, m) => sum + m.rating,
        0
    )

    return Math.round(total / rated.length)
})

const unwatchedMinutes = computed(() => {
    if (!watchlist.value) return 0

    return watchlist.value.movies
        .filter(m => m.watched !== true)
        .reduce((sum, m) => sum + (m.runtime || 0), 0)
})

const unwatchedRuntime = computed(() => {
    const m = unwatchedMinutes.value
    const h = Math.floor(m / 60)
    const min = m % 60
    return `${h}h ${min}m`
})

/* ================= METHODS ================= */
const goToEdit = () => {
    navigateTo(`/watchlist/${id}/edit`)
}

/* ================= LIFECYCLE ================= */
onMounted(() => {
    auth.init()
    loading.value = false
})
</script>

<style scoped>
/* ================= PAGE ================= */
.watchlist-page {
    margin: 26px 62px 0 30px;
    font-family: "Lato", sans-serif;
    color: #e1e1e1;
}

/* ================= HEADER ================= */
.watchlist-header {
    display: flex;
    align-items: center;
    gap: 50px;
    margin-bottom: 20px;
}

.watchlist-title {
    font-size: 38px;
    font-weight: 700;
}

/* ================= EDIT BUTTON ================= */
.edit-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

.edit-btn img {
    filter: brightness(0) invert(1);
}

/* ================= DESCRIPTION ================= */
.watchlist-description {
    margin-bottom: 70px;
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

/* ================= STATS ================= */
.watchlist-stats {
    display: flex;
    gap: 40px;
    margin-bottom: 20px;
}

.stat-box {
    height: 121px;
    padding: 20px 10px;

    background: #2a2a2a;
    border: 1px solid #ff3b3b;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    font-size: 20px;
    color: #bbb;
    margin-bottom: 8px;
}

.stat-box .value {
    font-size: 38px;
    font-weight: 600;
    color: #ff3b3b;
}

/* ================= MOVIES GRID ================= */
.movies-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
</style>