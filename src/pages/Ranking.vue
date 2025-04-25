<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-trophy text-accent mr-3"></i>
      排行榜
    </h1>

    <!-- 分类选项 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="(tab, index) in tabs" 
          :key="index"
          @click="activeTab = tab.value"
          :class="[

            'px-4 py-2 rounded-lg',
            activeTab === tab.value 
              ? 'bg-accent text-white' 
              : 'bg-accent/20 text-accent hover:bg-accent/30'
          ]"
        >
          <i :class="tab.icon + ' mr-2'"></i>
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- 时间筛选 -->
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-xl font-bold">{{ getCurrentTabName() }}</h2>
      <div class="flex gap-2">
        <button 
          v-for="(period, index) in timePeriods" 
          :key="index"
          @click="activeTimePeriod = period.value"
          :class="[

            'px-3 py-1 rounded text-sm',
            activeTimePeriod === period.value 
              ? 'bg-accent/30 text-accent font-medium' 
              : 'text-gray-400 hover:text-accent'
          ]"
        >
          {{ period.name }}
        </button>
      </div>
    </div>

    <!-- 排行榜内容 -->
    <div class="gradient-card rounded-lg p-6">
      <!-- 短剧排行榜 -->
      <div v-if="activeTab === 'drama'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(item, index) in getRankingData()" :key="index" class="relative">
            <div class="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" :class="getRankBgClass(index)">
              {{ index + 1 }}
            </div>
            <div class="overflow-hidden rounded-lg">
              <img :src="item.cover" :alt="item.title" class="w-full aspect-[3/4] object-cover transition hover:scale-105">
            </div>
            <div class="mt-3">
              <h3 class="font-bold mb-1">{{ item.title }}</h3>
              <div class="flex items-center text-sm text-gray-400">
                <span class="flex items-center">
                  <i class="fas fa-eye mr-1"></i>
                  {{ item.views }}
                </span>
                <span class="mx-2">·</span>
                <span>{{ item.category }}</span>
              </div>
              <div class="mt-2 flex items-center">
                <div class="flex-1 bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-accent" :style="{width: item.rating * 10 + '%'}"></div>
                </div>
                <span class="ml-2 text-accent font-medium">{{ item.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 音乐排行榜 -->
      <div v-if="activeTab === 'music'">
        <div class="space-y-4">
          <div 
            v-for="(item, index) in getRankingData()" 
            :key="index" 
            class="flex items-center p-4 rounded-lg transition hover:bg-accent/10"
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4" :class="getRankBgClass(index)">
              {{ index + 1 }}
            </div>
            <div class="w-14 h-14 rounded overflow-hidden flex-shrink-0 mr-4">
              <img :src="item.cover" :alt="item.title" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
              <h3 class="font-bold">{{ item.title }}</h3>
              <div class="text-sm text-gray-400">{{ item.artist }}</div>
            </div>
            <div class="flex items-center text-sm text-gray-400 mr-6">
              <i class="fas fa-play mr-1"></i>
              <span>{{ item.plays }}</span>
            </div>
            <div class="w-24 text-center">
              <div class="flex items-center justify-center">
                <i class="fas fa-star text-accent mr-1"></i>
                <span>{{ item.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏排行榜 -->
      <div v-if="activeTab === 'games'">
        <div class="space-y-4">
          <div 
            v-for="(item, index) in getRankingData()" 
            :key="index" 
            class="grid grid-cols-12 gap-4 items-center p-4 rounded-lg transition hover:bg-accent/10"
          >
            <div class="col-span-1">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" :class="getRankBgClass(index)">
                {{ index + 1 }}
              </div>
            </div>
            <div class="col-span-2">
              <div class="w-full aspect-square rounded overflow-hidden">
                <img :src="item.cover" :alt="item.title" class="w-full h-full object-cover">
              </div>
            </div>
            <div class="col-span-5">
              <h3 class="font-bold">{{ item.title }}</h3>
              <div class="flex items-center text-sm text-gray-400">
                <span>{{ item.category }}</span>
                <span class="mx-2">·</span>
                <span>{{ item.developer }}</span>
              </div>
            </div>
            <div class="col-span-2 text-center">
              <div class="text-sm text-gray-400">下载量</div>
              <div>{{ item.downloads }}</div>
            </div>
            <div class="col-span-2 text-center">
              <div class="flex items-center justify-center">
                <i class="fas fa-star text-accent mr-1"></i>
                <span>{{ item.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 软件工具排行榜 -->
      <div v-if="activeTab === 'software'">
        <div class="space-y-4">
          <div 
            v-for="(item, index) in getRankingData()" 
            :key="index" 
            class="flex items-center p-4 rounded-lg transition hover:bg-accent/10"
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4" :class="getRankBgClass(index)">
              {{ index + 1 }}
            </div>
            <div class="w-12 h-12 rounded bg-accent/20 flex items-center justify-center mr-4">
              <i :class="item.icon + ' text-accent text-xl'"></i>
            </div>
            <div class="flex-1">
              <h3 class="font-bold">{{ item.title }}</h3>
              <div class="text-sm text-gray-400">{{ item.category }}</div>
            </div>
            <div class="flex items-center text-sm text-gray-400 mr-6">
              <i class="fas fa-download mr-1"></i>
              <span>{{ item.downloads }}</span>
            </div>
            <div class="w-24 text-center">
              <div class="flex items-center justify-center">
                <i class="fas fa-star text-accent mr-1"></i>
                <span>{{ item.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  tabs, 
  timePeriods, 
  dramaRanking, 
  musicRanking, 
  gamesRanking, 
  softwareRanking 
} from '../mock/ranking.js'

const activeTab = ref('drama')
const activeTimePeriod = ref('week')

const getCurrentTabName = () => {
  const currentTab = tabs.find(tab => tab.value === activeTab.value)
  return currentTab ? currentTab.name : ''
}

const getRankingData = () => {
  switch (activeTab.value) {
    case 'drama':
      return dramaRanking
    case 'music':
      return musicRanking
    case 'games':
      return gamesRanking
    case 'software':
      return softwareRanking
    default:
      return []
  }
}

const getRankBgClass = (index) => {
  if (index === 0) return 'bg-yellow-500'
  if (index === 1) return 'bg-gray-400'
  if (index === 2) return 'bg-amber-600'
  return 'bg-gray-700'
}
</script>
