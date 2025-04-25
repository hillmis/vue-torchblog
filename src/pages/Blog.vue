<!--
 * @Author: Wind
 * @Date: 2025-04-24 23:17:54
-->
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold flex items-center">
        <i class="fas fa-blog text-accent mr-3"></i>
        博客文章
      </h1>
      <div class="flex gap-2">
        <select v-model="sortBy" class="bg-gray-700 text-white rounded-lg px-3 py-1 outline-none">
          <option value="newest">最新</option>
          <option value="oldest">最早</option>
          <option value="popular">最热</option>
          <option value="comments">评论最多</option>
        </select>
      </div>
    </div>
    <div class="grid gap-6 md:grid-cols-2">
      <div v-for="post in posts" :key="post.id" class="gradient-card rounded-lg shadow p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
          <p class="text-gray-500 text-sm mb-3">作者：{{ post.author }} | {{ post.createdAt }}</p>
          <p class="text-gray-400 mb-4 line-clamp-3">{{ post.content }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in post.tags" :key="tag" class="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-400">
            <span class="mr-4"><i class="far fa-eye mr-1"></i>{{ post.views }}</span>
            <span><i class="far fa-comment mr-1"></i>{{ post.comments.length }}</span>
          </div>
          <button class="text-accent" @click="viewDetail(post.id)">阅读全文</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import articles from '../mock/articles.js'

const router = useRouter()
const sortBy = ref('newest')

const posts = computed(() => {
  const sortedPosts = [...articles]
  switch (sortBy.value) {
    case 'newest':
      return sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'oldest':
      return sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'popular':
      return sortedPosts.sort((a, b) => b.views - a.views)
    case 'comments':
      return sortedPosts.sort((a, b) => b.comments.length - a.comments.length)
    default:
      return sortedPosts
  }
})

function viewDetail(id) {
  router.push(`/blogs/${id}`)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
