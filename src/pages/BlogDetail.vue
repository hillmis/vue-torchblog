<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- 博客正文 -->
    <div class="col-span-1 lg:col-span-9">
      <div class="gradient-card rounded-lg p-6 mb-8">
        <button @click="goBack" class="mb-4 flex items-center text-accent">
          <i class="fas fa-arrow-left mr-2"></i>返回
        </button>
        <template v-if="article">
          <h1 class="text-3xl font-bold mb-4">{{ article.title }}</h1>
          <div class="flex items-center text-sm text-gray-400 mb-6">
            <span class="mr-4">作者：{{ article.author }}</span>
            <span class="mr-4">发布时间：{{ article.createdAt }}</span>
            <span>阅读：{{ article.views }}</span>
          </div>
          <div class="article-content prose prose-invert max-w-none" v-html="renderedContent"></div>
          <div class="text-xs text-gray-400 mt-4 text-right">字数统计：{{ wordCount }} 字</div>
        </template>
        <div v-else class="text-center py-8">
          <i class="fas fa-spinner fa-spin text-2xl text-accent"></i>
        </div>
      </div>
      <!-- 评论区 -->
      <div class="gradient-card rounded-lg p-6 mt-8">
        <h2 class="text-xl font-bold mb-4">评论 ({{ comments.length }})</h2>
        <div v-if="comments.length" class="space-y-4 mb-6">
          <div v-for="c in comments" :key="c.id" class="border-b border-gray-700 pb-3">
            <div class="flex items-center mb-1">
              <span class="font-semibold mr-2">{{ c.user }}</span>
              <span class="text-xs text-gray-400">{{ c.createdAt }}</span>
            </div>
            <div class="text-sm">{{ c.content }}</div>
          </div>
        </div>
        <div v-else class="text-gray-400 mb-6">暂无评论</div>
        <div class="flex flex-col gap-2">
          <textarea v-model="newComment" rows="3" class="search-input rounded p-2" placeholder="写下你的评论..."></textarea>
          <button @click="submitComment" :disabled="!newComment.trim()" class="btn-accent px-4 py-2 rounded self-end">发表评论</button>
        </div>
      </div>
    </div>

    <!-- 右侧推荐文章 -->
    <div class="col-span-1 lg:col-span-3 space-y-6">
      <div class="gradient-card rounded-lg p-6">
        <h3 class="text-lg font-bold mb-4 flex items-center">
          <i class="fas fa-thumbs-up text-accent mr-2"></i>推荐文章
        </h3>
        <div class="space-y-4">
          <div v-for="article in recommendedArticles" 
               :key="article.id" 
               class="group cursor-pointer"
               @click="viewArticle(article.id)">
            <div class="flex items-start space-x-3 p-2 rounded hover:bg-blue-900/30">
              <div class="flex-grow">
                <div class="font-medium text-sm group-hover:text-accent transition-colors">{{ article.title }}</div>
                <div class="text-xs text-gray-400 mt-1 flex items-center">
                  <i class="fas fa-eye mr-1"></i>
                  <span>{{ article.views }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { marked } from 'marked'
import commentsMock from '../mock/comments.js'
import articlesData from '../mock/articles.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const articleId = Number(route.params.id)
const article = ref(null)
const renderedContent = ref('')
const comments = ref([])
const newComment = ref('')

async function loadArticle() {
  const articleData = articlesData.find(a => a.id === articleId)
  if (!articleData) {
    router.push('/404')
    return
  }

  try {
    const response = await fetch(articleData.path)
    const markdown = await response.text()
    
    // 设置文章基本信息
    article.value = articleData
    // 渲染 Markdown 内容
    renderedContent.value = marked(markdown)
  } catch (error) {
    console.error('Failed to load article:', error)
    router.push('/404')
  }
}

onMounted(async () => {
  await loadArticle()
  comments.value = commentsMock.filter(c => c.articleId === articleId)
})

function submitComment() {
  if (!newComment.value.trim()) return
  comments.value.unshift({
    id: Date.now(),
    user: '匿名',
    content: newComment.value,
    createdAt: new Date().toLocaleString('zh-CN')
  })
  newComment.value = ''
}

function goBack() {
  router.back()
}

const wordCount = computed(() => {
  if (!renderedContent.value) return 0
  const div = document.createElement('div')
  div.innerHTML = renderedContent.value
  return div.innerText.replace(/\s+/g, '').length
})

const recommendedArticles = computed(() => {
  return articlesData
    .filter(a => a.id !== articleId)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
})

function viewArticle(id) {
  router.push(`/blog/${id}`)
  window.scrollTo(0, 0)
}
</script>

<style>
.prose {
  @apply text-gray-300;
}

.prose h1, .prose h2, .prose h3, .prose h4 {
  @apply text-gray-100 font-bold;
  margin-top: 1.5em;
  margin-bottom: 0.7em;
}

.prose h1 {
  @apply text-2xl;
}

.prose h2 {
  @apply text-xl;
}

.prose h3 {
  @apply text-lg;
}

.prose p {
  margin: 1em 0;
  line-height: 1.75;
}

.prose code {
  @apply bg-gray-800 px-1 py-0.5 rounded text-sm;
}

.prose pre {
  @apply bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto;
}

.prose pre code {
  @apply bg-transparent p-0;
}

.prose ul, .prose ol {
  @apply pl-6 my-4;
}

.prose ul {
  @apply list-disc;
}

.prose ol {
  @apply list-decimal;
}

.prose a {
  @apply text-accent;
}

.prose blockquote {
  @apply border-l-4 border-accent pl-4 my-4 italic;
}
</style>
