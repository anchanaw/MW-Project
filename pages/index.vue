<template>
    <div class="main-container">
    
    <!-- Welcome box -->
    <div class="welcome-box">
      <h1>Welcome to <span class="highlight">Watchlists</span></h1>
      <p>Browse movies, add them to watchlists and share them with friends.</p>
      <p>Just click the <span class="plus-icon"></span> to add a movie, the poster to see more details or <span class="check-icon"></span> to mark the movie as watched.</p>
    </div>

    <!-- Search -->
    <div class="search-area">
      <img src="/images/search-icon.png" class="search-icon" alt="search">
      <input type="text" placeholder="Search for movies by title" />
      <button class="search-btn">search</button>
    </div>

    <!-- Popular movies title -->
    <h2>Popular movies right now</h2>

    <!-- Movie grid -->
    <div class="movie-grid">
    <MovieCard
      v-for="movie in movies"
      :key="movie.id"
      v-bind="movie"
    />
  </div>

  </div>
</template>

<script>

const movies = [
  { id: 1, title: 'Top Gun: Maverick', year: 2022, img: '/movies/topgun-poster.jpg', rating: 83 },
  { id: 2, title: 'Fantastic Beasts: The Secrets of Dumbledore', year: 2022, img: '/movies/fantastic-poster.jpg', rating: 68 },
  { id: 3, title: 'Top Gun: Maverick', year: 2022, img: '/movies/topgun-poster.jpg', rating: 83 },
  { id: 4, title: 'Fantastic Beasts', year: 2022, img: '/movies/fantastic-poster.jpg', rating: 68 },
  { id: 5, title: 'Top Gun: Maverick', year: 2022, img: '/movies/topgun-poster.jpg', rating: 83 }
]
</script>

<style scoped>

.main-container {
  flex: 1;
  background: #FFFFFF1A;
  color:#E1E1E1;
  padding: 40px;
  overflow-y: auto;
  font-family: Lato, sans-serif;
}

.welcome-box {
  display: flex; 
  flex-direction: column;
  width: 100%;  
  background-color: #D9D9D91A;
  border: 1px solid #A41B1B;
  padding: 20px 20px 33px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.welcome-box h1,.highlight {
    font-size: 40px;
    font-weight: 400;
    margin-bottom:  21px;
}

.highlight {
  color: #ff4646;
}

.welcome-box p {
    display: flex;
    font-size: 20px;
    font-weight: 400;
    line-height: 100%;
    margin: 14px 0 0;
    gap: 10px;
}

.plus-icon {
    width: 24px;
    height: 35px;
    background: url('/images/plus-icon.png');
     background-size: 24px 35px;
}

.check-icon {
    width: 28px;
    height: 25px;
    background: url('/images/check-icon.png');
}

/* Search section */
.search-area {
  position: relative;
  display: flex;
  align-items: center;
  width: 988px;
  height: 45px;
  margin-bottom: 30px;

  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
}

/* input inside the box */
.search-area input {
  flex: 1; 
  height: 100%;
  padding: 0 12px 0 40px;  
  background: transparent;
  border: none;
  color: white;
}

.search-area input:focus {
  outline: none;
}

/* search icon inside input */
.search-icon {
  position: absolute;
  left: 14px;
  width: 20px;
  height: 20px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-btn {
  position: absolute;
  right: -2px; 
  height: 45px; 
  padding: 0 25px;

  background: #ff4646;
  border: 1px solid #333;
  border-radius: 6px; 
  cursor: pointer;

  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.search-btn:hover {
  background: #ff5c5c;
}

/* Popular movies */
h2 {
  font-family: Lato, sans-serif;
  margin-bottom: 35px;
  font-size: 32px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 1.5px;
}

/* Grid 5 movie cards */
.movie-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
