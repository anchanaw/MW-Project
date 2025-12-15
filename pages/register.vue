<template>
  <div class="register-page">

    <!-- LEFT HEADER TEXT -->
    <div class="header-text">
      <h2>Hello!</h2>
      <p>Please log in or create an account<br>to use the features of this app</p>
    </div>

    <!-- REGISTER FORM SECTION -->
    <div class="register-section">
      <div class="form-container">

        <!-- Avatar -->
        <div class="avatar-box">
          <div class="avatar-circle">
            <img :src="avatarPreview || '/icons/user-2-icon.png'"
              :class="avatarPreview ? 'avatar-img' : 'avatar-placeholder'" alt="avatar" />
          </div>

          <label class="add-avatar-btn">
            <img src="/icons/camera-icon.png" alt="camera" />
            Add an avatar
            <input type="file" accept="image/*" @change="uploadAvatar" hidden>
          </label>
        </div>

        <!-- Form Fields -->
        <label>Name *</label>
        <input v-model="name" type="text" />

        <label>Email *</label>
        <input v-model="email" type="email" />

        <label>Password *</label>
        <input v-model="password" type="password" />

        <button class="create-btn" @click="submitRegister">Create Account</button>

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
      name: "",
      email: "",
      password: "",
      avatar: null,
      avatarPreview: null,
    };
  },

  setup() {
    const auth = useAuthStore();
    const router = useRouter();
    return { auth, router };
  },

  methods: {
    uploadAvatar(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
        this.avatar = reader.result;
      };
      reader.readAsDataURL(file);
    },

    async submitRegister() {
      // ตรวจช่องว่าง
      if (!this.name || !this.email || !this.password) {
        alert("Please fill all fields");
        return;
      }

      //ตรวจ Email ซ้ำใน users array
      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some(u => u.email === this.email)) {
        alert("Email already exists");
        return;
      }

      //สมัครสมาชิก (store จะสร้าง watchlists: [] ให้เองใน auth.js)
      await this.auth.register({
        name: this.name,
        email: this.email,
        password: this.password,
        avatar: this.avatar
      });

      alert("Register success!");
      this.router.push("/profile");
    },
  },
};
</script>


<style scoped>
.register-page {
  background: #111;
  min-height: 100vh;
  padding: 40px 60px;
  color: white;
  position: relative;
}

/* HEADER TEXT (เหมือนหน้า login) */
.header-text {
  max-width: 450px;
  margin-bottom: 40px;
  font-family: 'Lato', sans-serif;
}

.header-text h2,
.header-text p {
  font-size: 28px;
  font-weight: 300;
  line-height: 1.35;
  margin: 0;
  opacity: 0.9;
}

/* CENTER FORM */
.register-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.form-container {
  width: 380px;
  display: flex;
  flex-direction: column;
}

.avatar-box {
  text-align: center;
  margin-bottom: 25px;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 8px auto;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.avatar-placeholder {
  width: 50px;
  height: 50px;
  object-fit: contain;
  opacity: 0.7;
}

.add-avatar-btn {
  background: none;
  border: none;
  color: white;
  opacity: 0.8;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0 auto;
}

.add-avatar-btn img {
  width: 33px;
}

.add-avatar-btn:hover {
  opacity: 1;
}

/* Inputs */
label {
  font-size: 20px;
  font-family: 'Lato', sans-serif;
  letter-spacing: 1.4px;
  opacity: 0.9;
  margin-bottom: 4px;
}

input {
  width: 350px;
  height: 45px;
  background: #FFFFFF05;
  border: 1px solid #E1E1E1;
  padding: 10px;
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  margin-bottom: 18px;
}

/* Submit Button */
.create-btn {
  width: 247px;
  height: 41px;
  margin-left: auto;
  margin-right: auto;
  background: #ff4646;
  border: none;
  border-radius: 6px;
  color: #111;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  margin-top: 34px;
}

.create-btn:hover {
  background: #ff5d5d;
}
</style>
