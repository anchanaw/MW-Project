<template>
  <div class="create-container">
    <h1 class="title">Create a new Watchlist</h1>

    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" v-model="name" class="input-box" />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea id="description" v-model="description" class="textarea-box"></textarea>
    </div>

    <button class="create-btn" @click="createWatchlist">
      Create watchlist
    </button>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      name: "",
      description: ""
    };
  },

  setup() {
    const auth = useAuthStore();
    const router = useRouter();
    return { auth, router };
  },

  methods: {
    createWatchlist() {
      if (!this.name.trim()) {
        alert("Please enter a name");
        return;
      }

      // ⭐ เพิ่ม watchlist เข้า user ปัจจุบัน
      this.auth.addWatchlist({
        title: this.name,
        description: this.description
      });

      alert("Watchlist created!");
      this.router.push("/profile"); // กลับไปหน้าโปรไฟล์
    }
  }
};
</script>


<style scoped>
.create-container {
  padding: 23px;
  color: #fff;
}

.title,
.form-group,
.create-btn {
  font-family: 'Lato', sans-serif;
  letter-spacing: 1px;
}

.title {
  display: flex;
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 50px;
}

/* Label */
.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 18px;
  color: #dcdcdc;
}

/* Input + Textarea */
.input-box,
.textarea-box {
  width: 100%;
  background: #FFFFFF05;
  border: 1px solid #E1E1E1;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 20px;
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

/* Button */
.create-btn {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 100%;
  margin-top: 10px;
  padding: 12px 20px;
  background: #ff3b3b;
  color: #141414;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.create-btn:hover {
  background: #ff5555;
}
</style>
