<template>
  <div class="main-container">

    <!-- Welcome box -->
    <div class="welcome-box">
      <h1>Welcome to <span class="highlight">Watchlists</span></h1>
      <p>Browse movies, add them to watchlists and share them with friends.</p>
      <p>
        Just click the
        <img class="welcome-plus-icon" src="/icons/plus-icon.svg" alt="Add" />
        to add a movie, the poster to see more details or
        <img class="check-icon" :src="isChecked ? '/icons/check-icon-green.png' : '/icons/check-icon.png'"
          @click="isChecked = !isChecked" />
        to mark the movie as watched.
      </p>

    </div>

    <!-- Search area -->
    <div class="search-area">
      <img src="/icons/search-icon.png" class="search-icon" alt="search">

      <input v-model="searchText" @keyup.enter="goSearch" type="text" placeholder="Search for movies by title" />

      <button class="search-btn" @click="goSearch">search</button>
    </div>

    <h2>Popular movies right now</h2>

    <!-- Movie grid -->
    <div class="movie-grid">
      <MovieCard v-for="m in movies" :key="m.id" v-bind="m" @add-to-list="openPopup(m)" />
    </div>

     <!-- =============== POPUP ADD MOVIE =============== -->
    <div v-if="showPopup" class="popup-backdrop">
      <div class="popup-container">

        <div class="popup-header">
          <span class="popup-label-text">Add movie:</span>
          <span class="movie-title">{{ selectedMovie?.title }} ({{ selectedMovie?.year }})</span>
          <button class="close-btn" @click="showPopup = false">✖</button>
        </div>

        <p class="to-watchlist">To watchlist:</p>

        <div class="watchlist-scroll">
          <div class="watchlist-option" v-for="list in auth.user?.watchlists || []" :key="list.id"
            @click="addMovieToList(list.id)">
            <div class="list-icon">
              {{ list.title.charAt(0).toUpperCase() }}
            </div>
            <span class="list-title">{{ list.title }}</span>
          </div>
        </div>

        <button class="new-watchlist" @click="openCreatePopup">
          <span class="plus-icon">+</span> New watchlist
        </button>

      </div>
    </div>

    <!-- =============== POPUP CREATE LIST =============== -->
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
import { ref } from "vue";
import { useRouter } from "vue-router";
// import MovieCard from "~/components/moviecard.vue";
import { useMainStore } from "~/stores/main";
import { useAuthStore } from "~/stores/auth";

const isChecked = ref(false);
// store
const store = useMainStore();
const auth = useAuthStore();

// movies list
const movies = store.movies;

// search
const router = useRouter();
const searchText = ref("");

const goSearch = () => {
  if (!searchText.value.trim()) return;
  router.push({ path: "/search", query: { query: searchText.value.trim() } });
};

// popup states
const showPopup = ref(false);
const showCreatePopup = ref(false);
const selectedMovie = ref(null);

const newListName = ref("");
const newListDescription = ref("");

// open popup for a movie
const openPopup = (movie) => {
  selectedMovie.value = movie;
  showPopup.value = true;
};

// add movie to list
const addMovieToList = (listId) => {
  auth.addMovieToWatchlist(listId, selectedMovie.value);
  showPopup.value = false;
};

// open create list
const openCreatePopup = () => {
  showPopup.value = false;
  showCreatePopup.value = true;
};

// go back popup 1
const goBackPopup = () => {
  showCreatePopup.value = false;
  showPopup.value = true;
};

// save new list
const saveNewWatchlist = () => {
  if (!newListName.value.trim()) return

  auth.addWatchlist(
    {
      title: newListName.value,
      description: newListDescription.value,
    },
    selectedMovie.value 
  )

  newListName.value = ""
  newListDescription.value = ""
  showCreatePopup.value = false
}

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

.welcome-box h1,
.highlight {
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 21px;
}

.highlight {
  color: #ff4646;
}

.welcome-box p {
  display: flex;
  font-size: 20px;
  font-weight: 400;
  line-height: 100%;
  margin: 14px 0 0;
  gap: 10px;
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
