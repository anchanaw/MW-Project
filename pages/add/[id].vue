<script setup>
const route = useRoute()
const id = route.params.id
</script>

<template>
  <div>
    <h1>Add movie {{ id }} to watchlist</h1>
  </div>
</template>
