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
      <a-form
  layout="vertical"
  class="edit-form"
  @finish="updateProfile"
>

  <a-form-item
    label="Name *"
    name="name"
    :rules="[{ required: true, message: 'Please enter your name' }]"
  >
    <a-input v-model:value="name" />
  </a-form-item>

  <a-form-item
    label="Email *"
    name="email"
    :rules="[
      { required: true, message: 'Please enter your email' },
      { type: 'email', message: 'Invalid email format' }
    ]"
  >
    <a-input v-model:value="email" />
  </a-form-item>

  <a-form-item label="Password">
    <a-input-password
      v-model:value="password"
      class="clean-password"
      placeholder="Leave blank to keep current password"
    />
  </a-form-item>

  <a-form-item class="submit-row">
    <button class="update-btn" type="submit" :disabled="isUpdating">
      {{ isUpdating ? 'Updating...' : 'Update Profile' }}
    </button>
  </a-form-item>

</a-form>


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

  if (!auth.user) {
    message.error("User data not ready")
    return
  }

  isUpdating.value = true

  try {
    await auth.updateProfile({
      name: name.value,
      email: email.value,
      password: password.value || auth.user.password,
      avatar: newAvatar.value ?? auth.user.avatar
    })

    message.success("Profile updated")
    navigateTo("/profile")

  } catch (err) {
    console.error(err)
    message.error("Failed to update profile")

  } finally {
    isUpdating.value = false
  }
}

const logout = () => {
  auth.logout()
  message.info("Logged out")
  navigateTo("/profile")
}

onMounted(() => {
  if (auth.user) {
    name.value = auth.user.name
    email.value = auth.user.email
  }
})
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

/* ให้ Ant Form กว้างเท่ากล่อง */
:deep(.edit-container > .ant-form) {
  width: 100%;
}

/* center ปุ่ม submit */
:deep(.submit-row .ant-form-item-control-input-content) {
  display: flex;
  justify-content: center;
}

/* Ant Input Password */
::v-deep(.clean-password.ant-input-affix-wrapper) {
  height: 42px;
  background-color: #FFFFFF05;
  border: 1px solid #E1E1E1;
  border-radius: 6px;
  color: #fff;
  padding-left: 10px;
  margin-bottom: 12px;
  transition: transform 0.15s ease;
}

::v-deep(.clean-password input) {
  background: transparent;
  color: white;
}

::v-deep(.clean-password:hover),
::v-deep(.clean-password.ant-input-affix-wrapper-focused) {
  border-color: #E1E1E1 !important;
  box-shadow: none !important;
}

::v-deep(.clean-password.ant-input-affix-wrapper-focused) {
  transform: scale(1.01);
}

::v-deep(.clean-password .ant-input-password-icon) {
  color: #aaa;
}

::v-deep(.clean-password .ant-input-password-icon:hover) {
  color: #fff;
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
