<template>
    <div class="layout">
        <SidebarWishlist />
        <aside class="sidebar">
            <NuxtLink to="/">
                <h1 class="title">Watchlists</h1>
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
            </div>

            <NuxtLink to="/profile" class="profile-link">
                <div class="profile-box">
                    <div class="left">
                        <div class="avatar">
                            <img src="/icons/user-icon.png" alt="user" />
                        </div>
                        <span class="name">GUEST</span>
                    </div>

                    <div class="dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </NuxtLink>

        </aside>
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { navigateTo } from "#app";

const keyword = ref("");

const goSearch = () => {
    if (!keyword.value) return; // กันช่องว่าง

    navigateTo(`/search?query=${encodeURIComponent(keyword.value)}`);
};
</script>

<style scoped>
.layout {
    display: flex;
    /* <-- สำคัญที่สุด */
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
}

.title {
    color: #ff3b3b;
    font-family: Archivo, sans-serif;
    line-height: 100%;
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-left: 12px;
    cursor: pointer;
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
    font-family: Lato, sans-serif;
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
    font-family: Lato, sans-serif;
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
    font-family: Lato, sans-serif;
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

/* ซ้าย: avatar + name */
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
}

/* ชื่อ */
.name {
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
}

/* จุดสามจุด */
.dots {
    display: flex;
    gap: 3px;
}

.dots span {
    width: 5px;
    height: 5px;
    background: #e3e3e3;
    border-radius: 50%;
}
</style>
