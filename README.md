# Vue-TorchBlog

![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-blue)

Vue-TorchBlog 是一个使用 Vue 3 和 Vite 构建的资源分享平台，提供博客文章阅读、资源下载、用户互动等功能。该项目采用现代前端技术栈，提供流畅的用户体验和丰富的功能。

## 功能特点

- 🎯 博客文章系统：支持 Markdown 内容，分类标签，评论互动
- 🔍 资源搜索：快速查找平台内容
- 🌓 明暗主题切换：支持自定义 UI 主题
- 📱 响应式设计：支持多种设备屏幕尺寸
- 🔒 用户认证：支持 GitHub OAuth 登录
- 💾 API 集成：与后端服务无缝连接

## 技术栈

- **前端框架**：Vue 3 + Vite
- **路由**：Vue Router 4
- **样式**：Tailwind CSS + Custom CSS
- **Markdown 解析**：Vite-plugin-md + Marked
- **API 请求**：Axios
- **状态管理**：Vue 3 Composition API
- **认证**：GitHub OAuth

## 项目结构

```
vue-torch/
├── .vscode/               # VS Code 配置
├── avatars/               # 用户头像资源
├── node_modules/          # 依赖包
├── public/                # 静态资源
│   └── images/            # 图片资源
├── src/                   # 源代码
│   ├── assets/            # 项目资源文件
│   ├── components/        # Vue 组件
│   ├── content/           # Markdown 内容
│   ├── mock/              # 模拟数据
│   ├── pages/             # 页面组件
│   ├── router/            # 路由配置
│   ├── utils/             # 工具函数
│   ├── App.vue            # 根组件
│   ├── main.js            # 应用入口
│   └── style.css          # 全局样式
├── .env                   # 环境变量
├── .gitignore             # Git 忽略文件
├── index.html             # HTML 模板
├── package.json           # 包配置
├── postcss.config.js      # PostCSS 配置  
├── tailwind.config.js     # Tailwind 配置
└── vite.config.js         # Vite 配置
```

## 安装和运行

### 前置条件

- Node.js 16.x 或更高版本
- npm 或 yarn 或 pnpm

### 安装步骤

1. 克隆仓库

   ```bash
   git clone https://github.com/hillmis/vue-torchblog.git
   cd vue-torch
   ```
2. 安装依赖

   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```
3. 配置环境变量
   复制 `.env.example` 到 `.env`，并根据需要更新配置：

   ```bash
   cp .env.example .env
   ```

   需要设置的主要环境变量：

   - GitHub OAuth 配置 (如果使用 GitHub 登录)
   - 后端 API 地址 (如果有)
4. 启动开发服务器

   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```
5. 构建生产版本

   ```bash
   npm run build
   # 或
   yarn build
   # 或
   pnpm build
   ```

## 自定义配置

### 主题定制

在 `src/style.css` 中可以修改主题变量：

```css
:root {
  --bg-primary: #454545;
  --bg-secondary: #1e293b00;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --accent: #38bdf8;
  /* ... 其他变量 */
}
```

### Tailwind 配置

可以在 `tailwind.config.js` 中扩展或修改 Tailwind CSS 配置。

## 部署

项目可以部署到任何支持静态网站托管的服务上，如 Netlify、Vercel、GitHub Pages 等。

1. 构建项目

   ```bash
   npm run build
   ```
2. 部署 `dist` 目录到您选择的托管服务

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

- 项目维护者: [hillmis](mailto:hillmis@qq.com)
- 项目主页: [vue-torchblog](https://github.com/hillmis/vue-torchblog)

---

感谢使用 Vue Torch！
