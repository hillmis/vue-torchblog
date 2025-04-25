export const resourceCategories = [
    {
        id: 'drama',
        name: '短剧资源',
        icon: 'fas fa-video',
        description: '最新热门短剧资源，包含都市、悬疑、古装等多个类型',
        count: 1256
    },
    {
        id: 'music',
        name: '音乐资源',
        icon: 'fas fa-music',
        description: '无损音乐资源，包含流行、古典、摇滚等多种风格',
        count: 3652
    },
    {
        id: 'games',
        name: '游戏资源',
        icon: 'fas fa-gamepad',
        description: '精选游戏资源，包括PC、手机等多平台游戏',
        count: 892
    },
    {
        id: 'software',
        name: '软件工具',
        icon: 'fas fa-laptop-code',
        description: '实用软件和工具，包含办公、设计、开发等多个领域',
        count: 756
    }
]

export const resources = {
    drama: [
        {
            id: 1,
            title: '都市情缘',
            type: '都市/情感',
            episodes: 36,
            size: '25.6GB',
            format: 'MP4',
            quality: '1080P',
            uploadTime: '2024-04-24',
            downloads: 1526,
            cover: 'https://picsum.photos/300/400'
        },
        {
            id: 2,
            title: '迷雾追凶',
            type: '悬疑/推理',
            episodes: 24,
            size: '18.2GB',
            format: 'MP4',
            quality: '1080P',
            uploadTime: '2024-04-23',
            downloads: 1253,
            cover: 'https://picsum.photos/300/400'
        }
    ],
    music: [
        {
            id: 1,
            title: '流行音乐精选集VOL.8',
            type: '流行',
            tracks: 15,
            size: '650MB',
            format: 'FLAC',
            quality: '无损',
            uploadTime: '2024-04-24',
            downloads: 856,
            cover: 'https://picsum.photos/200/200'
        },
        {
            id: 2,
            title: '经典摇滚集锦2024',
            type: '摇滚',
            tracks: 12,
            size: '580MB',
            format: 'FLAC',
            quality: '无损',
            uploadTime: '2024-04-23',
            downloads: 723,
            cover: 'https://picsum.photos/200/200'
        }
    ],
    games: [
        {
            id: 1,
            title: '星空',
            type: 'RPG',
            platform: 'PC',
            size: '125GB',
            version: 'v1.2.3',
            uploadTime: '2024-04-24',
            downloads: 2563,
            cover: 'https://picsum.photos/200/200'
        },
        {
            id: 2,
            title: '博德之门3',
            type: 'RPG',
            platform: 'PC',
            size: '150GB',
            version: 'v1.0.0',
            uploadTime: '2024-04-23',
            downloads: 2156,
            cover: 'https://picsum.photos/200/200'
        }
    ],
    software: [
        {
            id: 1,
            title: 'Adobe全家桶2024',
            type: '设计软件',
            platform: 'Windows/MacOS',
            size: '25GB',
            version: 'CC 2024',
            uploadTime: '2024-04-24',
            downloads: 5263,
            icon: 'fab fa-adobe'
        },
        {
            id: 2,
            title: 'Office 2024专业版',
            type: '办公软件',
            platform: 'Windows/MacOS',
            size: '8.5GB',
            version: '2024',
            uploadTime: '2024-04-23',
            downloads: 4526,
            icon: 'fas fa-file-word'
        }
    ]
}