<template>
  <div class="profile-page">

    <!-- ⭐ GUEST MODE -->
    <div v-if="!auth.isAuthenticated">
      <div class="header-text">
        <h2>Hello!</h2>
        <p>Please log in or create an account<br>to use the features of this app</p>
      </div>

      <div class="login-section">
        <div class="login-box">

          <label>Email *</label>
          <input v-model="email" type="email" />

          <label>Password *</label>
          <input v-model="password" type="password" />

          <button class="login-btn" @click="login">Log in</button>

          <p class="create-link">
            or <NuxtLink to="/register">create an account</NuxtLink>
          </p>

        </div>
      </div>
    </div>


    <!-- ⭐ LOGGED-IN MODE -->
    <div v-else class="profile-user">
      <div class="profile-center">

        <!-- Avatar -->
        <div class="profile-avatar">
          <img :src="auth.user.avatar || '/icons/user-icon.png'" />
        </div>

        <h2 class="profile-name">Hello, {{ auth.user.name }} 👋</h2>

        <p class="profile-email">
          You are logged in as <strong>{{ auth.user.email }}</strong>
        </p>

        <button class="logout-btn" @click="logout">Log out</button>

        <!-- ⭐ Edit Profile Button — โผล่เฉพาะตอนเป็น User -->
        <button class="edit-btn" @click="goEdit">
  Edit Profile
</button>



      </div>
    </div>

  </div>
</template>



<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const email = ref("")
const password = ref("")

const login = async () => {
  await auth.loginWithCredentials(email.value, password.value)
}

const logout = () => {
  auth.logout()
}

const goEdit = () => {
  navigateTo('/profile/edit')
}

</script>




<style scoped>
/* PAGE BACKGROUND */
.profile-page {
  background: #111;
  min-height: 100vh;
  padding: 40px 60px;
  color: white;
  position: relative;
}

/* LEFT HEADER */
.header-text {
  max-width: 450px;
  margin-bottom: 103px;
  font-family: Lato, sans-serif;
}

/* Hello! + paragraph = สไตล์เดียวกัน */
.header-text h2,
.header-text p {
  font-size: 28px;
  /* เท่ากันเป๊ะ */
  font-weight: 300;
  /* น้ำหนักเดียว */
  line-height: 1.35;
  /* ระยะห่างสวยเหมือนภาพ */
  margin: 0;
  padding: 0;
  opacity: 0.9;
  /* เฉดสีเทาเหมือนใน UI */
}

/* LOGIN SECTION CENTERED */
.login-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  font-family: Lato, sans-serif;
}

.login-box {
  width: 351px;
  height: 45px;
  display: flex;
  flex-direction: column;
}

/* LABEL */
label {
  font-size: 20px;
  margin-bottom: 4px;
}

/* INPUT */
input {
  width: 100%;
  background: #FFFFFF05;
  border: 1px solid #E1E1E1;
  padding: 10px;
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  margin-bottom: 18px;
}

/* LOGIN BUTTON */
.login-btn {
  width: 247px;
  height: 41px;
  padding: 12px;
  background: #ff4646;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  color: #111;
  cursor: pointer;
  margin-top: 5px;

  /* ⭐ อยู่ตรงกลาง */
  margin-left: auto;
  margin-right: auto;
  margin-top: 52px;
}


.login-btn:hover {
  background: #ff5d5d;
}

/* CREATE ACCOUNT */
.create-link {
  text-align: center;
  margin-top: 14px;
  font-size: 14px;
}

.create-link a {
  color: #ff5d5d;
}

/* LOGGED-IN */
.logged-section {
  margin-top: 80px;
}

.logout-btn {
  background: #ff4646;
  padding: 10px 20px;
  color: #111;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  font-weight: bold;
}

/* USER PROFILE LAYOUT */
.profile-user {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

.profile-center {
  text-align: center;
}

/* Avatar */
.profile-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  background: #ddd;
  margin: 0 auto 18px auto;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Name Text */
.profile-name {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 6px;
}

/* Email Text */
.profile-email {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 30px;
}

/* Logout button (ใช้ของเดิมแต่จัดให้อยู่ตรงกลาง) */
.logout-btn {
  background: #ff4646;
  padding: 10px 22px;
  color: #111;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.logout-btn:hover {
  background: #ff5d5d;
}

.edit-btn {
  background: #444;
  padding: 8px 20px;
  margin-top: 15px;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.edit-btn:hover {
  background: #666;
}

/* -------------------- USER MODE -------------------- */

.profile-user {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

.profile-center {
  text-align: center;
}

.profile-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  background: #ddd;
  margin: 0 auto 18px auto;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 6px;
}

.profile-email {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 30px;
}

.edit-btn {
  background: #444;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 14px;
  cursor: pointer;
}

.edit-btn:hover {
  background: #666;
}
</style>