<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-comments text-accent mr-3"></i>
      社区讨论
    </h1>

    <!-- 社区公告 -->
    <div class="gradient-card rounded-lg p-5 mb-8">
      <div class="flex items-center text-accent mb-4">
        <i class="fas fa-bullhorn mr-2"></i>
        <span class="font-bold">社区公告</span>
      </div>
      <div class="space-y-3">
        <div class="flex items-center py-2 px-3 rounded bg-accent/10">
          <i class="fas fa-thumbtack text-accent mr-3"></i>
          <div>
            <div class="font-medium">欢迎加入Torch资源分享社区！</div>
            <div class="text-sm text-gray-400">请遵守社区规则，文明交流</div>
          </div>
          <div class="ml-auto text-sm text-gray-400">置顶</div>
        </div>
        <div class="flex items-center py-2 px-3 rounded bg-accent/10">
          <i class="fas fa-thumbtack text-accent mr-3"></i>
          <div>
            <div class="font-medium">社区每周优质贡献者评选活动进行中</div>
            <div class="text-sm text-gray-400">参与分享赢取VIP会员资格</div>
          </div>
          <div class="ml-auto text-sm text-gray-400">置顶</div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左侧 - 论坛板块 -->
      <div class="lg:col-span-2">
        <div class="gradient-card rounded-lg p-5 mb-8">
          <h2 class="text-xl font-bold mb-4">论坛板块</h2>
          <div class="space-y-4">
            <div v-for="section in forumSections" :key="section.id" 
                 class="border border-accent/30 rounded-lg p-4 transition hover:bg-accent/10 cursor-pointer">
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mr-4">
                  <i :class="'fas fa-' + section.icon" class="text-accent"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold">{{ section.title }}</h3>
                  <p class="text-sm text-gray-400">{{ section.description }}</p>
                </div>
                <div class="text-center">
                  <div class="font-bold">{{ formatNumber(section.topics) }}</div>
                  <div class="text-xs text-gray-400">主题</div>
                </div>
                <div class="text-center ml-6">
                  <div class="font-bold">{{ formatNumber(section.posts) }}</div>
                  <div class="text-xs text-gray-400">帖子</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 热门讨论 -->
        <div class="gradient-card rounded-lg p-5">
          <h2 class="text-xl font-bold mb-4">热门讨论</h2>
          <div class="space-y-4">
            <div v-for="topic in hotTopics" :key="topic.title" class="border-b border-gray-700 pb-4 last:border-0">
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <i class="fas fa-user text-accent"></i>
                </div>
                <div class="flex-1">
                  <div class="flex items-center">
                    <h3 class="font-bold">{{ topic.username }}</h3>
                    <span class="text-xs text-gray-400 ml-2">{{ topic.time }}</span>
                  </div>
                  <p class="mt-1 mb-2">{{ topic.title }}</p>
                  <div class="flex items-center text-sm text-gray-400">
                    <div class="flex items-center mr-4">
                      <i class="far fa-comment mr-1"></i>
                      <span>{{ topic.replies }}</span>
                    </div>
                    <div class="flex items-center mr-4">
                      <i class="far fa-eye mr-1"></i>
                      <span>{{ topic.views }}</span>
                    </div>
                    <div class="flex items-center">
                      <i class="far fa-thumbs-up mr-1"></i>
                      <span>{{ topic.likes }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-6">
            <button class="px-4 py-2 bg-accent/20 rounded-lg text-accent hover:bg-accent/30 transition">
              查看更多讨论
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧 - 社区信息 -->
      <div>
        <!-- 社区数据 -->
        <div class="gradient-card rounded-lg p-5 mb-6">
          <h3 class="font-bold mb-4">社区数据</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 rounded bg-accent/10">
              <div class="font-bold text-xl">{{ formatNumber(communityStats.members) }}</div>
              <div class="text-sm text-gray-400">社区成员</div>
            </div>
            <div class="text-center p-3 rounded bg-accent/10">
              <div class="font-bold text-xl">{{ formatNumber(communityStats.totalTopics) }}</div>
              <div class="text-sm text-gray-400">主题总数</div>
            </div>
            <div class="text-center p-3 rounded bg-accent/10">
              <div class="font-bold text-xl">{{ formatNumber(communityStats.totalPosts) }}</div>
              <div class="text-sm text-gray-400">帖子总数</div>
            </div>
            <div class="text-center p-3 rounded bg-accent/10">
              <div class="font-bold text-xl">{{ formatNumber(communityStats.todayPosts) }}</div>
              <div class="text-sm text-gray-400">今日发帖</div>
            </div>
          </div>
        </div>

        <!-- 活跃用户 -->
        <div class="gradient-card rounded-lg p-5 mb-6">
          <h3 class="font-bold mb-4">活跃用户</h3>
          <div class="space-y-4">
            <div v-for="user in activeUsers" :key="user.username" class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                <i class="fas fa-user text-accent"></i>
              </div>
              <div class="flex-1">
                <div class="font-medium">{{ user.username }}</div>
                <div class="text-xs text-gray-400">{{ user.posts }}帖子 · {{ user.likes }}获赞</div>
              </div>
              <div class="text-accent text-sm font-medium">Lv.{{ user.level }}</div>
            </div>
          </div>
        </div>

        <!-- 社区规则 -->
        <div class="gradient-card rounded-lg p-5">
          <h3 class="font-bold mb-4">社区规则</h3>
          <div class="text-sm space-y-2">
            <p class="flex items-center">
              <i class="fas fa-check-circle text-accent mr-2"></i>
              <span>禁止发布任何违法违规内容</span>
            </p>
            <p class="flex items-center">
              <i class="fas fa-check-circle text-accent mr-2"></i>
              <span>尊重原创，转载请注明出处</span>
            </p>
            <p class="flex items-center">
              <i class="fas fa-check-circle text-accent mr-2"></i>
              <span>友善交流，禁止人身攻击</span>
            </p>
            <p class="flex items-center">
              <i class="fas fa-check-circle text-accent mr-2"></i>
              <span>合理发帖，禁止刷屏灌水</span>
            </p>
            <p class="flex items-center">
              <i class="fas fa-check-circle text-accent mr-2"></i>
              <span>虚假资源或广告将被删除</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { hotTopics, activeUsers, forumSections, communityStats } from '../mock/community.js'

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}
</script>
