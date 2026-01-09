<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from  '~/stores/auth'
import { message } from 'ant-design-vue'

message.config({
  top: '16px',
  duration: 2,
  maxCount: 1
})

const auth = useAuthStore()

onMounted(() => {
  auth.init()
})
</script>

<style>
.ant-message {
  position: fixed !important;
  top: 16px;
  left: calc(50% + 160px);
  transform: translateX(-50%);
  z-index: 9999;
}
</style>
