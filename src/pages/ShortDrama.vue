<!--
 * @Author: Wind
 * @Date: 2025-04-24 23:17:54
-->
<template>
   <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-film text-accent mr-3"></i>
      短剧推荐
    </h1>
    <div class="space-y-5">
      <div v-for="drama in dramas" :key="drama.id" class="gradient-card rounded-lg shadow p-6 flex items-center">
        <img :src="drama.cover" alt="cover" class="w-20 h-28 object-cover rounded mr-5 border" />
        <div>
          <h2 class="text-lg font-semibold mb-1">{{ drama.title }}</h2>
          <p class="text-accent text-sm mb-2">主演：{{ drama.actors }}</p>
          <p class="text-gray-300 line-clamp-2">{{ drama.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dramasData from '../mock/dramas.js'

const dramas = dramasData
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
