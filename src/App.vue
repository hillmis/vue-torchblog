<!-- App.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <nav class="fixed top-0 left-0 right-0 z-50 h-16 bg-opacity-30 backdrop-blur-md  ">
      <div class="container h-full flex items-center justify-between px-4">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <h1 class="artistic-title">
              <span class="main-text">TORCH</span>
              <span class="sub-text">Blog</span>
            </h1>
          </div>
         
        </div>
        <div class="flex items-center space-x-4">
          <button @click="toggleTheme" class="theme-toggle">
            <i :class="['fas', isDarkMode ? 'fa-moon' : 'fa-sun']"></i>
          </button>
          <button class="md:hidden" @click="openMobileMenu">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </nav>
<!-- 添加 DynamicIsland 组件 -->
<DynamicIsland ref="dynamicIsland" />
    <!-- 移动菜单遮罩 -->
    <div 
      class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      :class="{ 'opacity-100 pointer-events-auto': isMobileMenuOpen, 'opacity-0 pointer-events-none': !isMobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>

    <!-- 移动端侧边栏 -->
    <div 
      class="fixed top-0 right-0 w-[280px] h-full bg-bg-primary z-50 transform transition-transform duration-300 ease-out"
      :class="{ 'translate-x-0': isMobileMenuOpen, 'translate-x-full': !isMobileMenuOpen }"
    >
      <div class="h-full overflow-y-auto">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">{{ route.path.startsWith('/blogs/') ? '文章大纲' : '菜单' }}</h3>
            <button @click="closeMobileMenu" class="text-text-secondary">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          <!-- 使用与PC端相同的 LeftSidebar 组件 -->
          <LeftSidebar ref="mobileSidebar" @close-menu="closeMobileMenu" />
        </div>
      </div>
    </div>

    <!-- 修改主要内容区域 -->
    <main class="flex-1 pt-20 bg-gradient-to-b from-bg-primary to-bg-secondary relative">
     
      
      <!-- 内容区域 -->
      <div class="container mx-auto px-4 relative z-10">
        <div class="grid grid-cols-12 gap-4 md:gap-6">
          <!-- 左侧边栏（固定） -->
          <aside class="hidden lg:block lg:col-span-3">
            <div class="fixed top-20 bottom-0 w-[calc((100vw-4rem)/12*3-1rem)] overflow-y-auto">
              <div class="pr-4">
                <LeftSidebar ref="desktopSidebar" @close-menu="closeMobileMenu" />
              </div>
            </div>
          </aside>

          <!-- 中间和右侧内容区域包装器 -->
          <div class="col-span-12 lg:col-span-9">
            <div class="grid grid-cols-12 gap-4 md:gap-6">
              <!-- 主内容区 -->
              <main class="col-span-12 lg:col-span-12">
                <div class="space-y-6">
                  <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                      <component :is="Component" />
                    </transition>
                  </router-view>
                 
                </div>
              </main>
            </div>
            <!-- 移动端底部导航栏 -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-opacity-30 backdrop-blur-md ">
      <div class="grid grid-cols-4 h-full">
        <router-link to="/" class="flex flex-col items-center justify-center text-sm">
          <i class="fas fa-home text-lg"></i>
          <span class="mt-1">首页</span>
        </router-link>
        <router-link to="/resources" class="flex flex-col items-center justify-center text-sm">
          <i class="fas fa-cube text-lg"></i>
          <span class="mt-1">资源</span>
        </router-link>
        <router-link to="/blogs" class="flex flex-col items-center justify-center text-sm">
          <i class="fas fa-book text-lg"></i>
          <span class="mt-1">博客</span>
        </router-link>
        <router-link :to="userPageRoute" class="flex flex-col items-center justify-center text-sm">
          <i class="fas fa-user text-lg"></i>
          <span class="mt-1">{{ isLoggedIn ? '我的' : '登录' }}</span>
        </router-link>
      </div>
    </nav>
            <!-- 页脚（仅在中间和右侧区域） -->
            <footer class="hidden md:block bg-footer-bg py-8 mt-8 rounded-lg">
              <div class="px-6">
                <div class="flex flex-col md:flex-row justify-between items-center">
                  <div class="mb-4 md:mb-0">
                    <div class="flex items-center space-x-2">
                      <i class="fas fa-fire flame-icon text-base sm:text-lg"></i>
                      <span class="font-medium text-sm sm:text-base md:hidden">Torch</span>
                      <span class="font-medium text-base hidden md:block">Torch - 火炬博客</span>
                    </div>
                    <div class="text-xs sm:text-sm text-gray-400 mt-1">
                      <span class="md:hidden">© 2025 Torch</span>
                      <span class="hidden md:block">© 2025 Torch.com 版权所有</span>
                    </div>
                  </div>
                  <div class="flex space-x-8">
                    <a href="#" class="text-text-secondary hover:text-text-primary transition-colors">关于我们</a>
                    <a href="#" class="text-text-secondary hover:text-text-primary transition-colors">联系方式</a>
                    <a href="#" class="text-text-secondary hover:text-text-primary transition-colors">用户协议</a>
                    <a href="#" class="text-text-secondary hover:text-text-primary transition-colors">隐私政策</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import DynamicIsland from './components/DynamicIsland.vue'
