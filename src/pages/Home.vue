<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-home text-accent mr-3"></i>
      首页
    </h1>

    <!-- 轮播图 -->
    <div class="gradient-card rounded-lg overflow-hidden mb-8">
      <div class="relative h-64">
        <div class="flex transition-transform duration-500 ease-in-out h-full"
             :style="`transform: translateX(-${currentSlide * 100}%)`">
          <div v-for="slide in slides" :key="slide.id" class="carousel-item w-full flex-shrink-0 relative">
            <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover">
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 class="text-lg font-medium text-white">{{ slide.title }}</h3>
              <p class="text-sm text-gray-200">{{ slide.description }}</p>
            </div>
          </div>
        </div>
        <button class="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10" 
                @click="prevSlide">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10" 
                @click="nextSlide">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          <button v-for="(slide, index) in slides" :key="index"
                  class="carousel-indicator w-2 h-2 rounded-full bg-white/50 hover:bg-white"
                  :class="{ 'bg-accent': currentSlide === index, 'bg-white/50': currentSlide !== index }"
                  @click="goToSlide(index)"></button>
        </div>
      </div>
    </div>

    <!-- 热门推荐 -->
    <div class="mb-8">
      <h2 class="text-xl font-bold mb-4">热门推荐</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="item in hotItems" :key="item.id" 
             class="gradient-card rounded-lg overflow-hidden">
          <img :src="item.image" :alt="item.title" class="w-full h-40 object-cover">
          <div class="p-4">
            <h3 class="font-medium mb-2">{{ item.title }}</h3>
            <p class="text-sm text-gray-400">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新动态 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="gradient-card rounded-lg p-4">
        <h2 class="text-xl font-bold mb-4">最新动态</h2>
        <div class="space-y-4">
          <div v-for="news in latestNews" :key="news.id" class="flex items-start">
            <div class="w-12 h-12 rounded bg-accent/20 flex items-center justify-center mr-3">
              <i :class="news.icon + ' text-accent'"></i>
            </div>
            <div>
              <h3 class="font-medium">{{ news.title }}</h3>
              <p class="text-sm text-gray-400">{{ news.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="gradient-card rounded-lg p-4">
        <h2 class="text-xl font-bold mb-4">网站公告</h2>
        <div class="space-y-4">
          <div v-for="notice in notices" :key="notice.id" 
               class="p-3 rounded bg-accent/10">
            <h3 class="font-medium">{{ notice.title }}</h3>
            <p class="text-sm text-gray-400 mt-1">{{ notice.content }}</p>
            <div class="text-xs text-accent mt-2">{{ notice.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { slides, hotItems, latestNews, notices } from '../mock/home.js'

const currentSlide = ref(0)

const goToSlide = (index) => {
  currentSlide.value = index
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

// Auto sliding
let autoSlideInterval

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextSlide()
  }, 5000) // Change slide every 5 seconds
}

const stopAutoSlide = () => {
  clearInterval(autoSlideInterval)
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.carousel-indicator {
  transition: background-color 0.3s ease;
}

.carousel-item {
  position: relative;
  height: 100%;
}
</style>
