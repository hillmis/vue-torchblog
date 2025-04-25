<template>
  <div class="min-h-[calc(100vh-theme(spacing.header))] flex items-center justify-center">
    <div class="w-full max-w-md mx-4">
      <div class="gradient-card rounded-lg p-8">
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <i class="fas fa-fire text-4xl text-accent"></i>
          </div>
          <h2 class="text-2xl font-bold">欢迎来到 Torch</h2>
          <p class="text-gray-400 mt-2">登录后享受更多精彩内容</p>
        </div>

        <!-- 登录提示消息 -->
        <div v-if="route.query.message" class="mb-4 p-3 bg-accent/10 text-accent rounded-lg">
          {{ route.query.message }}
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">ID</label>
            <input v-model="formData.username" type="text"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
              :class="{ 'border-red-500': errors.username }" placeholder="请输入用户名">
            <p v-if="errors.username" class="mt-1 text-sm text-red-500">{{ errors.username }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">密码</label>
            <input v-model="formData.password" type="password"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
              :class="{ 'border-red-500': errors.password }" placeholder="请输入密码">
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center cursor-pointer group">
              <div class="relative">
                <input type="checkbox" v-model="formData.remember" class="sr-only peer">
                <div
                  class="w-5 h-5 rounded border border-gray-600 bg-gray-800 flex items-center justify-center peer-checked:bg-accent peer-checked:border-accent transition-colors">
                  <i
                    class="fas fa-check text-xs text-white transform scale-0 peer-checked:scale-100 transition-transform"></i>
                </div>
              </div>
              <span class="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors">记住我</span>
            </label>
            <a href="#" class="text-sm text-accent hover:text-accent/80 hover:underline transition-colors">忘记密码？</a>
          </div>

          <div class="space-y-4">
            <button type="submit"
              class="w-full py-2 px-4 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
              :disabled="isLoading">
              <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
            <button type="button"
              class="w-full py-2 px-4 border border-accent text-accent hover:bg-accent/10 rounded-lg transition-colors"
              @click="switchToRegister">
              注册新账号
            </button>
          </div>
        </form>

        <!-- 社交登录 -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2  text-gray-400">其他登录方式</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-3 gap-3">
            <button
              class="flex justify-center items-center py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
              <i class="fab fa-github"></i>
            </button>
            <button
              class="flex justify-center items-center py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
              <i class="fab fa-weixin text-green-500"></i>
            </button>
            <button
              class="flex justify-center items-center py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
              <i class="fab fa-qq text-blue-500"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import usersData from '../mock/users.js'

const router = useRouter()
const route = useRoute()
const userStore = inject('userStore') // Inject the userStore

const isLoading = ref(false)
const formData = reactive({
  username: '',
  password: '',
  remember: false
})
const errors = reactive({
  username: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  errors.username = ''
  errors.password = ''

  if (!formData.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (formData.username.length < 3) {
    errors.username = '用户名至少需要3个字符'
    isValid = false
  }

  if (!formData.password.trim()) {
    errors.password = '请输入密码'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = '密码至少需要6个字符'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 验证用户
    const user = usersData.find(u =>
      u.username === formData.username &&
      u.password === formData.password
    )

    if (user) {
      // 保存完整的用户信息
      const userInfo = {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
        email: user.email,
        bio: user.bio,
        stats: user.stats,
        preferences: user.preferences,
        vipLevel: user.vipLevel,
        vipExpireDate: user.vipExpireDate,
        loginTime: new Date().toISOString()
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))

      // 如果记住我，保存登录状态
      if (formData.remember) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }

      // 更新userStore并触发登录事件
      if (userStore) {
        userStore.login(userInfo)
      } else {
        // 如果不能通过userStore，则直接触发事件
        window.dispatchEvent(new CustomEvent('userLogin', {
          detail: userInfo
        }))
      }

      // 重定向到之前的页面或首页
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    } else {
      errors.password = '用户名或密码错误'
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    isLoading.value = false
  }
}

const switchToRegister = () => {
  router.push('/register')
}
</script>