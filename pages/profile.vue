<template>
  <div class="profile-page">

    <!-- LEFT TEXT -->
    <div class="header-text">
      <h2>Hello!</h2>
      <p>Please log in or create an account<br>to use the features of this app</p>
    </div>

    <!-- LOGIN FORM (Guest Mode) -->
    <div v-if="!auth.isAuthenticated" class="login-section">
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

    <!-- LOGGED-IN MODE -->
    <div v-else class="logged-section">
      <h2>Hello, {{ auth.user.name }} 👋</h2>
      <p>You are logged in as <strong>{{ auth.user.email }}</strong></p>
      <button class="logout-btn" @click="logout">Log out</button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')

const login = async () => {
  await auth.loginWithCredentials(email.value, password.value)
}

const logout = () => {
  auth.logout()
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
  font-size: 28px;       /* เท่ากันเป๊ะ */
  font-weight: 300;      /* น้ำหนักเดียว */
  line-height: 1.35;     /* ระยะห่างสวยเหมือนภาพ */
  margin: 0;
  padding: 0;
  opacity: 0.9;          /* เฉดสีเทาเหมือนใน UI */
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
</style>
