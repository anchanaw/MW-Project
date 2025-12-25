<template>
  <div class="edit-page">

    <!-- Header -->
    <div class="top-bar">
      <h2>Edit profile</h2>
      <a-popconfirm title="Logout?" description="You will need to login again." placement="bottomRight" ok-text="Logout"
        cancel-text="Cancel" :ok-button-props="{ danger: true }" :cancel-button-props="{ type: 'text' }"
        @confirm="logout">
        <button class="logout-link">
          Logout
        </button>
      </a-popconfirm>
    </div>

    <div class="edit-container">

      <!-- Avatar -->
      <div class="avatar-section">
        <div class="avatar-circle">
          <img :src="avatarPreview || auth.user.avatar" />
        </div>

        <label class="avatar-btn">
          <img src="/icons/camera-icon.png" />
          Change avatar
          <input type="file" accept="image/*" @change="uploadAvatar" hidden>
        </label>

        <button v-if="avatarPreview" class="remove-btn" @click="removeAvatar">
          Remove avatar
        </button>
      </div>

      <!-- Form -->
      <label>Name *</label>
      <input v-model="name" type="text" />

      <label>Email *</label>
      <input v-model="email" type="email" />

      <label>Password *</label>
      <input v-model="password" type="password" />

      <button class="update-btn" :disabled="isUpdating" @click="updateProfile">
        {{ isUpdating ? "Updating..." : "Update Profile" }}
      </button>


    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "~/stores/auth"
import { message } from "ant-design-vue"

/* ================= STORE ================= */
const auth = useAuthStore()

/* ================= STATE ================= */
const name = ref(auth.user.name)
const email = ref(auth.user.email)
const password = ref(auth.user.password)
const isUpdating = ref(false)

const avatarPreview = ref(null)
const newAvatar = ref(null)

/* ================= AVATAR ================= */
const uploadAvatar = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    avatarPreview.value = reader.result
    newAvatar.value = reader.result
  }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  avatarPreview.value = null
  newAvatar.value = null
}

/* ================= ACTIONS ================= */
const updateProfile = async () => {
  if (isUpdating.value) return

  isUpdating.value = true

  await auth.updateProfile({
    name: name.value,
    email: email.value,
    password: password.value || auth.user.password,
    avatar: newAvatar.value ?? auth.user.avatar
  })

  message.success("Profile updated")
  isUpdating.value = false
  navigateTo("/profile")
}

const logout = () => {
  auth.logout()
  message.info("Logged out")
  navigateTo("/profile")
}

</script>

<style scoped>
/* ================= PAGE ================= */
.edit-page {
  min-height: 100vh;
  padding: 40px 60px;
  color: white;
  font-family: 'Lato', sans-serif;
}

/* ================= HEADER ================= */
.top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.logout-link {
  background: none;
  border: none;
  color: #ff5d5d;
  cursor: pointer;
  font-size: 14px;
}

/* ================= CONTAINER ================= */
.edit-container {
  width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
}

/* ================= AVATAR ================= */
.avatar-section {
  text-align: center;
  margin-bottom: 25px;
}

.avatar-circle {
  width: 110px;
  height: 110px;
  background: #ddd;
  border-radius: 50%;
  overflow: hidden;
  margin: auto;
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-btn {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
  cursor: pointer;
  opacity: 0.8;
}

.avatar-btn img {
  width: 30px;
}

.remove-btn {
  background: none;
  color: #ff5d5d;
  margin-top: 6px;
  cursor: pointer;
}

/* ================= FORM ================= */
label {
  margin-top: 10px;
  opacity: 0.9;
}

input {
  height: 42px;
  background-color: #FFFFFF05;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #E1E1E1;
  color: #fff;
  padding-left: 10px;
}

/* ================= BUTTON ================= */
.update-btn {
  background: #ff4646;
  border: none;
  padding: 10px;
  border-radius: 6px;
  color: #111;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}
</style>
