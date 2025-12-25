<template>
  <div class="profile-page">

    <!-- ================= GUEST MODE ================= -->
    <div v-if="!auth.isAuthenticated">
      <div class="header-text">
        <h2>Hello!</h2>
        <p>
          Please log in or create an account<br />
          to use the features of this app
        </p>
      </div>

      <div class="login-section">
        <div class="login-box">

          <label>Email *</label>
          <input v-model="email" type="email" />

          <label>Password *</label>
          <a-input-password v-model:value="password" />

          <button class="login-btn" @click="loginUser">
            Login
          </button>

          <p class="create-link">
            or <NuxtLink to="/register">create an account</NuxtLink>
          </p>

        </div>
      </div>
    </div>

    <!-- ================= LOGGED-IN MODE ================= -->
    <div v-else class="profile-user">
      <div class="profile-center">

        <div class="profile-avatar">
          <img :src="auth.user.avatar || '/icons/user-icon.png'" />
        </div>

        <h2 class="profile-name">
          Hello, {{ auth.user.name }} 👋
        </h2>

        <p class="profile-email">
          You are logged in as <strong>{{ auth.user.email }}</strong>
        </p>

        <div class="profile-actions">
          <button class="edit-btn" @click="goEdit">
            Edit Profile
          </button>

          <a-popconfirm title="Logout?" description="You will need to login again." ok-text="Logout"
            cancel-text="Cancel" placement="bottomRight" :ok-button-props="{ danger: true }"
            :cancel-button-props="{ type: 'text' }" @confirm="logoutUser">
            <button class="logout-btn">
              Logout
            </button>
          </a-popconfirm>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { message } from "ant-design-vue";

/* ================= ROUTER ================= */
import { useRouter } from "vue-router";

export default {
  /* ================= DATA ================= */
  data() {
    return {
      email: "",
      password: "",
      isLoggingIn: false

    };
  },

  /* ================= SETUP ================= */
  setup() {
    const auth = useAuthStore();
    const router = useRouter();

    auth.init();

    return {
      auth,
      router,
    };
  },

  /* ================= METHODS ================= */
  methods: {
    async loginUser() {
      const success = await this.auth.loginWithCredentials(
        this.email,
        this.password
      );

      if (success) {
        message.success("Login successful");
      } else {
        message.error("Invalid email or password");
      }
    },

    logoutUser() {
      this.auth.logout();
      message.info("Logged out");
    }
    ,

    goEdit() {
      this.router.push("/edit");
    },
  },
};
</script>

<style scoped>
/* ================= PAGE ================= */
.profile-page {
  min-height: 100vh;
  padding: 40px 60px;
  color: white;
  font-family: 'Lato', sans-serif;
}

/* ================= GUEST HEADER ================= */
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
  opacity: 0.9;
}

/* ================= LOGIN ================= */
.login-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.login-box {
  width: 351px;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 20px;
  margin-bottom: 4px;
}

input {
  background: #FFFFFF05;
  border: 1px solid #E1E1E1;
  padding: 10px;
  border-radius: 6px;
  color: #fff;
  margin-bottom: 18px;
}

:deep(.ant-input-affix-wrapper) {
  background: #FFFFFF05;
  border: 1px solid #E1E1E1;
  border-radius: 6px;
  padding: 10px;
}

:deep(.ant-input) {
  background: transparent;
  color: #fff;
}

:deep(.ant-input-password-icon) {
  color: #ccc !important;
}

.login-btn {
  width: 247px;
  height: 41px;
  background: #ff4646;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  color: #111;
  cursor: pointer;
  margin: 52px auto 0;
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

/* ================= USER MODE ================= */
.profile-user {
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
  margin: 0 auto 18px;
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

/* ================= BUTTONS ================= */
.edit-btn {
  flex: 1;
  background: #444;
  color: white;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.edit-btn:hover {
  background: #666;
}

.logout-btn {
  flex: 1;
  background: #ff4646;
  color: #111;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
}

.logout-btn:hover {
  background: #ff5d5d;
}
</style>
