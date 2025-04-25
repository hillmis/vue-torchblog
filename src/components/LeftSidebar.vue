<!-- LeftSidebar.vue -->
<template>
  <div class="space-y-4">
    <!-- 动态显示内容 -->
    <div v-if="isDetailPage">
      <ArticleOutline :outline="outline" :active-id="activeId" @scroll-to="scrollTo" />
    </div>

    <!-- 默认左侧边栏内容 -->
    <div v-else>
      <!-- 用户信息卡片 -->
      <div class="gradient-card rounded-lg p-4 hover-glow">
        <div @click="navigateToUserCenter" :class="{ 'cursor-pointer user-profile-clickable': userInfo.isLoggedIn }"
          class="flex items-center mb-3 rounded-lg transition-all duration-200">
          <div class="avatar-wrapper mr-4 relative">
            <img :src="userInfo.avatar || '/avatars/default.jpg'" :alt="userInfo.name"
              class="w-12 h-12 rounded-full object-cover bg-gray-600 transition-all duration-200" />

          </div>
          <div class="flex-grow">
            <div class="font-medium flex items-center justify-between gap-2">
              <span>{{ userInfo.name || '游客用户' }}</span>
              <button v-if="!userInfo.isLoggedIn" @click.stop="login"
                class="ml-auto px-2 py-1 btn-accent rounded text-xs font-medium ripple-effect flex-shrink-0">
                <i class="fas fa-sign-in-alt"></i>
              </button>
              <button v-else @click.stop="logout"
                class="ml-auto px-2 py-1 btn-accent rounded text-xs font-medium ripple-effect flex-shrink-0">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>

            <div class="text-xs text-gray-400">
              <span>{{ userInfo.isLoggedIn ? userInfo.role : '未登录' }}</span>
            </div>
          </div>
        </div>

        <div v-if="userInfo.bio && userInfo.bio.length > 0" class="text-center mt-4">
          <span v-for="(bioText, index) in Array.isArray(userInfo.bio) ? userInfo.bio : [userInfo.bio]" :key="index"
            class="bio-badge mb-2 mx-1 inline-block">
            {{ bioText }}
          </span>
        </div>
      </div>

      <!-- 搜索框增强 -->
      <div class="gradient-card rounded-lg p-3">
        <div class="relative search-container">
          <input v-model="searchQuery" type="text" placeholder="输入关键词..."
            class="search-input w-full py-2 px-4 rounded-lg pr-10 focus-effect" @input="search" />
          <button class="search-icon absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover-rotate">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- 导航菜单增强 -->
      <nav class="gradient-card rounded-lg p-3">
        <h3 class="font-semibold mb-3 flex items-center">
          <i class="fas fa-bars mr-2 text-accent pulse-icon"></i>导航菜单
        </h3>
        <div class="grid grid-cols-3 gap-2">
          <router-link v-for="item in visibleMenuItems" :key="item.path" :to="item.path"
            class="menu-item flex items-center justify-center nav-link px-2 py-1 rounded  text-sm"
            active-class=" text-accent" @click="closeMenuIfNeeded">
            <i :class="['fas', item.icon, 'mr-1']"></i>{{ item.name }}
          </router-link>
        </div>
      </nav>

      <!-- 公告栏增强 -->
      <div class="gradient-card rounded-lg p-3">
        <h3 class="font-semibold mb-3 flex items-center">
          <i class="fas fa-bullhorn mr-2 text-accent"></i>公告栏
        </h3>
        <div class="notice-container">
          <div v-for="notice in notices" :key="notice.id"
            class="notice-item p-2 bg-blue-900/20 rounded mb-2 hover-slide">
            <div class="font-medium">{{ notice.title }}</div>
            <div class="text-gray-400 text-sm">{{ notice.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import ArticleOutline from './ArticleOutline.vue'
import usersData from '../mock/users.js'

export default {
  data() {
    return {
      searchQuery: '',
      userInfo: {
        isLoggedIn: false,
        name: '',
        role: '',
        avatar: '',
        bio: []
      },
      menuItems: [
        { name: '首页', path: '/', icon: 'fa-home', description: '网站主页' },
        { name: '资源', path: '/resources/all', icon: 'fa-download', description: '资源中心' },
        { name: '短剧', path: '/short-drama', icon: 'fa-video', description: '短剧资源' },
        { name: '音乐', path: '/music', icon: 'fa-music', description: '浏览音乐资源' },
        { name: '游戏', path: '/games', icon: 'fa-gamepad', description: '浏览游戏资源' },
        { name: '每日', path: '/daily', icon: 'fa-star', description: '每日精选内容' },
        { name: '博客', path: '/blogs', icon: 'fa-blog', description: '浏览博客文章' },
        { name: '最新', path: '/latest', icon: 'fa-clock', description: '最新发布内容' },
        { name: '排行', path: '/ranking', icon: 'fa-trophy', description: '热门排行榜' },
        { name: '社区', path: '/community', icon: 'fa-users', description: '进入社区交流' },
        { name: '关于', path: '/about', icon: 'fa-info-circle', description: '关于我们' },
        { name: '个人', path: '/user', icon: 'fa-user-circle', description: '个人中心', requiresAuth: true }
      ],
      notices: [
        {
          id: 1,
          title: '系统维护通知',
          content: '4月15日 00:00-02:00'
        },
        {
          id: 2,
          title: '资源更新公告',
          content: '新增100+短剧资源'
        }
      ],
      isDetailPage: false,
      outline: [],
      activeId: ''
    }
  },
  computed: {
    visibleMenuItems() {
      return this.menuItems.filter(item => {
        // 如果菜单项需要登录且用户未登录，则不显示
        if (item.requiresAuth && !this.userInfo.isLoggedIn) {
          return false;
        }
        return true;
      });
    }
  },
  created() {
    // 初始化检查登录状态
    this.checkLoginStatus()

    // 监听登录事件
    window.addEventListener('userLogin', (e) => {
      const user = e.detail

      // 确保bio是数组类型
      let bioData = user.bio;
      if (!Array.isArray(bioData) && bioData) {
        bioData = [bioData];
      } else if (!bioData) {
        bioData = [];
      }

      this.userInfo = {
        isLoggedIn: true,
        name: user.nickname || user.username,
        role: user.role,
        avatar: user.avatar,
        bio: bioData
      }
    })

    // 监听退出事件
    window.addEventListener('userLogout', () => {
      this.userInfo = {
        isLoggedIn: false,
        name: '',
        role: '',
        avatar: '',
        bio: []
      }
    })

    // 监听存储变化
    window.addEventListener('storage', (e) => {
      if (e.key === 'userInfo' || e.key === 'rememberMe') {
        this.checkLoginStatus()
      }
    })
  },
  methods: {
    login() {
      // 跳转到登录页面
      this.$router.push('/login')
    },

    logout() {
      // 清除登录状态
      this.clearLoginStatus()
      // 触发登出事件
      window.dispatchEvent(new CustomEvent('userLogout'))
      // 可选：跳转到首页
      this.$router.push('/')
    },

    navigateToUserCenter() {
      if (this.userInfo.isLoggedIn) {
        // 确认用户数据在localStorage中仍然有效
        const storedUser = localStorage.getItem('userInfo')
        const rememberMe = localStorage.getItem('rememberMe')

        if (!storedUser) {
          // 如果用户数据不存在，则重定向到登录页面
          this.$router.push('/login')
          return
        }

        try {
          const userInfo = JSON.parse(storedUser)
          const loginTime = new Date(userInfo.loginTime).getTime()
          const currentTime = new Date().getTime()
          const oneDayMs = 24 * 60 * 60 * 1000 // 24小时的毫秒数

          if (!rememberMe && currentTime - loginTime > oneDayMs) {
            // 如果没有"记住我"且登录时间超过24小时，则视为过期
            localStorage.removeItem('userInfo')
            this.$router.push({
              path: '/login',
              query: {
                redirect: '/user',
                message: '登录已过期，请重新登录'
              }
            })
            return
          }

          // 登录有效，导航到用户中心
          this.$router.push('/user')
          this.$emit('close-menu') // 关闭移动菜单（如果打开）
        } catch (error) {
          console.error('解析用户数据失败:', error)
          this.$router.push('/login')
        }
      } else {
        // 未登录状态下点击，跳转到登录页
        this.$router.push('/login')
      }
    },

    closeMenuIfNeeded() {
      this.$emit('close-menu')
    },

    // Search method for the search input
    search() {
      // Search functionality will be implemented later
      console.log('Searching for:', this.searchQuery)
    },

    checkLoginStatus() {
      const storedUser = localStorage.getItem('userInfo')
      const rememberMe = localStorage.getItem('rememberMe')

      if (storedUser && (rememberMe || JSON.parse(storedUser).loginTime)) {
        const userInfo = JSON.parse(storedUser)

        // 确保bio是数组类型
        let bioData = userInfo.bio;
        if (!Array.isArray(bioData) && bioData) {
          bioData = [bioData];
        } else if (!bioData) {
          bioData = [];
        }

        this.userInfo = {
          isLoggedIn: true,
          name: userInfo.nickname || userInfo.username,
          role: userInfo.role,
          avatar: userInfo.avatar,
          bio: bioData
        }
      } else {
        this.clearLoginStatus()
      }
    },
    clearLoginStatus() {
      this.userInfo = {
        isLoggedIn: false,
        name: '',
        role: '',
        avatar: '',
        bio: []
      }
      localStorage.removeItem('userInfo')
      localStorage.removeItem('rememberMe')
    }
  }
}
</script>

<style scoped>
.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-level-2 {
  margin-bottom: 0.5rem;
}

.toc-level-3 {
  margin-left: 1.5rem;
  font-size: 0.95em;
}

/* 搜索框效果 */
.search-container {
  position: relative;
}

.search-input {
  transition: all 0.3s ease;
}

.focus-effect:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover-rotate {
  transition: transform 0.3s ease;
}

.hover-rotate:hover {
  transform: translateY(-50%) rotate(90deg);
}

/* 导航菜单效果 */
.menu-item {
  position: relative;
  transition: all 0.3s ease;
}

.menu-item:hover {
  transform: translateY(-2px);
}

.pulse-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

/* 公告项效果 */
.notice-item {
  transition: all 0.3s ease;
  transform-origin: left;
}

.hover-slide:hover {
  transform: translateX(8px);
}

/* 卡片悬浮发光效果 */
.hover-glow {
  transition: all 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 15px var(--accent);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .tooltip {
    display: none;
  }

  .hover-slide:hover {
    transform: none;
  }

  .menu-item:hover {
    transform: none;
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {

  .avatar-animate::after,
  .pulse-icon,
  .hover-rotate,
  .ripple-effect::after {
    animation: none;
    transition: none;
  }
}

.focus-visible:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

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

/* User profile clickable effect */
.user-profile-clickable {
  padding: 8px;
  margin: -8px;
}

.user-profile-clickable:hover {
  background-color: rgba(59, 130, 246, 0.1);
}
</style>