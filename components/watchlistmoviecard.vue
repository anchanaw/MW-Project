<template>
  <div class="watchlist-card">

    <!-- Poster (click ไป detail) -->
    <NuxtLink :to="`/movie/${id}`" class="poster-link">
      <img :src="img" :alt="title" class="poster" />
    </NuxtLink>

    <!-- MARK TOP RIGHT -->
    <button
      class="watch-mark"
      :class="{ watched }"
      @click.stop="$emit('toggle')"
      aria-label="Toggle watched"
    >
      <img
        :src="watched
          ? '/icons/check-icon-green.png'
          : '/icons/check-icon.png'"
        alt="watch-mark"
      />
    </button>

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
});

const emojiFor = (rating) => {
  if (rating >= 70) return "/emojis/great-80.png";
  if (rating >= 40) return "/emojis/normal-35-and-80.png";
  return "/emojis/awful-35.png";
};

const formatTitle = (text) => {
  return text.replace(":", ":<br>");
};
</script>

<style scoped>
.watchlist-card {
  width: 150px;
  height: 340px;
  border-radius: 4px;
  overflow: visible;
  background: #0f0f0f;
  color: #fff;
  font-family: Inter, Roboto, sans-serif;
  position: relative;
  margin-top: 70px;
}

.poster {
  width: 100%;
  height: 225px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

.checkmark {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #5cff5c;
  font-size: 26px;
  font-weight: bold;
}

.info {
  padding: 5px 10px 10px 10px;
  color: white;
}

.score-row {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 6px;
  padding: 5px;
  color: #fff;
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
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: #E1E1E1;
}

.year {
  margin: 6px 0 0;
  color: #E1E1E1;
  font-size: 16px;
  font-weight: 300;
  opacity: 0.8;
}

.watch-mark {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 2;
}

.watch-mark img {
  width: 26px;
  height: 26px;
  transition: transform 0.2s ease, filter 0.2s ease;
}

/* ดูแล้ว = เขียว */
.watch-mark.watched img {
  filter: drop-shadow(0 0 6px rgba(120, 255, 120, 0.6));
}

/* hover เบา ๆ */
.watch-mark:hover img {
  transform: scale(1.08);
}


.tv-icon {
  width: 20px;
  height: 20px;
  display: block;
  pointer-events: none;
}
</style>
