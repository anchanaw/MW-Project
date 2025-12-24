<template>
  <div v-if="watchlist" class="edit-page">

    <!-- Header -->
    <div class="header-row">
      <h1>Edit your Watchlist</h1>
      <button class="delete-btn" @click="deleteList">
        Delete Watchlist
      </button>
    </div>

    <!-- Name -->
    <label class="label">Name</label>
    <input v-model="name" class="input-box" />

    <!-- Description -->
    <label class="label">Description</label>
    <textarea v-model="description" class="textarea-box"></textarea>

    <!-- Movies -->
    <label class="label">Movies</label>

    <div v-for="movie in movies" :key="movie.id" class="movie-row">
      <img :src="movie.img" class="poster" />
      <span class="movie-title">
        {{ movie.title }} ({{ movie.year }})
      </span>
      <button class="remove-btn" @click="removeMovie(movie.id)">
        Remove
      </button>
    </div>

    <!-- Save -->
    <button class="save-btn" @click="saveChanges">
      Save
    </button>

  </div>
</template>

<script setup>
/* ================= IMPORTS ================= */
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

/* ================= STATE ================= */
const route = useRoute();
const auth = useAuthStore();

const id = Number(route.params.id);

const name = ref("");
const description = ref("");
const movies = ref([]);

/* ================= COMPUTED ================= */
const watchlist = computed(() =>
  auth.user.watchlists.find(w => w.id === id)
);

/* ================= INIT ================= */
if (watchlist.value) {
  name.value = watchlist.value.title;
  description.value = watchlist.value.description;
  movies.value = [...watchlist.value.movies];
}

/* ================= METHODS ================= */
function removeMovie(movieId) {
  movies.value = movies.value.filter(m => m.id !== movieId);
}

function saveChanges() {
  auth.updateWatchlist(id, {
    title: name.value,
    description: description.value,
    movies: movies.value
  });

  navigateTo(`/watchlist/${id}`);
}

function deleteList() {
  auth.deleteWatchlist(id);
  navigateTo("/");
}
</script>

<style scoped>
/* ================= PAGE ================= */
.edit-page {
  margin: 26px 60px 0 30px;
  color: #fff;
  font-family: "Lato", sans-serif;
}

/* ================= HEADER ================= */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}

.header-row h1 {
  font-size: 32px;
  font-weight: 400;
}

/* ================= FORM LABEL ================= */
.label {
  display: block;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 700;
  color: #e1e1e1;
}

/* ================= INPUT ================= */
.input-box,
.textarea-box {
  width: 100%;
  margin-top: 6px;
  margin-bottom: 10px;
  padding: 10px;

  background: #1b1b1b;
  color: #fff;

  border: 1px solid #555;
  border-radius: 6px;
}

.textarea-box {
  height: 120px;
  resize: none;
}

/* ================= MOVIE ROW ================= */
.movie-row {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-top: 15px;
  padding: 10px;

  border: 1px solid #555;
  border-radius: 8px;
}

.poster {
  width: 55px;
  border-radius: 6px;
}

.movie-title {
  flex: 1;
}

/* ================= BUTTONS ================= */
.remove-btn {
  width: 77px;
  height: 41px;

  background: none;
  color: #e1e1e1;

  border: 1px solid #ff3b3b;
  border-radius: 4px;

  font-size: 16px;
  cursor: pointer;
}

.save-btn {
  margin-top: 40px;
  width: 247px;
  height: 41px;

  padding: 12px 40px;
  background: #ff3b3b;

  border: none;
  border-radius: 6px;

  font-size: 18px;
  cursor: pointer;
}

.delete-btn {
  background: none;
  border: none;

  color: #ff3b3b;
  font-size: 16px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}
</style>