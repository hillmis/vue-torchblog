<!--
 * @Author: Wind
 * @Date: 2025-04-24 23:17:55
-->
<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6 flex items-center">
            <i class="fas fa-calendar-day text-accent mr-3"></i>
            每日推荐
        </h1>
        <div class="gradient-card rounded-lg shadow p-6 mb-8">
            <h2 class="text-lg font-semibold mb-4 flex items-center justify-between">
                <span>今日推荐</span>
                <span class="text-sm text-gray-400">{{ dailyRecommends.date }}</span>
            </h2>
            <div class="space-y-4">
                <div v-for="item in dailyRecommends.items" :key="item.type" 
                     class="flex items-start">
                    <span class="font-semibold w-16">{{ item.type }}：</span>
                    <div class="flex-1">
                        <a :href="item.url" target="_blank" class="text-accent hover:underline">
                            {{ item.title }}
                        </a>
                        <p class="text-sm text-gray-400 mt-1">{{ item.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="gradient-card rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-2">我的反馈</h2>
            <textarea v-model="feedback" rows="3" 
                      class="w-full border rounded p-2 mb-2 bg-gray-900 text-gray-100" 
                      placeholder="写下你对今日推荐的看法或收获..."></textarea>
            <button class="bg-accent/80 text-white px-4 py-1 rounded hover:bg-accent transition" 
                    @click="saveFeedback">提交</button>
            <p v-if="saved" class="text-accent mt-2">已提交！</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { dailyRecommends } from '../mock/daily.js'

const feedback = ref('')
const saved = ref(false)

function saveFeedback() {
    if (!feedback.value.trim()) return
    saved.value = true
    feedback.value = ''
    setTimeout(() => saved.value = false, 1500)
}
</script>

<style scoped>
</style>
