import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // Import the router
import { reactive } from 'vue'

// 创建用户状态存储
const userStore = {
    state: reactive({
        isLoggedIn: false,
        user: null
    }),
    login(userData) {
        this.state.isLoggedIn = true
        this.state.user = userData
        window.dispatchEvent(new CustomEvent('userLogin', { detail: userData }))
    },
    logout() {
        this.state.isLoggedIn = false
        this.state.user = null
        localStorage.removeItem('userInfo')
        localStorage.removeItem('rememberMe')
        window.dispatchEvent(new CustomEvent('userLogout'))
    },
    // 从localStorage初始化状态
    initFromStorage() {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'))
            if (userInfo) {
                this.state.isLoggedIn = true
                this.state.user = userInfo
                return true
            }
        } catch (error) {
            console.error('初始化用户状态失败:', error)
        }
        return false
    }
}

// 初始化userStore
userStore.initFromStorage()

// 创建Vue应用实例
const app = createApp(App)

// 提供用户状态存储
app.provide('userStore', userStore)

// 使用路由
app.use(router)

// 添加全局错误处理
app.config.errorHandler = (err) => {
    console.error('全局错误:', err)
}

// 设置初始主题
document.body.classList.add('dark-mode')

// 挂载应用
app.mount('#app')
