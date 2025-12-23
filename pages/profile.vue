<template>
  <div class="profile-page">

    <!-- GUEST MODE -->
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

          <button class="login-btn" @click="loginUser">Login</button>

          <p class="create-link">
            or <NuxtLink to="/register">create an account</NuxtLink>
          </p>

        </div>
      </div>
    </div>


    <!-- LOGGED-IN MODE -->
    <div v-else class="profile-user">
      <div class="profile-center">

        <div class="profile-avatar">
          <img :src="auth.user.avatar || '/icons/user-icon.png'" />
        </div>

        <h2 class="profile-name">Hello, {{ auth.user.name }} 👋</h2>

        <p class="profile-email">
          You are logged in as <strong>{{ auth.user.email }}</strong>
        </p>

        <div class="profile-actions">
          <button class="edit-btn" @click="goEdit">
            Edit Profile
          </button>

          <button class="logout-btn" @click="logoutUser">
            Logout
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },

  setup() {
    const auth = useAuthStore();
    const router = useRouter();

    auth.init();

    return {
      auth,
      router,
    };
  },

  methods: {
    async loginUser() {
      await this.auth.loginWithCredentials(this.email, this.password);
    },

    logoutUser() {
      this.auth.logout();
    },

    goEdit() {
      this.router.push("/edit");
    },
  },
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 40px 60px;
  color: white;
  position: relative;
  font-family: 'Lato', sans-serif;
}

.header-text {
  max-width: 450px;
  margin-bottom: 103px;
}

.header-text h2,
.header-text p {
  font-size: 28px;
  font-weight: 300;
  line-height: 1.35;
  margin: 0;
  padding: 0;
  opacity: 0.9;
}

.login-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  font-family: 'Lato', sans-serif;
}

.login-box {
  width: 351px;
  height: 45px;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 20px;
  margin-bottom: 4px;
}

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
  margin-left: auto;
  margin-right: auto;
  margin-top: 52px;
}

.login-btn:hover {
  background: #ff5d5d;
}

.create-link {
  text-align: center;
  margin-top: 14px;
  font-size: 14px;
}

.create-link a {
  color: #ff5d5d;
}

.logged-section {
  margin-top: 80px;
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
.profile-actions {
  display: flex;
  gap: 14px;           
  margin-top: 20px;
}

.edit-btn {
  flex: 1;
}

.logout-btn {
  flex: 1;
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

.logout-btn:hover {
  background: #ff5d5d;
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