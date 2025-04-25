<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-info-circle text-accent mr-3"></i>
      关于我们
    </h1>

    <!-- 网站介绍 -->
    <div class="gradient-card rounded-lg p-6 mb-8">
      <h2 class="text-xl font-bold mb-4">网站介绍</h2>
      <p class="text-gray-300 mb-4">{{ siteInfo.description }}</p>
      <p class="text-gray-300 mb-4">{{ siteInfo.history }}</p>
      <div class="flex flex-wrap gap-4 mt-6">
        <div v-for="stat in siteInfo.stats" :key="stat.label" class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mr-3">
            <i :class="stat.icon + ' text-accent'"></i>
          </div>
          <div>
            <div class="font-bold text-xl">{{ stat.value }}</div>
            <div class="text-sm text-gray-400">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 团队介绍 -->
    <div class="gradient-card rounded-lg p-6 mb-8">
      <h2 class="text-xl font-bold mb-4">团队介绍</h2>
      <p class="text-gray-300 mb-6">
        我们拥有一支专业、充满激情的团队，成员来自互联网、内容创作、技术开发等不同领域，共同致力于为用户提供最优质的资源和服务。
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="member in teamMembers" :key="member.name" class="text-center">
          <div class="w-24 h-24 rounded-full bg-accent/20 mx-auto mb-4 flex items-center justify-center">
            <i :class="member.icon + ' text-2xl text-accent'"></i>
          </div>
          <h3 class="font-bold mb-1">{{ member.name }}</h3>
          <p class="text-accent mb-2">{{ member.title }}</p>
          <p class="text-sm text-gray-400">{{ member.description }}</p>
        </div>
      </div>
    </div>

    <!-- 联系我们 -->
    <div class="gradient-card rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4">联系我们</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-gray-300 mb-4">{{ contactInfo.description }}</p>
          <div class="space-y-4">
            <div v-for="contact in contactInfo.contacts" :key="contact.label" class="flex items-center">
              <div class="w-10 h-10 rounded bg-accent/20 flex items-center justify-center mr-3">
                <i :class="contact.icon + ' text-accent'"></i>
              </div>
              <div>
                <div class="text-sm text-gray-400">{{ contact.label }}</div>
                <div>{{ contact.value }}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="gradient-card bg-accent/5 rounded-lg p-4 h-full text-center ">
            <h3 class="font-bold mb-3 center ">关注我们</h3>
            <div class="flex space-x-4 mb-6 justify-center">
              <a v-for="social in contactInfo.socialMedia" 
                 :key="social.icon" 
                 :href="social.link" 
                 class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <i :class="social.icon + ' text-accent'"></i>
              </a>
            </div>
            <div class="text-center">
             
              <div class="w-32 h-32 bg-white p-2 mx-auto">
                <div class="w-full h-full bg-accent/20 flex items-center justify-center">
                  <i class="fas fa-qrcode text-3xl text-accent"></i>
                </div>
              </div>
              <p class="text-sm text-gray-400 mt-2">扫码关注微信公众号</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { siteInfo, teamMembers, contactInfo } from '../mock/about.js'
</script>
