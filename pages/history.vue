<template>
  <div class="history-page">

    <div class="history-header">
      <button class="clear-btn" @click="clearHistory">Clear history</button>
    </div>

    <div class="movie-grid">
      <MovieCard
        v-for="movie in history"
        :key="movie.id"
        v-bind="movie"
        :class="{ viewed: movie.isViewed }"
        @add-to-list="openPopup(movie)"
      />
    </div>

    <!-- =============== POPUP ADD MOVIE =============== -->
    <div v-if="showPopup" class="popup-backdrop">
      <div class="popup-container">
        <div class="popup-header">
          <span class="popup-label-text">Add movie:</span>
          <span class="movie-title">
            {{ selectedMovie?.title }} ({{ selectedMovie?.year }})
          </span>
          <button class="close-btn" @click="showPopup = false">✖</button>
        </div>

        <p class="to-watchlist">To watchlist:</p>

        <div class="watchlist-scroll">
          <div
            class="watchlist-option"
            v-for="list in auth.user?.watchlists ?? []"
            :key="list.id"
            @click="addMovieToList(list.id)"
          >
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
          <input v-model="newListName" class="input-box" />
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
import MovieCard from '~/components/MovieCard.vue'
import { useMainStore } from '~/stores/main'
import { storeToRefs } from 'pinia'
import { onMounted, watch ,readonly} from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth' 

const auth = useAuthStore()
const store = useMainStore()
const { history } = storeToRefs(store)
const route = useRoute()


definePageMeta({
  middleware: "auth"
})

function onAddMovie(movie) {
  popup.openPopup(movie)
}

// โหลดซ้ำเมื่อเปลี่ยน route มาที่ /history
watch(
  () => route.fullPath,
  (newVal) => {
    if (newVal === '/history') {
      store.loadHistoryFromLocalStorage()
    }
  },
  { immediate: true }
)

const clearHistory = () => {
  store.clearAllHistory()
}

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
  if (!selectedMovie.value) return
  auth.addMovieToWatchlist(listId, selectedMovie.value)
  showPopup.value = false
}

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


// โหลด history ทุกครั้งที่เข้าหน้านี้
onMounted(() => {
  store.loadHistoryFromLocalStorage()
})
</script>

<style scoped>
.history-page {
  padding: 30px;
  color: #fff;
}

.history-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.clear-btn {
  background: none;
  border: none;
  color: #ff4f4f;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

.viewed {
  border-radius: 6px;
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
