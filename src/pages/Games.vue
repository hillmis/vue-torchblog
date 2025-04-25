<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-gamepad text-accent mr-3"></i>
      游戏推荐
    </h1>
    <div class="grid gap-6 md:grid-cols-2">
      <div v-for="game in games" :key="game.id" class="gradient-card rounded-lg shadow p-6 flex items-center">
        <img :src="game.cover" alt="cover" class="w-20 h-20 object-cover rounded mr-4 border" />
        <div class="flex-1">
          <h2 class="text-lg font-semibold mb-1">{{ game.title }}</h2>
          <p class="text-accent text-sm">类型：{{ game.type }}</p>
          <div class="flex items-center mt-2">
            <span class="text-yellow-400">★</span>
            <span class="ml-1 text-sm">{{ game.rating }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import gamesData from '../mock/games.js'

const games = gamesData
</script>

<style scoped>
</style>
