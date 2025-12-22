<template>
    <div class="layout">
        <button v-if="!isSidebarOpen" class="sidebar-toggle" @click="toggleSidebar">
            ☰
        </button>

        <aside class="sidebar" :class="{ open: isSidebarOpen }">
            <NuxtLink to="/">
                <img src="/icons/watchlists-icon.png" alt="Watchlists" class="title-image" />

            </NuxtLink>
            <div class="search-box">
                <input type="text" placeholder="Search" v-model="keyword" @keyup.enter="goSearch" />
                <span class="search-icon" @click="goSearch"></span>
            </div>


            <nav class="menu">
                <NuxtLink to="/" class="menu-btn">
                    <img src="/icons/home-icon.png" alt="home-icon">
                    <span>Home</span>
                </NuxtLink>
                <NuxtLink to="/history" class="menu-btn">
                    <img src="/icons/history-icon.png" alt="history-icon">
                    <span>History</span>
                </NuxtLink>
            </nav>

            <NuxtLink to="/create" class="create-btn">
                + Create watchlist
            </NuxtLink>

            <div class="line"></div>
            <div class="my-lists">
                <h3>My Lists</h3>

                <div v-if="auth.user?.watchlists && auth.user.watchlists.length > 0">
                    <NuxtLink v-for="list in auth.user.watchlists" :key="list.id" :to="`/watchlist/${list.id}`"
                        class="list-item">
                        <span class="icon">{{ list.title.charAt(0).toUpperCase() }}</span>
                        <span class="list-title">{{ list.title }}</span>
                    </NuxtLink>
                </div>
            </div>

            <div class="profile-box">
                <div class="left">
                    <div class="avatar">
                        <img :src="auth.user?.avatar || '/icons/user-icon.png'" alt="avatar" />
                    </div>

                    <span class="name">
                        {{ auth.isAuthenticated ? auth.user.name : "GUEST" }}
                    </span>
                </div>

                <!-- จุด + popup -->
                <div class="dots-wrapper">
                    <NuxtLink to="/profile" class="dots">
                        <img src="/icons/dot-icon.png" alt="More options" class="dots-icon" />
                    </NuxtLink>
                    <div class="popup-menu">
                        <NuxtLink to="/edit" class="popup-item">
                            Edit
                        </NuxtLink>

                        <button class="popup-item logout" @click="logout">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

        </aside>

        <AddMoviePopup />

        <div class="overlay" v-if="isSidebarOpen && !popup.showPopup" @click="isSidebarOpen = false"></div>

        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { navigateTo } from '#app'
import { useRoute } from 'vue-router'
import { useMainStore } from '~/stores/main'
import { useAuthStore } from '~/stores/auth'
import { useMovieStore } from "~/stores/movie";


const movieStore = useMovieStore();
const route = useRoute()
const isSidebarOpen = ref(false)

const store = useMainStore()
const auth = useAuthStore()
const keyword = ref("");

const goSearch = () => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return;

  const results = movieStore.allMovies.filter(m => {
    const matchTitle = m.title?.toLowerCase().includes(q);
    const matchOverview = m.overview?.toLowerCase().includes(q);

    return matchTitle || matchOverview;
  });

  store.searchResults = results;
  navigateTo("/search");
};

watch(
    () => route.fullPath,
    () => {
        isSidebarOpen.value = false
    }
)

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const logout = () => {
    auth.logout()
    navigateTo('/profile')
}

onMounted(async () => {
  store.loadHistoryFromLocalStorage()
  auth.init()

  await movieStore.initMovies()
})

</script>

<style scoped>
.layout {
    display: flex;
    width: 100%;
    height: 100vh;
    background: #000;
}

.content {
    flex: 1;
    overflow-y: auto;
    background: #FFFFFF1A;
}

.sidebar {
    width: 321px;
    background: #000;
    color: #fff;
    padding: 30px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Lato', sans-serif;

}

.title-image {
    width: 212px;
    height: auto;
    display: block;
    margin-bottom: 20px;
    cursor: pointer;
    padding-left: 12px;
}


a {
    text-decoration: none;
}

h1.title {
    text-decoration: none;
}

.search-box {
    cursor: pointer;
}

/* Search box */
.search-box input {
    width: 247px;
    height: 35px;
    padding: 20px;
    background: #111;
    border: 1px solid #333;
    border-radius: 6px;
    color: #fff;
}

/* Menu buttons */
.menu {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.menu-btn {
    width: 247px;
    height: 41px;
    padding: 12px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 6px;
    text-align: left;
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    line-height: 100%;
    text-decoration: none;
}

.menu-btn.router-link-exact-active {
    background: #1b1b1b;
}

/* Create button */
.create-btn {
    font-family: 'Lato', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 100%;
    margin-top: 20px;
    padding: 12px;
    width: 100%;
    background: #ff3b3b;
    color: #141414;
    border: none;
    border-radius: 6px;
    text-decoration: none;
    cursor: pointer;

}

a.create-btn {
    display: flex;
    justify-content: center;
    align-items: center;
}

.create-btn:hover {
    background: #ECBFC0;
}

.line {
    width: 260px;
    height: 1px;
    background: #D9D9D94D;
    margin: 20px 0 19px;
    border: 1px;
}

/* My lists section */
.my-lists {
    flex: 1;
}

.my-lists h3 {
    font-family: 'Lato', sans-serif;
    font-size: 20px;
    font-weight: 400;
    font-style: normal;
    line-height: 100%;
    color: #bbb;
    margin-bottom: 10px;
}

.my-lists ul {
    list-style: none;
    padding: 0;
}

.my-lists li {
    padding: 8px 0;
    color: #ddd;
}

.my-lists .list-item {
    height: 41px;
    color: #ffffff;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    font-family: 'Lato', sans-serif;
    font-size: 16px;
}

.my-lists .list-item:hover {
    color: #ff3b3b;
}

.my-lists .icon {
    width: 22px;
    height: 22px;
    background: #e6e6e6;
    color: #000;
    font-weight: 700;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    line-height: 1;
}

.profile-box {
    width: 247px;
    height: 44px;
    border: 1px solid #b1b1b1;
    border-radius: 8px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #000;
}

.left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.profile-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.avatar img {
    position: relative;
    width: 32px;
    height: 32px;
    top: 3px;
    border-radius: 50%;
    object-fit: cover;
}


.name {
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
}

.dots-wrapper {
    position: relative;
    padding: 10px;
}

.dots-icon {
    display: flex;
    width: 16px;
    height: 4px;
    cursor: pointer;
}

/* popup ซ่อนก่อน */
.popup-menu {
    position: absolute;
    right: 0;
    bottom: 28px;

    background: #1d1d1d;
    border: 1px solid #444;
    border-radius: 6px;
    min-width: 120px;

    display: none;
    flex-direction: column;
    z-index: 100;
}

/* hover แล้วโชว์ */
.dots-wrapper:hover .popup-menu {
    display: flex;
}

.popup-item {
    padding: 10px 14px;
    white-space: nowrap;
    color: white;
    text-decoration: none;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
}

.popup-item:hover {
    background: #333;
}

.popup-item.logout {
    color: #ff6b6b;
}

.popup-backdrop {
    z-index: 9999;
    /* สูงกว่า sidebar แน่นอน */
    pointer-events: auto;
}

.popup-container {
    pointer-events: auto;
}
</style>
