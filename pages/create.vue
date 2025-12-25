<template>
  <div class="create-container">

    <h1 class="title">
      Create a new Watchlist
    </h1>

    <div class="form-group">
      <label for="name">Name</label>
      <a-input v-model:value="name" class="input-box" />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <a-textarea v-model:value="description" class="textarea-box"></a-textarea>
    </div>

    <button class="create-btn" @click="createWatchlist">
      Create watchlist
    </button>

  </div>
</template>

<script setup>
/* ================= IMPORTS ================= */
import { ref } from "vue"
import { useRouter } from "vue-router"

import { useAuthStore } from "~/stores/auth"
import { message } from "ant-design-vue"

/* ================= PAGE META ================= */
definePageMeta({
  middleware: "auth"
})

/* ================= STATE ================= */
const auth = useAuthStore()
const router = useRouter()

const name = ref("")
const description = ref("")

/* ================= METHODS ================= */
const createWatchlist = () => {
  if (!name.value.trim()) {
    message.warning("Please enter a name")
    return
  }

  auth.addWatchlist({
    title: name.value,
    description: description.value
  })

  message.success("Watchlist created!")
  router.push("/")
}

</script>

<style scoped>
/* ================= CONTAINER ================= */
.create-container {
  padding: 23px;
  color: #fff;
  font-family: "Lato", sans-serif;
}

/* ================= TITLE ================= */
.title {
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 50px;
  letter-spacing: 1px;
}

/* ================= FORM ================= */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 18px;
  color: #dcdcdc;
}

/* ================= INPUTS ================= */
.input-box,
.textarea-box {
  width: 100%;
  padding: 12px;

  background: #ffffff05;
  border: 1px solid #e1e1e1;
  border-radius: 6px;

  color: #fff;
  font-size: 15px;
}

.input-box:focus,
.textarea-box:focus {
  outline: none;
  border-color: #ff3b3b;
}

.textarea-box {
  height: 120px;
  resize: none;
}

/* ================= BUTTON ================= */
.create-btn {
  margin-top: 10px;
  padding: 12px 20px;

  background: #ff3b3b;
  color: #141414;

  border: none;
  border-radius: 6px;

  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  transition: 0.2s;
}

.create-btn:hover {
  background: #ff5555;
}
</style>