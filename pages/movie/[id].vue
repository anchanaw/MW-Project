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

        <!-- ⭐⭐ SCROLL AREA สำหรับลิสท์ ⭐⭐ -->
        <div class="watchlist-scroll">
          <div class="watchlist-option" v-for="list in (auth.user?.watchlists || [])" :key="list.id"
            @click="addMovieToList(list.id)">
            <div class="list-icon">
              {{ list.title.charAt(0).toUpperCase() }}
            </div>
            <span class="list-title">{{ list.title }}</span>
          </div>
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

        <div class="form-group">
          <label class="input-label">Name</label>
          <input type="text" v-model="newListName" class="input-box" />
        </div>

        <div class="form-group">
          <label class="input-label">Description</label>
          <textarea v-model="newListDescription" class="textarea-box"></textarea>
        </div>

        <button class="cancel-btn" @click="goBackPopup">Cancel</button>
        <button class="save-btn" @click="saveNewWatchlist">Save</button>

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

  // 1) สร้างลิสใหม่
  auth.addWatchlist({
    title: newListName.value,
    description: newListDescription.value
  });

  // 2) หาลิสล่าสุดที่เพิ่งสร้าง
  const newList = auth.user.watchlists[auth.user.watchlists.length - 1];

  // 3) เพิ่มหนังลงลิสใหม่ทันที
  auth.addMovieToWatchlist(newList.id, movie.value);

  // 4) ล้างฟอร์ม
  newListName.value = "";
  newListDescription.value = "";

  // 5) ปิด popup create และกลับไป popup ก่อนหน้า
  showCreatePopup.value = false;
  showPopup.value = true;
}

// open create popup
function openCreatePopup() {
  showPopup.value = false;
  showCreatePopup.value = true;
}

function goBackPopup() {
  showCreatePopup.value = false;  // ปิด popup create
  showPopup.value = true;         // เปิด popup ก่อนหน้า
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
  flex-wrap: nowrap;
  gap: 25px;
  overflow-x: auto;
  padding-bottom: 10px;
}

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

.popup-container {
  background: #1d1d1d;
  padding: 30px;
  width: 700px;
  max-height: 300px;
  border-radius: 10px;
  border: 1px solid #444;
  color: white;
  position: relative;
  font-family: 'Lato', sans-serif;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.watchlist-scroll {
  flex: 1;                
  overflow-y: auto;        
  padding-right: 8px;      
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

.to-watchlist {
  color: #ddd;
  font-size: 16px;
  margin-bottom: 21px;
}

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
  margin-top: auto;
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

.create-popup {
  position: relative;
  width: 700px;
  height: 300px;
  background: #161616;
  border: 1px solid #E1E1E1;
  border-radius: 4px;
  padding: 30px;
  padding-bottom: 80px;
  box-sizing: border-box;
  color: #E1E1E1;
}

.create-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}

.form-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

.input-label {
  font-size: 16px;
  font-weight: 700;
}

.input-box {
  width: 295px;
  height: 40px;
  padding: 8px 10px;
  background: #161616;
  border: 1px solid #E1E1E1;
  border-radius: 6px;
  color: #E1E1E1;
  margin-left: 41px;
}

.textarea-box {
  width: 295px;
  height: 140px;
  padding: 10px;
  background: #161616;
  border: 1px solid #E1E1E1;
  border-radius: 6px;
  color: #E1E1E1;
  resize: none;
}

.cancel-btn,
.save-btn {
  position: absolute;
}

.cancel-btn {
  right: 150px;
  bottom: 30px;
  background: none;
  border: none;
  color: #F33F3F;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.save-btn {
  right: 10px;
  bottom: 20px;
  width: 110px;
  height: 41px;
  background: #F33F3F;
  color: black;
  padding: 8px 28px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.save-btn:hover {
  background: #ff5d5d;
}
</style>
