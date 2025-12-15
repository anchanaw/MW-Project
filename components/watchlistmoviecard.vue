<template>
  <div class="watchlist-card">

    <!-- Poster -->
    <div class="poster-wrapper">
      <img :src="img" alt="" class="poster" />

      <div v-if="rating >= 60" class="checkmark">✔</div>

      <button class="watch-toggle" :class="{ watched }" @click.stop="$emit('toggle')" aria-label="Toggle watched">
        <img :src="watched
          ? '/icons/watched-icon.png'
          : '/icons/unwatched-icon.png'" class="tv-icon" alt="watch-status" />
      </button>
    </div>

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
  id: Number,
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
  border-radius: 4px;
  overflow: visible;
  background: #0f0f0f;
  color: #fff;
  font-family: Inter, Roboto, sans-serif;
  position: relative;
}

.poster {
  width: 100%;
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

.watch-toggle {
  position: absolute;
  bottom: 10px;
  right: 10px;

  background: rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 6px;
  cursor: pointer;

  transition: all .2s ease;
}

.watch-toggle:hover {
  background: rgba(0, 0, 0, 0.85);
}

.watch-toggle.watched {
  box-shadow: 0 0 10px rgba(140, 255, 140, .45);
}

.tv-icon {
  width: 20px;
  height: 20px;
  display: block;
  pointer-events: none;
}
</style>
