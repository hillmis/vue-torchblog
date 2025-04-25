/*
 * @Author: Wind
 * @Date: 2025-04-24 20:58:11
 */
// 文章数据 mock
export default [
    {
        id: 1,
        title: 'Vue3 + Vite 博客系统搭建',
        author: 'admin',
        createdAt: '2025-04-20',
        content: '这是我的第一篇博客，使用 Vue3 和 Vite 搭建的博客系统。',
        tags: ['Vue3', 'Vite', '前端'],
        category: '前端',
        views: 123,
        likes: 10,
        comments: [1, 2],
        path: '/src/content/posts/20250425.md'
    },
    {
        id: 2,
        title: '使用 Tailwind CSS 美化博客',
        author: 'wind',
        createdAt: '2025-04-21',
        content: '使用 Tailwind CSS 对博客进行美化，提升用户体验66666。',
        tags: ['Tailwind', 'CSS'],
        category: '前端',
        views: 88,
        likes: 5,
        comments: [3],
        path: '/src/content/posts/tailwind-blog-styling.md'
    },
    {
        id: 3,
        title: '使用 Tailwind CSS 美化博客',
        author: 'wind',
        createdAt: '2025-04-21',
        content: '使用 Tailwind CSS 对博客进行美化，提升用户体验66666。',
        tags: ['Tailwind', 'CSS'],
        category: '前端',
        views: 88,
        likes: 5,
        comments: [3],
        path: '/src/content/posts/tailwind.md'
    },
];
