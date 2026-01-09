<template>
  <div v-if="watchlist" class="edit-page">

    <!-- Header -->
    <div class="header-row">
      <h1>Edit your Watchlist</h1>
      <a-popconfirm title="Delete this watchlist?" description="This action cannot be undone." ok-text="Delete"
        cancel-text="Cancel" placement="bottomRight" :ok-button-props="{ danger: true }"
        :cancel-button-props="{ type: 'text' }" @confirm="deleteList">
        <button class="delete-btn">
          Delete Watchlist
        </button>
      </a-popconfirm>

    </div>

    <!-- Name -->
    <label class="label">Name</label>
    <input v-model="name" class="input-box" />

    <!-- Description -->
    <label class="label">Description</label>
    <textarea v-model="description" class="textarea-box"></textarea>

    <!-- Movies -->
    <label class="label">Movies</label>

    <a-list :data-source="movies" item-layout="horizontal">
      <template #renderItem="{ item }">
        <a-list-item class="movie-row">

          <a-list-item-meta>
            <template #avatar>
              <img :src="item.img" class="poster" />
            </template>

            <template #title>
              {{ item.title }} ({{ item.year }})
            </template>
          </a-list-item-meta>

          <template #actions>
            <a-button danger type="text" @click="removeMovie(item.id)">
              Remove
            </a-button>
          </template>

        </a-list-item>
      </template>
    </a-list>

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
  auth.user?.watchlists.find(w => w.id === id)
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

/* ================= INPUT (Name / Description) ================= */
.input-box,
.textarea-box {
  width: 100%;
  margin-top: 6px;
  margin-bottom: 10px;
  padding: 12px 16px;

  background: linear-gradient(#1b1b1b, #161616);
  color: #fff;

  border: 1px solid #e1e1e1;
  border-radius: 6px;

  font-size: 15px;
  box-sizing: border-box;
}

.input-box:focus,
.textarea-box:focus {
  outline: none;
  border-color: #ffffff;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
}

/* textarea */
.textarea-box {
  height: 120px;
  resize: none;
}

/* ===== Ant List ===== */
:deep(.ant-list-item) {
  border: 1px solid #e1e1e1 !important;
  border-radius: 6px;
  padding: 12px 16px !important;
  margin-bottom: 12px;
  background: linear-gradient(#1b1b1b, #161616);
  box-sizing: border-box;
}

/* ===== Movie row ===== */
.movie-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(#1b1b1b, #161616);
  border-radius: 6px;
  box-sizing: border-box;
}

ล:deep(.ant-list-item) {
  border: none !important;
  padding: 0 !important;
}

:deep(.ant-list-item + .ant-list-item) {
  border-top: 1px solid #e1e1e1 !important;
}

/* ===== Meta layout ===== */
:deep(.ant-list-item-meta) {
  align-items: center;
}

:deep(.ant-list-item-meta-title) {
  color: #eaeaea;
  font-size: 15px;
  font-weight: 500;
}

/* ===== Poster ===== */
.poster {
  width: 48px;
  height: auto;
  border-radius: 4px;
}

/* ===== Remove button ===== */
:deep(.ant-btn-dangerous) {
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  background: transparent;
  border-radius: 4px;
  height: 32px;
  padding: 0 14px;
}

:deep(.ant-btn-dangerous:hover) {
  background: rgba(255, 77, 79, 0.12);
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
  font-weight: 700;
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