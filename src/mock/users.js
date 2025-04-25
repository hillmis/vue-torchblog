// 用户数据 mock
export default [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        nickname: '管理员',
        avatar: '/avatars/admin.jpg',
        role: 'admin',
        email: 'admin@torchshare.com',
        bio: ['网站管理员', '技术达人', 'Vue开发者'],
        joinDate: '2025-01-01',
        lastLoginDate: '2025-04-25',
        status: 'active',
        stats: {
            posts: 156,
            comments: 325,
            likes: 789,
            downloads: 234
        },
        preferences: {
            theme: 'dark',
            emailNotifications: true,
            newsletter: true
        },
        vipLevel: 3,
        vipExpireDate: '2026-04-25'
    },
    {
        id: 2,
        username: 'wind',
        password: 'wind123',
        nickname: '风',
        avatar: '/avatars/wind.jpg',
        role: 'wind',
        email: 'wind@example.com',
        bio: ['热爱分享', '普通用户', '摄影爱好者'],
        joinDate: '2025-03-15',
        lastLoginDate: '2025-04-24',
        status: 'active',
        stats: {
            posts: 23,
            comments: 45,
            likes: 67,
            downloads: 89
        },
        preferences: {
            theme: 'dark',
            emailNotifications: false,
            newsletter: true
        },
        vipLevel: 1,
        vipExpireDate: '2025-06-15'
    }
];
