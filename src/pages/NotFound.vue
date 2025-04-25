<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <div class="text-6xl font-bold text-accent mb-4">404</div>
      <h1 class="text-2xl font-bold mb-4">页面未找到</h1>
      <p class="text-gray-400 mb-8">抱歉，您访问的页面不存在或已被移除</p>
      <router-link to="/" class="btn-accent px-6 py-2 rounded-lg inline-flex items-center">
        <i class="fas fa-home mr-2"></i>
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>