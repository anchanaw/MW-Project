<template>
  <div class="watchlist-card">

    <!-- Poster (click ไป detail) -->
    <NuxtLink :to="`/movie/${id}`" class="poster-link">
      <img :src="img" :alt="title" class="poster" />
    </NuxtLink>

    <!-- MARK TOP RIGHT -->
    <a-popconfirm v-if="!watched" title="ดูหนังเรื่องนี้จบแล้วใช่ไหม?" ok-text="ดูแล้ว" cancel-text="ยัง"
      overlayClassName="watch-popconfirm" @confirm="$emit('toggle')">
      <button class="watch-mark" aria-label="Mark as watched">
        <img src="/icons/check-icon.png" alt="not watched" />
      </button>
    </a-popconfirm>

    <a-popconfirm v-else title="ต้องการยกเลิกการทำเครื่องหมายว่าดูแล้วหรือไม่?" ok-text="ยกเลิก" cancel-text="ไม่"
      overlayClassName="watch-popconfirm" @confirm="$emit('toggle')">
      <button class="watch-mark watched" aria-label="Unmark watched">
        <img src="/icons/check-icon-green.png" alt="watched" />
      </button>
    </a-popconfirm>

    <!-- Info -->
    <div class="info">
      <div class="score-row">
        <img :src="emojiFor(rating)" class="emoji" />
        <span class="score">{{ rating }}</span>
        <span class="total">/100</span>
      </div>

      <div class="title" v-html="formatTitle(title)"></div>
      <div class="year">({{ year }})</div>
    </div>

  </div>
</template>

<script setup>
/* ================= PROPS ================= */
defineProps({
  id: {
    type: [Number, String],
    required: true
  },
  title: String,
  img: String,
  year: [Number, String],
  rating: Number,
  watched: {
    type: Boolean,
    default: false
  }
})

/* ================= HELPERS ================= */
const emojiFor = (rating) => {
  if (typeof rating !== 'number') return '/emojis/normal-35-and-80.png'
  if (rating >= 70) return '/emojis/great-80.png'
  if (rating >= 40) return '/emojis/normal-35-and-80.png'
  return '/emojis/awful-35.png'
}

const formatTitle = (text = '') =>
  text.replace(':', ':<br>')
</script>

<style scoped>
/* ================= CARD ================= */
.watchlist-card {
  position: relative;
  width: 150px;
  height: 340px;
  margin-top: 70px;
  background: #0f0f0f;
  border-radius: 4px;
  color: #fff;
  font-family: Inter, Roboto, sans-serif;
}

/* ================= POSTER ================= */
.poster {
  width: 100%;
  height: 225px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

/* ================= INFO ================= */
.info {
  padding: 5px 10px 10px;
}

.score-row {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 6px;
  padding: 5px;
}

.emoji {
  width: 22px;
  height: 22px;
}

.score {
  font-size: 18px;
  font-weight: 700;
}

.total {
  font-size: 14px;
  color: #bbb;
}

.title {
  font-size: 16px;
  color: #E1E1E1;
}

.year {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 300;
  opacity: 0.8;
  color: #E1E1E1;
}

/* ================= WATCH MARK ================= */
.watch-mark {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 2;
}

.watch-mark img {
  width: 26px;
  height: 26px;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.watch-mark.watched img {
  filter: drop-shadow(0 0 6px rgba(120, 255, 120, 0.6));
}

.watch-mark:hover img {
  transform: scale(1.08);
}

:deep(.ant-popover.watch-popconfirm) {
  border: 2px solid red;
}
</style>

<style>
.ant-popover.watch-popconfirm {
  border-radius: 10px;
}

.ant-popover.watch-popconfirm .ant-popover-inner {
  background-color: #1d1d1d;
  border: 1px solid #444;
  border-radius: 10px;
}

.ant-popover.watch-popconfirm .ant-popconfirm-message,
.ant-popover.watch-popconfirm .ant-popconfirm-title {
  color: #fff;
  font-size: 14px;
}

.ant-popover.watch-popconfirm .ant-btn-primary {
  background-color: #2ecc71;
  border-color: #2ecc71;
}

.ant-popover.watch-popconfirm .ant-btn-default {
  background-color: transparent;
  color: #aaa;
  border-color: #555;
}
</style>