import LeftSidebar from './components/LeftSidebar.vue'
import ArticleOutline from './components/ArticleOutline.vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  inject: ['userStore'],
  components: {
    LeftSidebar,
    ArticleOutline,
    DynamicIsland
  },
  setup() {
    const route = useRoute()
    return { route }
  },
  data() {
    return {
      isDarkMode: true,
      isMobileMenuOpen: false,
      isLoggedIn: false
    }
  },
  computed: {
    userPageRoute() {
      return this.isLoggedIn ? '/user' : '/login'
    }
  },
  mounted() {
    // 初始化登录状态 - 添加安全检查
    if (this.userStore && this.userStore.state) {
      this.isLoggedIn = this.userStore.state.isLoggedIn
    }
    
    // 主题初始化
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    this.isDarkMode = localStorage.getItem('theme') === 'dark' ?? prefersDark
    this.updateTheme()

    if (this.$refs.mobileSidebar && this.$refs.desktopSidebar) {
      this.$watch(
        () => this.$refs.desktopSidebar.outline,
        (newOutline) => {
          this.$refs.mobileSidebar.outline = newOutline
        }
      )

      this.$watch(
        () => this.$refs.desktopSidebar.activeId,
        (newActiveId) => {
          this.$refs.mobileSidebar.activeId = newActiveId
        }
      )
    }

    // 登录事件处理
    const handleLogin = (event) => {
      this.isLoggedIn = true
      if (this.$refs.dynamicIsland) {
        this.$refs.dynamicIsland.show({
          type: 'notification',
          title: '登录成功',
          content: `欢迎回来，${event.detail.nickname || event.detail.username}！`,
          duration: 3000
        })
      }
    }

    // 退出登录事件处理
    const handleLogout = () => {
      this.isLoggedIn = false
      if (this.$refs.dynamicIsland) {
        this.$refs.dynamicIsland.show({
          type: 'notification',
          title: '已退出登录',
          duration: 3000
        })
      }
      this.$router.push('/login')
    }

    window.addEventListener('userLogin', handleLogin)
    window.addEventListener('userLogout', handleLogout)

    this.$nextTick(() => {
      setTimeout(() => {
        if (this.$refs.dynamicIsland) {
          this.$refs.dynamicIsland.show({
            type: 'notification',
            title: '欢迎来到 Torch Blog',
            content: '这里是一个充满活力的技术社区',
            actions: [
              {
                text: '',
                handler: () => {
                  this.$refs.dynamicIsland.hide()
                }
              }
            ],
            duration: 5000
          })
        }
      }, 3000)
    })

    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
    
    // 存储事件监听器引用，以便卸载时使用
    this.handleLogin = handleLogin
    this.handleLogout = handleLogout

    // 监听用户状态变化
    if (this.userStore && this.userStore.state) {
      this.$watch(
        () => this.userStore.state.isLoggedIn,
        (newIsLoggedIn) => {
          this.isLoggedIn = newIsLoggedIn
        }
      )
    }
  },
  beforeUnmount() {
    // 正确移除事件监听器，使用保存的引用
    window.removeEventListener('userLogin', this.handleLogin)
    window.removeEventListener('userLogout', this.handleLogout)
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light')
      this.updateTheme()
      
      if (this.$refs.dynamicIsland) {
        this.$refs.dynamicIsland.show({
          type: 'notification',
          title: `已切换到${this.isDarkMode ? '深色' : '浅色'}主题`,
          duration: 2000
        })
      }
    },
    updateTheme() {
      document.documentElement.classList.toggle('light-mode', !this.isDarkMode)
      document.documentElement.classList.toggle('dark-mode', this.isDarkMode)
    },
    openMobileMenu() {
      this.isMobileMenuOpen = true
      document.body.style.overflow = 'hidden'
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
      document.body.style.overflow = ''
    }
  },
  watch: {
    '$route'(to) {
      if (to.meta.title && this.$refs.dynamicIsland) {
        this.$refs.dynamicIsland.show({
          type: 'notification',
          title: `正在访问: ${to.meta.title}`,
          duration: 3000
        })
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap&text=TORCHBlog');

.flame-icon {
  color: #f59e0b;
  animation: flicker 3s infinite alternate;
}
@keyframes flicker {
  0%, 100% { opacity: 1; text-shadow: 0 0 8px #f59e0b; }
  50% { opacity: 0.8; text-shadow: 0 0 15px #f59e0b; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.artistic-title {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.artistic-title .main-text {
  font-family: 'Satisfy', 'Brush Script MT', cursive;
  font-size: 1.8rem;
  letter-spacing: 0.02em;
  transform-origin: left center;
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .artistic-title .main-text {
    font-size: 2.5rem;
  }
}

.artistic-title .main-text:hover {
  transform: scale(1.05);
}

.artistic-title .sub-text {
  font-family: 'Satisfy', 'Brush Script MT', cursive;
  font-size: 1.1rem;
  opacity: 0.85;
  margin-left: 0.2rem;
}

@media (min-width: 768px) {
  .artistic-title .sub-text {
    font-size: 1.4rem;
  }
}

.fonts-loaded .artistic-title {
  opacity: 1;
  visibility: visible;
}

.artistic-title {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}



@media (max-width: 640px) {
  .router-link-active {
    color: #119ade;
    font-size: 0.95rem;
  }
  
  .router-link-active i {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  main {
    padding-bottom: 4rem;
  }
}

@media (min-width: 640px) and (max-width: 768px) {
  main {
    padding-bottom: 5rem;
  }
}
</style>