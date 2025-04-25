import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/Home.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../pages/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../pages/Register.vue')
    },
    {
        path: '/user',
        name: 'UserCenter',
        component: () => import('../pages/UserCenter.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/resources/:type?',
        name: 'Resources',
        component: () => import('../pages/Resources.vue'),
        props: true
    },
    {
        path: '/short-drama',
        name: 'ShortDrama',
        component: () => import('../pages/ShortDrama.vue')
    },
    {
        path: '/music',
        name: 'Music',
        component: () => import('../pages/Music.vue')
    },
    {
        path: '/games',
        name: 'Games',
        component: () => import('../pages/Games.vue')
    },
    {
        path: '/daily',
        name: 'Daily',
        component: () => import('../pages/Daily.vue')
    },
    {
        path: '/blogs',
        name: 'Blogs',
        component: () => import('../pages/Blog.vue')
    },
    {
        path: '/blogs/:id',
        name: 'BlogDetail',
        component: () => import('../pages/BlogDetail.vue'),
        props: true
    },
    {
        path: '/latest',
        name: 'Latest',
        component: () => import('../pages/Latest.vue')
    },
    {
        path: '/ranking',
        name: 'Ranking',
        component: () => import('../pages/Ranking.vue')
    },
    {
        path: '/community',
        name: 'Community',
        component: () => import('../pages/Community.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../pages/About.vue')
    },
    {
        // 404页面
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
    // 从 localStorage 获取用户信息和记住登录状态
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const rememberMe = localStorage.getItem('rememberMe')

    // 已登录用户不能访问登录和注册页面
    if ((to.name === 'Login' || to.name === 'Register') && userInfo) {
        next('/')
        return
    }

    // 检查是否需要登录权限
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!userInfo) {
            // 未登录，重定向到登录页面
            next({
                name: 'Login',
                query: {
                    redirect: to.fullPath,
                    message: '请先登录'
                }
            })
        } else {
            // 登录时间检查（如果没有选择记住我，检查登录时间是否超过24小时）
            if (!rememberMe) {
                const loginTime = new Date(userInfo.loginTime).getTime();
                const currentTime = new Date().getTime();
                const oneDayMs = 24 * 60 * 60 * 1000; // 24小时的毫秒数

                if (currentTime - loginTime > oneDayMs) {
                    // 登录已过期，清除用户信息
                    localStorage.removeItem('userInfo');
                    next({
                        name: 'Login',
                        query: {
                            redirect: to.fullPath,
                            message: '登录已过期，请重新登录'
                        }
                    });
                    return;
                }
            }

            // 已登录且有效，允许访问
            next();
        }
    } else {
        next()
    }
})

export default router