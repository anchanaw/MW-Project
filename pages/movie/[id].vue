<script setup>
const route = useRoute()
const id = route.params.id
</script>

<template>
  <div>
    <h1>Movie detail: {{ id }}</h1>
    <!-- TODO: fetch data by id whenต่อ APIจริง -->
  </div>
</template>
