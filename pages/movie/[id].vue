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

          <button class="add-btn" @click="showPopup = true">
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>

    <!-- ⭐ CAST SECTION -->
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

    <!-- POPUP -->
    <div v-if="showPopup" class="popup-backdrop">
      <div class="popup-container">

        <!-- Header -->
        <div class="popup-header">
          <span class="popup-label-text">Add movie:</span>
          <span class="movie-title">{{ movie.title }} ({{ movie.year }})</span>

          <button class="close-btn" @click="showPopup = false">✖</button>
        </div>

        <p class="to-watchlist">To watchlist:</p>

        <!-- Watchlists -->
        <div class="watchlist-option" v-for="list in (auth.user?.watchlists || [])" :key="list.id"
          @click="addMovieToList(list.id)">
          <div class="list-icon">
            {{ list.title.charAt(0).toUpperCase() }}
          </div>
          <span class="list-title">{{ list.title }}</span>
        </div>

        <!-- New List Button -->
        <button class="new-watchlist" @click="openCreatePopup">
          <span class="plus-icon">+</span>
          New watchlist
        </button>

      </div>
    </div>
    <!-- POPUP: CREATE NEW WATCHLIST -->
    <div v-if="showCreatePopup" class="popup-backdrop">
      <div class="create-popup">

        <h2 class="create-title">Create new watchlist</h2>

        <!-- Name -->
        <label class="input-label">Name</label>
        <input type="text" v-model="newListName" class="input-box" />

        <!-- Description -->
        <label class="input-label">Description</label>
        <textarea v-model="newListDescription" class="textarea-box"></textarea>

        <div class="button-row">
          <button class="cancel-btn" @click="showCreatePopup = false">Cancel</button>
          <button class="save-btn" @click="saveNewWatchlist">Save</button>
        </div>

      </div>
    </div>

  </div>
</template>


<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#app";
import { useMainStore } from "~/stores/main";
import { useAuthStore } from "~/stores/auth";

// popup states
const showPopup = ref(false);
const showCreatePopup = ref(false);

// new watchlist fields
const newListName = ref("");
const newListDescription = ref("");

// stores
const store = useMainStore();
const route = useRoute();
const auth = useAuthStore();

// load user session
auth.init();

// current movie
const movie = computed(() =>
  store.movies.find((m) => m.id === Number(route.params.id))
);

// load history
onMounted(() => {
  store.loadHistoryFromLocalStorage();
  if (movie.value) store.setCurrentMovie(movie.value);
});

onBeforeUnmount(() => {
  store.clearHistoryTimer();
});

// add movie to list
function addMovieToList(listId) {
  auth.addMovieToWatchlist(listId, movie.value);
  showPopup.value = false;
}

// save new list
function saveNewWatchlist() {
  if (!newListName.value.trim()) {
    alert("Please enter a name");
    return;
  }

  auth.addWatchlist({
    title: newListName.value,
    description: newListDescription.value
  });

  newListName.value = "";
  newListDescription.value = "";

  showCreatePopup.value = false;
}

// open create popup
function openCreatePopup() {
  showPopup.value = false;
  showCreatePopup.value = true;
}
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

/* BACKDROP */
.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
}

/* POPUP CONTAINER */
.popup-container {
  background: #1d1d1d;
  padding: 30px;
  width: 700px;
  height: 300px;
  border-radius: 10px;
  border: 1px solid #444;
  color: white;
  position: relative;
  font-family: Lato, sans-serif;
}

/* HEADER */
.popup-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.popup-label-text {
  color: #ddd;
  font-size: 16px;
}

.movie-title {
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
}

/* TO WATCHLIST TEXT */
.to-watchlist {
  color: #ddd;
  font-size: 16px;
  margin-bottom: 21px;
}

/* WATCHLIST ITEM */
.watchlist-option {
  display: flex;
  align-items: center;
  width: 247px;
  height: 41px;
  gap: 15px;
  background: #000;
  padding: 14px 18px;
  border-radius: 6px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background 0.15s;
}

.watchlist-option:hover {
  border: 1px #ff5555;
}

.list-icon {
  width: 30px;
  height: 30px;
  background: #e6e6e6;
  color: black;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.list-title {
  font-size: 15px;
  font-weight: 600;
}

/* NEW WATCHLIST BUTTON */
.new-watchlist {
  width: 247px;
  height: 41px;
  background: #ff3b3b;
  padding: 14px;
  border-radius: 6px;
  border: none;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.plus-icon {
  width: 22px;
  height: 22px;
  background: white;
  color: #ff3b3b;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
}

/* creat pop up */
/* CREATE POPUP */
.create-popup {
  background: #1d1d1d;
  padding: 32px 40px;
  width: 700px;
  border-radius: 10px;
  border: 1px solid #555;
  color: white;

  display: flex;
  flex-direction: column;
  gap: 24px;

  /* auto height (สำคัญมาก) */
  height: auto;
}

/* Title */
.create-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
}

/* Label */
.input-label {
  font-size: 16px;
  color: #ddd;
  margin-bottom: 6px;
}

/* Text Input */
.input-box {
  background: #111;
  border: 1px solid #777;
  padding: 12px;
  width: 100%;
  border-radius: 6px;
  color: white;
  font-size: 15px;

  height: 46px;
}

/* Textarea */
.textarea-box {
  background: #111;
  border: 1px solid #777;
  padding: 12px;
  width: 100%;
  height: 150px;       /* ปรับให้สวยตามภาพ */
  border-radius: 6px;
  color: white;
  resize: none;
  font-size: 15px;
}

/* Button Row */
.button-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  margin-top: 15px;
}

/* Cancel Button */
.cancel-btn {
  background: none;
  border: none;
  color: #ff3b3b;
  cursor: pointer;
  font-size: 16px;
  text-decoration: underline;
}

/* Save Button */
.save-btn {
  background: #ff4646;
  padding: 12px 34px;
  border-radius: 6px;
  border: none;
  color: #111;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
}

.save-btn:hover {
  background: #ff5d5d;
}

</style>
