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
  left: 50%;
  transform: translateX(-50%);
  right: auto !important;
  z-index: 9999;
}

.ant-message-notice-content {
  max-width: calc(100vw - 32px);
  text-align: center;
}
</style>
