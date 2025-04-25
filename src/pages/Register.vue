<template>
  <div class="min-h-[calc(100vh-theme(spacing.header))] flex items-center justify-center">
    <div class="w-full max-w-md mx-4">
      <div class="gradient-card rounded-lg p-8">
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <i class="fas fa-fire text-4xl text-accent"></i>
          </div>
          <h2 class="text-2xl font-bold">注册账号</h2>
          <p class="text-gray-400 mt-2">创建您的 Torch 账号</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">ID</label>
            <input
              v-model="formData.username"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
              :class="{ 'border-red-500': errors.username }"
              placeholder="请输入ID"
            >
            <p v-if="errors.username" class="mt-1 text-sm text-red-500">{{ errors.username }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">昵称</label>
            <input
              v-model="formData.nickname"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
              :class="{ 'border-red-500': errors.nickname }"
              placeholder="请输入昵称"
            >
            <p v-if="errors.nickname" class="mt-1 text-sm text-red-500">{{ errors.nickname }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">密码</label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
              :class="{ 'border-red-500': errors.password }"
              placeholder="请输入密码"
            >
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">确认密码</label>
            <input
              v-model="formData.confirmPassword"
              type="password"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
              :class="{ 'border-red-500': errors.confirmPassword }"
              placeholder="请再次输入密码"
            >
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">{{ errors.confirmPassword }}</p>
          </div>

          <div class="flex items-center">
            <input 
              type="checkbox" 
              v-model="formData.agreeTerms"
              class="rounded text-accent"
              :class="{ 'border-red-500': errors.agreeTerms }"
            >
            <span class="ml-2 text-sm">我已阅读并同意<a href="#" class="text-accent hover:underline">用户协议</a>和<a href="#" class="text-accent hover:underline">隐私政策</a></span>
          </div>
          <p v-if="errors.agreeTerms" class="mt-1 text-sm text-red-500">{{ errors.agreeTerms }}</p>

          <div class="space-y-4">
            <button
              type="submit"
              class="w-full py-2 px-4 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
              :disabled="isLoading"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ isLoading ? '注册中...' : '注册' }}
            </button>
            <button
              type="button"
              class="w-full py-2 px-4 border border-accent text-accent hover:bg-accent/10 rounded-lg transition-colors"
              @click="router.push('/login')"
            >
              已有账号？去登录
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import usersData from '../mock/users.js'

const router = useRouter()
const isLoading = ref(false)
const formData = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})
const errors = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

const validateForm = () => {
  let isValid = true
  errors.username = ''
  errors.nickname = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.agreeTerms = ''

  if (!formData.username) {
    errors.username = '请输入ID'
    isValid = false
  } else if (formData.username.length < 3) {
    errors.username = 'ID至少需要3个字符'
    isValid = false
  } else if (usersData.some(u => u.username === formData.username)) {
    errors.username = 'ID已被使用'
    isValid = false
  }

  if (!formData.nickname) {
    errors.nickname = '请输入昵称'
    isValid = false
  }

  if (!formData.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = '密码至少需要6个字符'
    isValid = false
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    isValid = false
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  if (!formData.agreeTerms) {
    errors.agreeTerms = '请阅读并同意用户协议和隐私政策'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    // 模拟注册请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 创建新用户
    const newUser = {
      id: usersData.length + 1,
      username: formData.username,
      password: formData.password,
      nickname: formData.nickname,
      avatar: '',
      role: 'user'
    }
    
    // 模拟保存用户
    usersData.push(newUser)

    // 自动登录
    const userInfo = {
      id: newUser.id,
      username: newUser.username,
      nickname: newUser.nickname,
      avatar: newUser.avatar,
      role: newUser.role
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo))

    // 注册成功后跳转到首页
    router.push('/')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script>