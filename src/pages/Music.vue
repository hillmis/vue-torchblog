<!--
 * @Author: Wind
 * @Date: 2025-04-24 23:17:54
-->
<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-music text-accent mr-3"></i>
      音乐推荐
    </h1>
    <div class="grid gap-6 md:grid-cols-2">
      <div v-for="music in musics" :key="music.id" class="gradient-card rounded-lg shadow p-6 flex items-center">
        <img :src="music.cover" alt="cover" class="w-16 h-16 object-cover rounded mr-4 border" />
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ music.title }}</h2>
          <p class="text-accent text-sm">歌手：{{ music.artist }}</p>
        </div>
        <button class="ml-2 px-3 py-1 bg-accent/80 text-white rounded hover:bg-accent transition">播放</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import musicsData from '../mock/musics.js'

const musics = musicsData
</script>

<style scoped>
</style>
