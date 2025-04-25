<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold flex items-center">
        <i class="fas fa-clock text-accent mr-3"></i>
        最新发布
      </h1>
      <div class="flex items-center space-x-4">
        <select v-model="currentType" class="bg-gray-700 text-white rounded-lg px-3 py-1 outline-none text-sm">
          <option value="">全部类型</option>
          <option value="短剧">短剧资源</option>
          <option value="音乐">音乐资源</option>
          <option value="游戏">游戏资源</option>
          <option value="工具">软件工具</option>
        </select>
        <select v-model="timeRange" class="bg-gray-700 text-white rounded-lg px-3 py-1 outline-none text-sm">
          <option value="today">今日发布</option>
          <option value="week">本周发布</option>
          <option value="month">本月发布</option>
        </select>
      </div>
    </div>

    <!-- 资源列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in filteredItems" :key="item.id" 
           class="gradient-card rounded-lg overflow-hidden hover:scale-105 transition-all duration-300">
        <div class="relative">
          <img :src="item.cover || '/images/default-cover.jpg'" :alt="item.name" 
               class="w-full h-48 object-cover"
               @error="handleImageError">
          <span class="absolute top-2 right-2 px-2 py-1 rounded text-xs" 
                :class="getTypeStyle(item.type)">
            {{ item.type }}
          </span>
        </div>
        
        <h3 class="font-semibold mb-2 text-lg">{{ item.name }}</h3>
        <p class="text-sm text-gray-400 mb-4 line-clamp-2">{{ item.description }}</p>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span v-for="tag in item.tags" :key="tag"
                class="px-2 py-1 rounded-full text-xs bg-accent/20 text-accent">
            {{ tag }}
          </span>
        </div>
        
        <div class="flex justify-between items-center text-sm text-gray-400">
          <time :datetime="item.datetime">{{ formatTime(item.datetime) }}</time>
          <div class="flex items-center space-x-4">
            <span><i class="far fa-eye mr-1"></i>{{ item.views }}</span>
            <span><i class="fas fa-download mr-1"></i>{{ item.downloads }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多按钮 -->
    <div class="flex justify-center mt-8" v-if="hasMore">
      <button @click="loadMore" 
              class="px-6 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors flex items-center"
              :disabled="loading">
        <i class="fas fa-spinner mr-2" :class="{'animate-spin': loading}"></i>
        {{ loading ? '加载中...' : '加载更多' }}
      </button>
    </div>

    <!-- 无数据提示 -->
    <div v-if="filteredItems.length === 0" class="text-center py-12 text-gray-400">
      暂无相关数据
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import latestData from '../mock/latest.js'

const currentType = ref('')
const timeRange = ref('today')
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

const items = ref(latestData)

const filteredItems = computed(() => {
  let result = [...items.value]
  
  if (currentType.value) {
    result = result.filter(item => item.type === currentType.value)
  }
  
  const now = new Date()
  const timeLimit = new Date()
  
  switch (timeRange.value) {
    case 'today':
      timeLimit.setHours(0, 0, 0, 0)
      break
    case 'week':
      timeLimit.setDate(timeLimit.getDate() - 7)
      break
    case 'month':
      timeLimit.setMonth(timeLimit.getMonth() - 1)
      break
  }
  
  result = result.filter(item => new Date(item.datetime) >= timeLimit)
  
  return result
})

const formatTime = (datetime) => {
  const date = new Date(datetime)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

const getTypeStyle = (type) => {
  switch (type) {
    case '短剧':
      return 'bg-blue-500/80 text-white'
    case '音乐':
      return 'bg-purple-500/80 text-white'
    case '游戏':
      return 'bg-green-500/80 text-white'
    case '工具':
      return 'bg-yellow-500/80 text-white'
    default:
      return 'bg-gray-500/80 text-white'
  }
}

const handleImageError = (e) => {
  e.target.src = '/images/default-cover.jpg'
}

const loadMore = async () => {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟加载更多数据，复制现有数据并修改id
    const newItems = latestData.map(item => ({
      ...item,
      id: item.id + items.value.length
    }))
    items.value.push(...newItems)
    
    page.value++
    if (page.value >= 3) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gradient-card {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.9));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>