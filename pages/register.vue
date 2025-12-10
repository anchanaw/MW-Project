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
                        <img :src="avatarPreview || '/icons/user-icon.png'" alt="avatar" />
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

                <button class="create-btn" @click="createProfile">
                    Create Profile
                </button>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')

/* ⭐ ตัวแปร avatar */
const avatarFile = ref(null)
const avatarPreview = ref(null)

/* ⭐ อัปโหลดภาพแล้วแสดง preview */
const uploadAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return

    avatarFile.value = file

    const reader = new FileReader()
    reader.onload = () => {
        avatarPreview.value = reader.result   // ⭐ base64 string
    }
    reader.readAsDataURL(file)
}

/* ⭐ ฟังก์ชันสร้างบัญชี (Register + Auto Login) */
const createProfile = async () => {

    // 1) บันทึก user ลง store/localStorage
    await auth.register({
    name: name.value,
    email: email.value,
    password: password.value,
    avatar: avatarPreview.value  // ⭐ base64 ถูกเก็บถาวร
})

    // 2) Login อัตโนมัติทันที
    await auth.loginWithCredentials(email.value, password.value)

    // 3) ไปหน้าโปรไฟล์แบบ logged-in
    navigateTo('/profile')
}
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
    font-family: Lato, sans-serif;
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

/* Avatar Section */
.avatar-box {
    text-align: center;
    margin-bottom: 25px;
}

.avatar-circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 8px auto;
    overflow: hidden; /* ⭐ ป้องกันภาพล้น */
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    font-family: Lato, sans-serif;
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
    font-family: Lato, sans-serif;
    font-weight: 700;
    font-size: 18px;
    cursor: pointer;
    margin-top: 34px;
}

.create-btn:hover {
    background: #ff5d5d;
}
</style>
