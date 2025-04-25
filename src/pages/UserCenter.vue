<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-user-circle text-accent mr-3"></i>
      个人中心
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧个人信息 -->
      <div class="lg:col-span-1 space-y-6">
        <!-- 基本信息卡片 -->
        <div class="gradient-card rounded-lg p-6">
          <div class="text-center mb-6">
            <div class="relative w-24 h-24 mx-auto mb-4">
              <img :src="userInfo.avatar || '/avatars/default.jpg'" :alt="userInfo.nickname"
                class="w-full h-full rounded-full object-cover bg-gray-700">
              <input type="file" ref="avatarInput" accept="image/*" class="hidden" @change="handleAvatarChange">
              <button @click="$refs.avatarInput.click()"
                class="absolute bottom-0 right-0 bg-accent rounded-full p-2 text-white text-xs hover:bg-accent/90 transition-colors">
                <i class="fas fa-camera"></i>
              </button>
            </div>
            <h2 class="text-xl font-bold mb-1">{{ userInfo.nickname }}</h2>
            <div v-if="bioArray.length > 0" class="text-center mt-2">
              <span v-for="(bioText, index) in bioArray" :key="index" class="bio-badge mb-2 mx-1 inline-block">
                {{ bioText }}
              </span>
            </div>
            <p v-else class="text-gray-400 text-sm">这个人很懒，什么都没写~</p>
          </div>

          <div class="border-t border-gray-700 pt-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-2 rounded bg-accent/10">
                <div class="font-bold text-accent">{{ userInfo.stats.downloads }}</div>
                <div class="text-sm text-gray-400">下载数</div>
              </div>
              <div class="text-center p-2 rounded bg-accent/10">
                <div class="font-bold text-accent">{{ userInfo.stats.posts }}</div>
                <div class="text-sm text-gray-400">发帖数</div>
              </div>
              <div class="text-center p-2 rounded bg-accent/10">
                <div class="font-bold text-accent">{{ userInfo.stats.comments }}</div>
                <div class="text-sm text-gray-400">评论数</div>
              </div>
              <div class="text-center p-2 rounded bg-accent/10">
                <div class="font-bold text-accent">{{ userInfo.stats.likes }}</div>
                <div class="text-sm text-gray-400">获赞数</div>
              </div>
            </div>
          </div>
        </div>

        <!-- VIP信息卡片 -->
        <div class="gradient-card rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold">会员状态</h3>
            <span :class="['px-2 py-1 rounded text-xs',
              userInfo.vipLevel > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-500/20 text-gray-500']">
              {{ userInfo.vipLevel > 0 ? 'VIP' + userInfo.vipLevel : '普通用户' }}
            </span>
          </div>
          <div v-if="userInfo.vipLevel > 0" class="space-y-2">
            <p class="text-sm text-gray-400">
              到期时间：{{ formatDate(userInfo.vipExpireDate) }}
            </p>
            <button
              class="w-full py-2 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors">
              续费会员
            </button>
          </div>
          <div v-else>
            <button
              class="w-full py-2 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors">
              开通会员
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="lg:col-span-2">
        <!-- 选项卡导航 -->
        <div class="flex space-x-4 mb-6">
          <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" :class="[
            'px-4 py-2 rounded-lg transition-colors',
            activeTab === tab.value
              ? 'bg-accent text-white'
              : 'bg-accent/20 text-accent hover:bg-accent/30'
          ]">
            <i :class="['fas', tab.icon, 'mr-2']"></i>{{ tab.name }}
          </button>
        </div>

        <!-- 基本设置 -->
        <div v-if="activeTab === 'settings'" class="gradient-card rounded-lg p-6">
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-2">ID</label>
              <input v-model="form.username" type="text"
                class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
                disabled>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">昵称</label>
              <input v-model="form.nickname" type="text"
                class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent">
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">邮箱</label>
              <input v-model="form.email" type="email"
                class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent">
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">个人简介</label>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2 p-2 rounded-lg bg-gray-800 border border-gray-700 mb-2 min-h-16">
                  <div v-for="(tag, index) in bioTags" :key="index" class="bio-badge flex items-center gap-1 group">
                    <span>{{ tag }}</span>
                    <button type="button" @click="removeTag(index)" class="w-4 h-4 rounded-full flex items-center justify-center text-xs opacity-70 
                      group-hover:opacity-100 hover:bg-blue-500/30">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div class="flex">
                  <input v-model="newTag" type="text" placeholder="添加个人标签..."
                    class="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
                    @keydown.enter.prevent="addTag">
                  <button type="button" @click="addTag"
                    class="ml-2 px-4 bg-accent/80 hover:bg-accent text-white rounded-lg transition-colors">
                    添加
                  </button>
                </div>
                <p class="text-xs text-gray-400">输入个人标签并按回车或点击添加按钮</p>
              </div>
            </div>

            <div>
              <h4 class="font-medium mb-3">通知设置</h4>
              <div class="space-y-3">
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input type="checkbox" v-model="form.preferences.emailNotifications" class="sr-only peer">
                    <div
                      class="w-5 h-5 rounded border border-gray-600 bg-gray-800 flex items-center justify-center peer-checked:bg-accent peer-checked:border-accent transition-colors">
                      <i
                        class="fas fa-check text-xs text-white transform scale-0 peer-checked:scale-100 transition-transform"></i>
                    </div>
                  </div>
                  <span class="ml-2 text-gray-300 group-hover:text-white transition-colors">接收邮件通知</span>
                </label>
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input type="checkbox" v-model="form.preferences.newsletter" class="sr-only peer">
                    <div
                      class="w-5 h-5 rounded border border-gray-600 bg-gray-800 flex items-center justify-center peer-checked:bg-accent peer-checked:border-accent transition-colors">
                      <i
                        class="fas fa-check text-xs text-white transform scale-0 peer-checked:scale-100 transition-transform"></i>
                    </div>
                  </div>
                  <span class="ml-2 text-gray-300 group-hover:text-white transition-colors">订阅站点周报</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end">
              <button type="submit"
                class="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
                :disabled="isLoading">
                <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
                {{ isLoading ? '保存中...' : '保存修改' }}
              </button>
            </div>
          </form>
        </div>

        <!-- 下载记录 -->
        <div v-if="activeTab === 'downloads'" class="gradient-card rounded-lg p-6">
          <div class="space-y-4">
            <div v-for="item in downloadHistory" :key="item.id"
              class="flex items-center p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-all">
              <img :src="item.cover" :alt="item.title" class="w-16 h-16 rounded object-cover">
              <div class="ml-4 flex-1">
                <h4 class="font-medium">{{ item.title }}</h4>
                <div class="text-sm text-gray-400 mt-1">
                  <span>{{ item.type }}</span>
                  <span class="mx-2">·</span>
                  <span>{{ item.size }}</span>
                  <span class="mx-2">·</span>
                  <span>{{ formatDate(item.downloadDate) }}</span>
                </div>
              </div>
              <button class="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors">
                重新下载
              </button>
            </div>
          </div>
        </div>

        <!-- 我的帖子 -->
        <div v-if="activeTab === 'posts'" class="gradient-card rounded-lg p-6">
          <div class="space-y-4">
            <div v-for="post in userPosts" :key="post.id"
              class="p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-all">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium">{{ post.title }}</h4>
                <span class="text-xs text-gray-400">{{ formatDate(post.createdAt) }}</span>
              </div>
              <p class="text-sm text-gray-400 mb-3">{{ post.content }}</p>
              <div class="flex items-center text-sm text-gray-400">
                <span class="mr-4"><i class="far fa-comment mr-1"></i>{{ post.comments }}</span>
                <span class="mr-4"><i class="far fa-eye mr-1"></i>{{ post.views }}</span>
                <span><i class="far fa-thumbs-up mr-1"></i>{{ post.likes }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 安全设置 -->
        <div v-if="activeTab === 'security'" class="gradient-card rounded-lg p-6">
          <form @submit.prevent="updatePassword" class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-2">当前密码</label>
              <input v-model="passwordForm.currentPassword" type="password"
                class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent">
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">新密码</label>
              <input v-model="passwordForm.newPassword" type="password"
                class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent">
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">确认新密码</label>
              <input v-model="passwordForm.confirmPassword" type="password"
                class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent">
            </div>

            <div class="flex justify-end">
              <button type="submit"
                class="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
                :disabled="isLoading">
                修改密码
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const activeTab = ref('settings')
const userStore = inject('userStore') // 注入 userStore
const newTag = ref('')
const bioTags = ref([])

// 计算属性：处理bio数据为数组形式
const bioArray = computed(() => {
  if (!userInfo.bio) return [];
  return Array.isArray(userInfo.bio) ? userInfo.bio : [userInfo.bio];
})

// 添加标签
const addTag = () => {
  if (newTag.value.trim()) {
    // 避免重复添加
    if (!bioTags.value.includes(newTag.value.trim())) {
      bioTags.value.push(newTag.value.trim())
      newTag.value = ''
    }
  }
}

// 移除标签
const removeTag = (index) => {
  bioTags.value.splice(index, 1)
}

// 选项卡配置
const tabs = [
  { name: '', value: 'settings', icon: 'fa-cog' },
  { name: '', value: 'downloads', icon: 'fa-download' },
  { name: '', value: 'posts', icon: 'fa-file-alt' },
  { name: '', value: 'security', icon: 'fa-shield-alt' }
]

// 用户信息
const userInfo = reactive({
  id: 0,
  username: '',
  nickname: '',
  avatar: '',
  bio: '',
  email: '',
  role: '',
  joinDate: '',
  stats: {
    posts: 0,
    comments: 0,
    likes: 0,
    downloads: 0
  },
  preferences: {
    emailNotifications: false,
    newsletter: false
  },
  vipLevel: 0,
  vipExpireDate: ''
})

// 表单数据
const form = reactive({
  username: '',
  nickname: '',
  email: '',
  bio: '',
  preferences: {
    emailNotifications: false,
    newsletter: false
  }
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 模拟数据
const downloadHistory = ref([
  {
    id: 1,
    title: '示例资源1',
    type: '短剧',
    size: '1.5GB',
    cover: 'https://picsum.photos/64/64',
    downloadDate: '2025-04-24'
  },
  {
    id: 2,
    title: '示例资源2',
    type: '音乐',
    size: '320MB',
    cover: 'https://picsum.photos/64/64',
    downloadDate: '2025-04-23'
  }
])

const userPosts = ref([
  {
    id: 1,
    title: '分享一个不错的资源',
    content: '这是一个非常好用的资源，推荐大家下载使用...',
    createdAt: '2025-04-24',
    comments: 12,
    views: 234,
    likes: 45
  },
  {
    id: 2,
    title: '关于最新更新的反馈',
    content: '最新版本增加了很多新功能，体验很好...',
    createdAt: '2025-04-23',
    comments: 8,
    views: 156,
    likes: 23
  }
])

// 加载用户信息
const loadUserInfo = () => {
  // 首先尝试从userStore获取数据
  if (userStore && userStore.state.isLoggedIn && userStore.state.user) {
    const user = userStore.state.user
    Object.assign(userInfo, user)

    // 处理bio数据
    if (user.bio) {
      bioTags.value = Array.isArray(user.bio) ? [...user.bio] : [user.bio]
    }

    Object.assign(form, {
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      preferences: { ...user.preferences }
    })
    return true
  }

  // 如果userStore中没有数据，尝试从localStorage获取
  const stored = localStorage.getItem('userInfo')
  if (!stored) {
    router.push({
      path: '/login',
      query: { redirect: '/user', message: '请先登录' }
    })
    return false
  }

  try {
    const user = JSON.parse(stored)
    Object.assign(userInfo, user)

    // 处理bio数据
    if (user.bio) {
      bioTags.value = Array.isArray(user.bio) ? [...user.bio] : [user.bio]
    }

    Object.assign(form, {
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      preferences: { ...user.preferences }
    })
    return true
  } catch (error) {
    console.error('解析用户数据失败:', error)
    router.push('/login')
    return false
  }
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 更新个人资料
const updateProfile = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟更新用户资料
    Object.assign(userInfo, {
      nickname: form.nickname,
      email: form.email,
      bio: bioTags.value.length > 0 ? [...bioTags.value] : [],
      preferences: { ...form.preferences }
    })

    // 更新本地存储
    const storedUser = JSON.parse(localStorage.getItem('userInfo'))
    if (storedUser) {
      Object.assign(storedUser, {
        nickname: form.nickname,
        email: form.email,
        bio: bioTags.value.length > 0 ? [...bioTags.value] : [],
        preferences: { ...form.preferences }
      })
      localStorage.setItem('userInfo', JSON.stringify(storedUser))
    }

    // 提示成功
    alert('个人资料已更新')
  } catch (error) {
    console.error('更新失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 更新密码
const updatePassword = async () => {
  // 简单验证
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    alert('请填写所有密码字段')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('新密码与确认密码不一致')
    return
  }

  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟更新密码
    alert('密码已更新')

    // 重置表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    console.error('更新密码失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 处理头像更改
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 模拟上传和更新头像
  const reader = new FileReader()
  reader.onload = (e) => {
    userInfo.avatar = e.target.result

    // 更新本地存储
    const storedUser = JSON.parse(localStorage.getItem('userInfo'))
    if (storedUser) {
      storedUser.avatar = e.target.result
      localStorage.setItem('userInfo', JSON.stringify(storedUser))
    }
  }
  reader.readAsDataURL(file)
}

// 组件挂载时加载用户信息
onMounted(() => {
  const success = loadUserInfo()

  // 如果成功加载了用户信息但bioTags还是空的，尝试从userInfo.bio初始化
  if (success && bioTags.value.length === 0 && userInfo.bio) {
    bioTags.value = Array.isArray(userInfo.bio) ? [...userInfo.bio] : [userInfo.bio]
  }
})
</script>

<style scoped>
.bio-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border-radius: 12px;
  font-size: 0.75rem;
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.bio-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}
</style>