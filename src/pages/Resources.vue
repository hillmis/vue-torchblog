<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-download text-accent mr-3"></i>
      资源中心
    </h1>

    <!-- 资源分类导航 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="category in resourceCategories" 
           :key="category.id"
           @click="activeType = category.id"
           class="gradient-card rounded-lg p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
           :class="{ 'ring-2 ring-accent': activeType === category.id }">
        <div class="flex items-start">
          <div class="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mr-4">
            <i :class="category.icon + ' text-accent text-xl'"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-lg mb-1">{{ category.name }}</h3>
            <p class="text-sm text-gray-400 mb-2">{{ category.description }}</p>
            <div class="text-accent text-sm">
              <i class="fas fa-folder-open mr-1"></i>
              <span>{{ category.count }}个资源</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 资源列表 -->
    <div class="gradient-card rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">{{ getCurrentTypeName() }}</h2>
        <div class="flex items-center space-x-4">
          <select v-model="sortBy" class="bg-gray-700 text-white rounded-lg px-3 py-1 outline-none text-sm">
            <option value="newest">最新上传</option>
            <option value="downloads">下载最多</option>
            <option value="size">文件最大</option>
          </select>
          <div class="flex items-center text-sm text-gray-400">
            <i class="fas fa-filter mr-1"></i>
            <span>筛选</span>
          </div>
        </div>
      </div>

      <!-- 短剧资源列表 -->
      <div v-if="activeType === 'drama'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in sortedResources" :key="item.id" 
             class="rounded-lg overflow-hidden bg-accent/5 hover:bg-accent/10 transition-all">
          <div class="relative aspect-[3/4]">
            <img :src="item.cover" :alt="item.title" class="w-full h-full object-cover">
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div class="text-sm">
                <span class="bg-accent/80 text-white px-2 py-1 rounded">{{ item.type }}</span>
                <span class="ml-2 text-gray-200">{{ item.episodes }}集</span>
              </div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold mb-2">{{ item.title }}</h3>
            <div class="text-sm text-gray-400 space-y-1">
              <div><i class="fas fa-film mr-2"></i>{{ item.quality }}</div>
              <div><i class="fas fa-file mr-2"></i>{{ item.size }}</div>
              <div><i class="fas fa-calendar mr-2"></i>{{ item.uploadTime }}</div>
            </div>
            <button class="mt-4 w-full bg-accent/20 hover:bg-accent/30 text-accent py-2 rounded-lg transition">
              <i class="fas fa-download mr-2"></i>下载
            </button>
          </div>
        </div>
      </div>

      <!-- 音乐资源列表 -->
      <div v-if="activeType === 'music'" class="space-y-4">
        <div v-for="item in sortedResources" :key="item.id" 
             class="flex items-center p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-all">
          <img :src="item.cover" :alt="item.title" class="w-16 h-16 object-cover rounded">
          <div class="flex-1 ml-4">
            <h3 class="font-bold">{{ item.title }}</h3>
            <div class="text-sm text-gray-400 mt-1">
              <span class="mr-4"><i class="fas fa-music mr-1"></i>{{ item.tracks }}首</span>
              <span class="mr-4"><i class="fas fa-file-audio mr-1"></i>{{ item.format }}</span>
              <span><i class="fas fa-download mr-1"></i>{{ item.downloads }}</span>
            </div>
          </div>
          <button class="ml-4 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition">
            <i class="fas fa-download mr-2"></i>下载
          </button>
        </div>
      </div>

      <!-- 游戏资源列表 -->
      <div v-if="activeType === 'games'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="item in sortedResources" :key="item.id" 
             class="flex bg-accent/5 rounded-lg overflow-hidden hover:bg-accent/10 transition-all">
          <img :src="item.cover" :alt="item.title" class="w-40 h-40 object-cover">
          <div class="flex-1 p-4">
            <h3 class="font-bold mb-2">{{ item.title }}</h3>
            <div class="text-sm text-gray-400 space-y-1">
              <div><i class="fas fa-gamepad mr-2"></i>{{ item.type }}</div>
              <div><i class="fas fa-desktop mr-2"></i>{{ item.platform }}</div>
              <div><i class="fas fa-code-branch mr-2"></i>{{ item.version }}</div>
              <div><i class="fas fa-file mr-2"></i>{{ item.size }}</div>
            </div>
            <button class="mt-4 w-full bg-accent/20 hover:bg-accent/30 text-accent py-2 rounded-lg transition">
              <i class="fas fa-download mr-2"></i>下载
            </button>
          </div>
        </div>
      </div>

      <!-- 软件资源列表 -->
      <div v-if="activeType === 'software'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in sortedResources" :key="item.id" 
             class="gradient-card rounded-lg p-6 hover:bg-accent/5 transition-all">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 rounded bg-accent/20 flex items-center justify-center">
              <i :class="item.icon + ' text-accent text-2xl'"></i>
            </div>
            <div class="ml-4">
              <h3 class="font-bold">{{ item.title }}</h3>
              <div class="text-sm text-gray-400">{{ item.type }}</div>
            </div>
          </div>
          <div class="text-sm text-gray-400 space-y-1">
            <div><i class="fas fa-desktop mr-2"></i>{{ item.platform }}</div>
            <div><i class="fas fa-code-branch mr-2"></i>{{ item.version }}</div>
            <div><i class="fas fa-file mr-2"></i>{{ item.size }}</div>
            <div><i class="fas fa-download mr-2"></i>{{ item.downloads }}次下载</div>
          </div>
          <button class="mt-4 w-full bg-accent/20 hover:bg-accent/30 text-accent py-2 rounded-lg transition">
            <i class="fas fa-download mr-2"></i>下载
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { resourceCategories, resources } from '../mock/resources.js'

const route = useRoute()
const activeType = ref(route.query.type || 'drama')
const sortBy = ref('newest')

const getCurrentTypeName = () => {
  const category = resourceCategories.find(c => c.id === activeType.value)
  return category ? category.name : ''
}

const sortedResources = computed(() => {
  const currentResources = resources[activeType.value] || []
  
  switch (sortBy.value) {
    case 'newest':
      return [...currentResources].sort((a, b) => 
        new Date(b.uploadTime) - new Date(a.uploadTime)
      )
    case 'downloads':
      return [...currentResources].sort((a, b) => b.downloads - a.downloads)
    case 'size':
      return [...currentResources].sort((a, b) => {
        const sizeA = parseFloat(a.size)
        const sizeB = parseFloat(b.size)
        return sizeB - sizeA
      })
    default:
      return currentResources
  }
})
</script>
