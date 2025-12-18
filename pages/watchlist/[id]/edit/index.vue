<template>
  <div v-if="watchlist" class="edit-page">

    <div class="header-row">
      <h1>Edit your Watchlist</h1>
      <button class="delete-btn" @click="deleteList">Delete Watchlist</button>
    </div>

    <!-- Name -->
    <label class="label">Name</label>
    <input v-model="name" class="input-box" />

    <!-- Description -->
    <label class="label">Description</label>
    <textarea v-model="description" class="textarea-box"></textarea>

    <!-- Movies -->
    <label class="label">Movies</label>

    <div class="movie-row" v-for="movie in movies" :key="movie.id">
      <img :src="movie.img" class="poster" />
      <span class="movie-title">{{ movie.title }} ({{ movie.year }})</span>
      <button class="remove-btn" @click="removeMovie(movie.id)">Remove</button>
    </div>

    <!-- Save button -->
    <button class="save-btn" @click="saveChanges">Save</button>

  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";
import { computed, ref, onMounted } from "vue";

const route = useRoute();
const auth = useAuthStore();
const id = Number(route.params.id);

// โหลด watchlist ที่ต้องการแก้ไข
const watchlist = computed(() =>
  auth.user.watchlists.find(w => w.id === id)
)

// สร้างตัวแปรแก้ไขได้
const name = ref("");
const description = ref("");
const movies = ref([]);

// โหลดข้อมูลเข้า form
watchlist.value && (() => {
  name.value = watchlist.value.title;
  description.value = watchlist.value.description;
  movies.value = [...watchlist.value.movies]; 
})();

// ลบหนังในลิสต์
function removeMovie(movieId) {
  movies.value = movies.value.filter(m => m.id !== movieId);
}

// บันทึก
function saveChanges() {
  auth.updateWatchlist(id, {
    title: name.value,
    description: description.value,
    movies: movies.value
  });

  navigateTo(`/watchlist/${id}`);
}

// ลบลิสต์ทั้งหมด
function deleteList() {
  auth.deleteWatchlist(id);
  navigateTo("/");
}
</script>

<style scoped>
.edit-page {
  margin: 26px 60px 0 30px;
  font-family: "Lato", sans-serif;
  color: white;
}

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

.delete-btn {
  font-size: 16px;
  font-weight: 700;
  text-decoration: underline;
}

.label {
  display: block;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 700;
  color: #E1E1E1;
}

.input-box {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #1b1b1b;
  color: white;
  margin-top: 6px;
  margin-bottom: 10px;
}

.textarea-box {
  width: 100%;
  height: 120px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #1b1b1b;
  color: white;
  margin-bottom: 10px;
}

.movie-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 15px;
  border: 1px solid #555;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
}

.poster {
  width: 55px;
  border-radius: 6px;
}

.movie-title {
  flex: 1;
}

.remove-btn {
  width: 77px;
  height: 41px;
  background: none;
  border: 1px solid #ff3b3b;
  color: #E1E1E1;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  justify-items: center;
  align-items: center;
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
  cursor: pointer;
}
</style>
