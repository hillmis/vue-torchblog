// floating-island.js
class FloatingIsland {
  constructor(containerId, options = {}) {
    this.options = {
      defaultType: 'notification',
      defaultExpanded: true,
      darkMode: true,
      containerId: containerId || 'floating-island-container',
      // 通知默认配置
      notification: {
        title: 'New Message',
        content: 'You have 3 new notifications. Click to view them.',
        actions: [
          { text: 'View', handler: () => console.log('View notifications') },
          { text: 'Dismiss', handler: () => console.log('Dismiss notifications') }
        ]
      },
      // 音乐播放器默认配置
      music: {
        isPlaying: false,
        currentTime: 45,
        duration: 180,
        info: {
          cover: 'https://source.unsplash.com/random/300x300/?music',
          title: 'Midnight City',
          artist: 'M83'
        }
      },
      // 计时器默认配置
      timer: {
        time: 1500, // 25 minutes in seconds
        initialTime: 1500,
        isRunning: false
      },
      // 笔记默认配置
      note: {
        content: 'This is a sample note. Click to edit.\n\nYou can write anything here and it will be saved locally.'
      },
      // 天气默认配置
      weather: {
        condition: 'Sunny',
        temp: 25,
        humidity: 60,
        wind: 12,
        location: 'San Francisco'
      },
      // 设置默认配置
      settings: {
        darkMode: true,
        animations: true,
        sound: true,
        notifications: true
      },
      // 当前状态
      currentType: 'notification',
      expanded: true,
      // 事件回调
      onCollapse: () => { },
      onExpand: () => { },
      onModeChange: () => { }
    };

    // 合并用户选项
    this.options = { ...this.options, ...options };

    // 初始化组件
    this.init();
  }

  init() {
    // 创建容器
    if (!document.getElementById(this.options.containerId)) {
      const container = document.createElement('div');
      container.id = this.options.containerId;
      document.body.appendChild(container);
    }

    this.render();
    this.setupEventListeners();
    this.addRippleEffects();
  }

  render() {
    const container = document.getElementById(this.options.containerId);
    container.innerHTML = this.getHtmlTemplate();
  }

  setupEventListeners() {
    // 修改容器点击事件处理逻辑
    const islandContainer = document.getElementById('island-container');
    if (islandContainer) {
      // 移除原来的点击事件
      islandContainer.removeEventListener('click', this.toggleExpand);
      // 添加新的事件处理
      islandContainer.addEventListener('click', (event) => {
        // 仅在收起状态时展开
        if (!this.options.expanded) {
          event.stopPropagation();
          this.toggleExpand();
        }
      });
    }
    // 音乐播放按钮点击事件
    const playButton = document.querySelector('.music-controls .fa-play, .music-controls .fa-pause');
    if (playButton) {
      playButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.toggleMusicPlay();
      });
    }

    // 计时器按钮点击事件
    const timerButton = document.querySelector('.mt-6 .btn-primary');
    if (timerButton) {
      timerButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.toggleTimer();
      });
    }

    // 笔记保存按钮点击事件
    const saveNoteButton = document.querySelector('.mt-3 .btn-primary');
    if (saveNoteButton) {
      saveNoteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.saveNote();
      });
    }

    // 设置切换事件
    const settingToggles = document.querySelectorAll('.settings-toggle input[type="checkbox"]');
    settingToggles.forEach(toggle => {
      toggle.addEventListener('change', (event) => {
        event.stopPropagation();
        const settingName = event.target.parentElement.parentElement.querySelector('span').textContent.toLowerCase();
        this.toggleSetting(settingName);
      });
    });

    // 快速操作按钮事件
    const actionButtons = document.querySelectorAll('.quick-actions button');
    actionButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const iconClass = button.querySelector('i').className;
        if (iconClass.includes('fa-music')) {
          this.switchToType('music');
        } else if (iconClass.includes('fa-clock')) {
          this.switchToType('timer');
        } else if (iconClass.includes('fa-sticky-note')) {
          this.switchToType('note');
        } else if (iconClass.includes('fa-cloud-sun')) {
          this.switchToType('weather');
        } else if (iconClass.includes('fa-cog')) {
          this.switchToType('settings');
        } else if (iconClass.includes('fa-bell')) {
          this.switchToType('notification');
        }
      });
    });

    // 展开/收起按钮事件
    const expandButton = document.querySelector('.fa-chevron-up');
    if (expandButton) {
      expandButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.toggleExpand();
      });
    }

    // 通知操作按钮事件
    const notificationButtons = document.querySelectorAll('.mt-6 .btn');
    notificationButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const actionText = button.textContent.trim();
        this.handleAction(actionText);
      });
    });

    // 计时器设置按钮事件
    const timerSetButtons = document.querySelectorAll('.grid-cols-3 .btn');
    timerSetButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const timeText = button.textContent.trim();
        let seconds;
        if (timeText.includes('5 min')) seconds = 300;
        else if (timeText.includes('15 min')) seconds = 900;
        else if (timeText.includes('30 min')) seconds = 1800;
        this.setTimer(seconds);
      });
    });

    // 音乐进度条点击事件
    const musicProgressBar = document.querySelector('.music-progress');
    if (musicProgressBar) {
      musicProgressBar.addEventListener('click', (event) => {
        event.stopPropagation();
        this.seekMusic(event);
      });
    }
  }

  addRippleEffects() {
    // 添加涟漪效果
    const buttons = document.querySelectorAll('.ripple');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  getHtmlTemplate() {
    return `
      <style>
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .island-enter-active,
        .island-leave-active {
          transition: all 0.3s ease;
        }

        .island-enter-from,
        .island-leave-to {
          transform: translateY(-20px);
          opacity: 0;
        }

        /* Glass morphism effect */
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        /* Height transition */
        .backdrop-blur-lg {
          transition: height 0.3s ease-in-out, background-color 0.3s ease;
        }

        /* Expanded state padding */
        .h-auto {
          min-height: 3rem;
          padding-bottom: 1rem;
        }

        /* Dark mode shadow */
        .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .dark .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3),
            0 10px 10px -5px rgba(0, 0, 0, 0.25);
        }

        /* Flame animation */
        .flame-icon {
          color: #f59e0b;
          animation: flicker 5s infinite alternate, float 6s ease-in-out infinite;
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .flame-icon:hover {
          transform: scale(1.2);
          filter: drop-shadow(0 0 12px #f59e0b);
          animation: flicker 2s infinite alternate, float 6s ease-in-out infinite;
        }

        @keyframes flicker {
          0%, 100% {
            opacity: 1;
            text-shadow: 0 0 8px #f59e0b, 0 0 15px #f59e0b, 0 0 20px #f59e0b;
          }
          25% {
            opacity: 0.9;
            text-shadow: 0 0 12px #f59e0b, 0 0 20px #f59e0b, 0 0 30px #f59e0b;
          }
          50% {
            opacity: 0.95;
            text-shadow: 0 0 15px #f59e0b, 0 0 25px #f59e0b, 0 0 35px #f59e0b;
          }
          75% {
            opacity: 0.92;
            text-shadow: 0 0 18px #f59e0b, 0 0 28px #f59e0b, 0 0 38px #f59e0b;
          }
        }

        /* 响应式过渡 */
        .w-auto {
          transition: width 0.3s ease-in-out;
        }
        .text-sm {
          transition: opacity 0.3s ease;
        }

        /* 悬停效果 */
        .cursor-pointer:hover .text-sm {
          opacity: 0.8;
        }

        /* 文本溢出 */
        .truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        /* 防止图标缩小 */
        .shrink-0 {
          flex-shrink: 0;
        }

        /* 打字机效果 */
        .typewriter {
          border-right: 2px solid;
          animation: cursor 0.8s infinite;
        }

        @keyframes cursor {
          from, to {
            border-color: transparent;
          }
          50% {
            border-color: currentColor;
          }
        }

        /* 文本样式 */
        .text-sm {
          letter-spacing: 0.05em;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* 计时器进度 */
        .timer-progress {
          width: 100%;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .timer-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.1s linear;
          border-radius: 3px;
        }

        /* 音乐控制 */
        .music-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .music-progress {
          flex-grow: 1;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          position: relative;
          cursor: pointer;
        }

        .music-progress:hover {
          height: 8px;
        }

        .music-progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          width: 0%;
          border-radius: 3px;
        }

        .music-time {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        /* 笔记编辑器 */
        .note-editor {
          width: 100%;
          min-height: 120px;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
          color: inherit;
          resize: none;
          outline: none;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          transition: all 0.2s ease;
        }

        .note-editor:focus {
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        /* 设置切换 */
        .settings-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* 平滑过渡 */
        .transition-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 按钮样式 */
        .btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background-color: #2563eb;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        /* 图标按钮 */
        .icon-btn {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .icon-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        /* 快速操作 */
        .quick-actions {
          display: flex;
          gap: 8px;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        /* 天气图标动画 */
        .weather-icon {
          animation: float 8s ease-in-out infinite;
        }

        /* 脉冲动画 */
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        /* 自定义滚动条 */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* 涟漪效果 */
        .ripple {
          position: relative;
          overflow: hidden;
        }

        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      </style>

      <div id="app" class="${this.options.darkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'
      } text-white min-h-screen flex items-center justify-center p-4">
        <div id="floating-island" class="w-full max-w-md mx-auto">
          <!-- 灵动岛 -->
          <div
            id="island-container"
            class="fixed left-1/2 -translate-x-1/2 top-4 z-50 cursor-pointer w-auto min-w-[200px] max-w-[400px]">
            <div
              class="backdrop-blur-lg border rounded-2xl shadow-xl overflow-hidden transition-all duration-300 h-auto bg-black/60 border-gray-700/50 hover:border-gray-600/50">
              <div
                class="px-4 h-14 flex items-center justify-between overflow-hidden text-white">
                <div class="flex items-center gap-4 min-w-0 flex-1">
                  ${this.getIconHtml()}
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col">
                      <span class="text-sm font-medium truncate">${this.getTitle()}</span>
                      <span class="text-xs opacity-75 truncate">${this.getSubtitle()}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  ${this.getControlsHtml()}
                </div>
              </div>
              ${this.getExpandedContentHtml()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getIconHtml() {
    switch (this.options.currentType) {
      case "music":
        return `<img src="${this.options.music.info.cover}" class="w-8 h-8 rounded-lg object-cover shrink-0 shadow-md" />`;
      case "timer":
        return `<i class="fas fa-clock text-2xl shrink-0 ${this.options.timer.isRunning ? "text-blue-400 pulse" : ""
          }"></i>`;
      case "note":
        return `<i class="fas fa-sticky-note text-2xl shrink-0 text-yellow-400"></i>`;
      case "weather":
        return `<i class="fas fa-cloud-sun text-2xl shrink-0 weather-icon text-amber-300"></i>`;
      case "settings":
        return `<i class="fas fa-cog text-2xl shrink-0 text-gray-400 animate-spin" style="animation-duration: 3s"></i>`;
      default:
        return `<i class="fas fa-bell text-2xl shrink-0 ${this.options.notification.actions.length
          ? "text-red-400 animate-bounce"
          : ""
          }" style="animation-duration: 2s"></i>`;
    }
  }

  getTitle() {
    let title = "";
    switch (this.options.currentType) {
      case "notification":
        title = this.options.notification.title;
        break;
      case "music":
        title = this.options.music.info.title;
        break;
      case "timer":
        title = "Timer";
        break;
      case "note":
        title = "Quick Note";
        break;
      case "weather":
        title = "Weather";
        break;
      case "settings":
        title = "Settings";
        break;
      default:
        title = "Notification";
    }
    return title;
  }

  getSubtitle() {
    let subtitle = "";
    switch (this.options.currentType) {
      case "notification":
        subtitle = this.options.notification.actions
          .map((a) => a.text)
          .join(" · ");
        break;
      case "music":
        subtitle = this.options.music.info.artist;
        break;
      case "timer":
        subtitle = this.formatTime(this.options.timer.time);
        break;
      case "note":
        subtitle = "Click to edit";
        break;
      case "weather":
        subtitle = this.options.weather.location;
        break;
      case "settings":
        subtitle = "App preferences";
        break;
      default:
        subtitle = "";
    }
    return subtitle;
  }

  getControlsHtml() {
    if (!this.options.expanded) {
      let controls = "";
      switch (this.options.currentType) {
        case "music":
          controls += `
            <div class="flex items-center gap-2">
              <button class="icon-btn ripple" onclick="event.stopPropagation(); island.toggleMusicPlay()">
                <i class="fas ${this.options.music.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
              </button>
            </div>
          `;
          break;
        case "timer":
          controls += `
            <div class="flex items-center gap-2">
              <button class="icon-btn ripple" onclick="event.stopPropagation(); island.toggleTimer()">
                <i class="fas ${this.options.timer.isRunning ? 'fa-pause' : 'fa-play'}"></i>
              </button>
            </div>
          `;
          break;
      }
      return controls;
    } else {
      return `
        <button class="icon-btn" onclick="event.stopPropagation(); island.toggleExpand()">
          <i class="fas fa-chevron-up transition-transform duration-300"></i>
        </button>
      `;
    }
  }

  getExpandedContentHtml() {
    if (!this.options.expanded) return "";

    let content = "";
    switch (this.options.currentType) {
      case "notification":
        content = this.getNotificationContentHtml();
        break;
      case "music":
        content = this.getMusicContentHtml();
        break;
      case "timer":
        content = this.getTimerContentHtml();
        break;
      case "note":
        content = this.getNoteContentHtml();
        break;
      case "weather":
        content = this.getWeatherContentHtml();
        break;
      case "settings":
        content = this.getSettingsContentHtml();
        break;
    }

    return `
      <div class="px-4 pb-4">
        <div class="border-t pt-1 border-gray-700/50">
          <div class="mt-1 flex justify-center">
            <div class="quick-actions">
              <button class="icon-btn ripple" onclick="event.stopPropagation(); island.switchToType('notification')">
                <i class="fas fa-bell"></i>
              </button>
              <button class="icon-btn ripple" onclick="event.stopPropagation(); island.switchToType('music')">
                <i class="fas fa-music"></i>
              </button>
              <button class="icon-btn ripple" onclick="event.stopPropagation(); island.switchToType('timer')">
                <i class="fas fa-clock"></i>
              </button>
              <button class="icon-btn ripple" onclick="event.stopPropagation(); island.switchToType('note')">
                <i class="fas fa-sticky-note"></i>
              </button>
              <button class="icon-btn ripple" onclick="event.stopPropagation(); island.switchToType('weather')">
                <i class="fas fa-cloud-sun"></i>
              </button>
              <button class="icon-btn ripple" onclick="event.stopPropagation(); island.switchToType('settings')">
                <i class="fas fa-cog"></i>
              </button>
            </div>
          </div>
          ${content}
        </div>
      </div>
    `;
  }

  getNotificationContentHtml() {
    return `
      <div class="mt-4 space-y-4">
        <div class="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
          <i class="fas fa-envelope mt-1 text-blue-400"></i>
          <div>
            <h4 class="text-sm font-medium">New Message</h4>
            <p class="text-xs opacity-75 mt-1">You have a new message from John Doe</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
          <i class="fas fa-calendar-check mt-1 text-green-400"></i>
          <div>
            <h4 class="text-sm font-medium">Event Reminder</h4>
            <p class="text-xs opacity-75 mt-1">Team meeting in 15 minutes</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
          <i class="fas fa-bell mt-1 text-yellow-400"></i>
          <div>
            <h4 class="text-sm font-medium">System Alert</h4>
            <p class="text-xs opacity-75 mt-1">Your storage is almost full</p>
          </div>
        </div>
        <div class="flex space-x-3 mt-3">
          ${this.options.notification.actions
        .map(
          (action) => `
              <button class="btn btn-secondary ripple flex-1" onclick="event.stopPropagation(); island.handleAction('${action.text}')">
                ${action.text}
              </button>
            `
        )
        .join("")}
        </div>
      </div>
    `;
  }

  getMusicContentHtml() {
    const progressPercent =
      (this.options.music.currentTime / this.options.music.duration) * 100;

    return `
      <div class="mt-4 flex items-center gap-4">
        <img src="${this.options.music.info.cover}" class="w-16 h-16 rounded-lg object-cover shadow-md" />
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-medium truncate">${this.options.music.info.title}</h3>
          <p class="text-xs opacity-75 truncate">${this.options.music.info.artist}</p>
        </div>
      </div>
      <div class="mt-4 music-controls">
        <button class="icon-btn ripple" onclick="event.stopPropagation(); island.skipBackward()">
          <i class="fas fa-backward"></i>
        </button>
        <button class="icon-btn ripple bg-blue-600 hover:bg-blue-700" onclick="event.stopPropagation(); island.toggleMusicPlay()">
          <i class="fas ${this.options.music.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
        </button>
        <button class="icon-btn ripple" onclick="event.stopPropagation(); island.skipForward()">
          <i class="fas fa-forward"></i>
        </button>
      </div>
      <div class="mt-4">
        <div class="music-progress" onclick="event.stopPropagation(); island.seekMusic(event)">
          <div class="music-progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        <div class="flex justify-between text-xs mt-1">
          <span class="music-time">${this.formatTime(this.options.music.currentTime)}</span>
          <span class="music-time">${this.formatTime(this.options.music.duration)}</span>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2">
        <button class="icon-btn ripple" onclick="event.stopPropagation(); island.setVolume(25)">
          <i class="fas fa-volume-down"></i>
        </button>
        <button class="icon-btn ripple" onclick="event.stopPropagation(); island.setVolume(50)">
          <i class="fas fa-volume"></i>
        </button>
        <button class="icon-btn ripple" onclick="event.stopPropagation(); island.setVolume(75)">
          <i class="fas fa-volume-up"></i>
        </button>
      </div>
    `;
  }

  getTimerContentHtml() {
    const progressPercent =
      ((this.options.timer.initialTime - this.options.timer.time) /
        this.options.timer.initialTime) *
      100;

    return `
      <div class="mt-4 text-center">
        <div class="text-5xl font-mono font-medium">${this.formatTime(
      this.options.timer.time
    )}</div>
        <div class="mt-6 flex justify-center gap-3">
          <button class="btn btn-primary ripple flex-1" onclick="event.stopPropagation(); island.toggleTimer()">
            ${this.options.timer.isRunning ? "Pause" : "Start"}
          </button>
          <button class="btn btn-secondary ripple flex-1" onclick="event.stopPropagation(); island.resetTimer()">
            Reset
          </button>
        </div>
        <div class="mt-6">
          <div class="timer-progress">
            <div class="timer-progress-bar" style="width: ${progressPercent}%"></div>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-3 gap-3">
          <button class="btn btn-secondary ripple" onclick="event.stopPropagation(); island.setTimer(300)">
            5 min
          </button>
          <button class="btn btn-secondary ripple" onclick="event.stopPropagation(); island.setTimer(900)">
            15 min
          </button>
          <button class="btn btn-secondary ripple" onclick="event.stopPropagation(); island.setTimer(1800)">
            30 min
          </button>
        </div>
      </div>
    `;
  }

  getNoteContentHtml() {
    return `
      <div class="mt-4">
        <textarea class="note-editor" placeholder="Type your note here...">${this.options.note.content}</textarea>
      </div>
      <div class="mt-3 flex justify-end gap-3">
        <button class="btn btn-secondary ripple" onclick="event.stopPropagation(); island.clearNote()">
          Clear
        </button>
        <button class="btn btn-primary ripple" onclick="event.stopPropagation(); island.saveNote()">
          Save Note
        </button>
      </div>
    `;
  }

  getWeatherContentHtml() {
    return `
      <div class="mt-4 flex items-center gap-4">
        <i class="fas fa-cloud-sun text-5xl weather-icon text-amber-300"></i>
        <div>
          <h3 class="text-2xl font-medium">${this.options.weather.temp}°C</h3>
          <p class="text-sm opacity-75">${this.options.weather.condition}</p>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center gap-2">
            <i class="fas fa-tint text-blue-400"></i>
            <span>Humidity</span>
          </div>
          <div class="mt-2 text-lg font-medium">${this.options.weather.humidity}%</div>
        </div>
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center gap-2">
            <i class="fas fa-wind text-blue-400"></i>
            <span>Wind</span>
          </div>
          <div class="mt-2 text-lg font-medium">${this.options.weather.wind} km/h</div>
        </div>
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center gap-2">
            <i class="fas fa-temperature-low text-red-400"></i>
            <span>Feels Like</span>
          </div>
          <div class="mt-2 text-lg font-medium">${this.options.weather.temp + 2}°C</div>
        </div>
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center gap-2">
            <i class="fas fa-map-marker-alt text-green-400"></i>
            <span>Location</span>
          </div>
          <div class="mt-2 text-lg font-medium">${this.options.weather.location}</div>
        </div>
      </div>
      <div class="mt-6">
        <button class="btn btn-primary ripple w-full" onclick="event.stopPropagation(); island.refreshWeather()">
          <i class="fas fa-sync-alt mr-2"></i> Refresh
        </button>
      </div>
    `;
  }

  getSettingsContentHtml() {
    return `
      <div class="mt-4 space-y-1">
        <div class="settings-toggle">
          <div class="flex items-center gap-3">
            <i class="fas fa-moon text-purple-400"></i>
            <span>Dark Mode</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" ${this.options.settings.darkMode ? 'checked' : ''} onchange="event.stopPropagation(); island.toggleSetting('darkMode')">
            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div class="settings-toggle">
          <div class="flex items-center gap-3">
            <i class="fas fa-running text-blue-400"></i>
            <span>Animations</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" ${this.options.settings.animations ? 'checked' : ''} onchange="event.stopPropagation(); island.toggleSetting('animations')">
            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div class="settings-toggle">
          <div class="flex items-center gap-3">
            <i class="fas fa-volume-up text-green-400"></i>
            <span>Sound</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" ${this.options.settings.sound ? 'checked' : ''} onchange="event.stopPropagation(); island.toggleSetting('sound')">
            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div class="settings-toggle">
          <div class="flex items-center gap-3">
            <i class="fas fa-bell text-yellow-400"></i>
            <span>Notifications</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" ${this.options.settings.notifications ? 'checked' : ''} onchange="event.stopPropagation(); island.toggleSetting('notifications')">
            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <div class="mt-6">
        <button class="btn btn-primary ripple w-full" onclick="event.stopPropagation(); island.showSystemInfo()">
          <i class="fas fa-info-circle mr-2"></i> System Info
        </button>
      </div>
    `;
  }

  // 格式化时间（秒转为分钟:秒）
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  // API 方法
  show() {
    const container = document.getElementById(this.options.containerId);
    container.style.display = 'block';
  }

  hide() {
    const container = document.getElementById(this.options.containerId);
    container.style.display = 'none';
  }

  toggle() {
    const container = document.getElementById(this.options.containerId);
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }

  expand() {
    this.options.expanded = true;
    this.options.onExpand();
    this.render();
  }

  collapse() {
    this.options.expanded = false;
    this.options.onCollapse();
    this.render();
  }

  toggleExpand() {
    this.options.expanded = !this.options.expanded;
    if (this.options.expanded) {
      this.options.onExpand();
    } else {
      this.options.onCollapse();
    }
    this.render();
  }

  switchToType(type) {
    this.options.currentType = type;
    this.options.onModeChange(type);
    this.render();
  }

  updateNotification(title, content, actions) {
    if (title !== undefined) this.options.notification.title = title;
    if (content !== undefined) this.options.notification.content = content;
    if (actions !== undefined) this.options.notification.actions = actions;
    if (this.options.currentType === 'notification') {
      this.render();
    }
  }

  updateMusic(isPlaying, currentTime, duration, info) {
    if (isPlaying !== undefined) this.options.music.isPlaying = isPlaying;
    if (currentTime !== undefined) this.options.music.currentTime = currentTime;
    if (duration !== undefined) this.options.music.duration = duration;
    if (info !== undefined) this.options.music.info = info;
    if (this.options.currentType === 'music') {
      this.render();
    }
  }

  updateTimer(time, initialTime, isRunning) {
    if (time !== undefined) this.options.timer.time = time;
    if (initialTime !== undefined) this.options.timer.initialTime = initialTime;
    if (isRunning !== undefined) this.options.timer.isRunning = isRunning;
    if (this.options.currentType === 'timer') {
      this.render();
    }
  }

  updateNote(content) {
    if (content !== undefined) this.options.note.content = content;
    if (this.options.currentType === 'note') {
      this.render();
    }
  }

  updateWeather(condition, temp, humidity, wind, location) {
    if (condition !== undefined) this.options.weather.condition = condition;
    if (temp !== undefined) this.options.weather.temp = temp;
    if (humidity !== undefined) this.options.weather.humidity = humidity;
    if (wind !== undefined) this.options.weather.wind = wind;
    if (location !== undefined) this.options.weather.location = location;
    if (this.options.currentType === 'weather') {
      this.render();
    }
  }

  updateSettings(darkMode, animations, sound, notifications) {
    if (darkMode !== undefined) this.options.settings.darkMode = darkMode;
    if (animations !== undefined) this.options.settings.animations = animations;
    if (sound !== undefined) this.options.settings.sound = sound;
    if (notifications !== undefined) this.options.settings.notifications = notifications;
    if (this.options.currentType === 'settings') {
      this.render();
    }
  }

  // 内部方法
  toggleMusicPlay() {
    this.options.music.isPlaying = !this.options.music.isPlaying;
    if (this.options.currentType === 'music') {
      this.render();
    }
  }

  skipBackward() {
    this.options.music.currentTime = Math.max(0, this.options.music.currentTime - 15);
    if (this.options.currentType === 'music') {
      this.render();
    }
  }

  skipForward() {
    this.options.music.currentTime = Math.min(
      this.options.music.duration,
      this.options.music.currentTime + 15
    );
    if (this.options.currentType === 'music') {
      this.render();
    }
  }

  seekMusic(event) {
    const progressBar = event.currentTarget;
    const clickPosition =
      event.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const seekPercentage = (clickPosition / progressBarWidth) * 100;
    this.options.music.currentTime = Math.floor(
      (seekPercentage / 100) * this.options.music.duration
    );
    if (this.options.currentType === 'music') {
      this.render();
    }
  }

  setVolume(volume) {
    // 在实际应用中，这个方法应该控制实际的音量
    console.log(`Volume set to ${volume}%`);
  }

  toggleTimer() {
    this.options.timer.isRunning = !this.options.timer.isRunning;

    if (this.options.timer.isRunning) {
      // 开始计时器
      this.options.timerInterval = setInterval(() => {
        if (this.options.timer.time > 0) {
          this.options.timer.time--;
          this.render();
        } else {
          clearInterval(this.options.timerInterval);
          this.options.timer.isRunning = false;
          console.log("Timer finished!");
          this.render();
        }
      }, 1000);
    } else {
      // 暂停计时器
      if (this.options.timerInterval) {
        clearInterval(this.options.timerInterval);
      }
    }

    if (this.options.currentType === 'timer') {
      this.render();
    }
  }

  resetTimer() {
    this.options.timer.time = this.options.timer.initialTime;
    this.options.timer.isRunning = false;
    if (this.options.timerInterval) {
      clearInterval(this.options.timerInterval);
    }
    if (this.options.currentType === 'timer') {
      this.render();
    }
  }

  setTimer(seconds) {
    this.options.timer.initialTime = seconds;
    this.options.timer.time = seconds;
    this.options.timer.isRunning = false;
    if (this.options.timerInterval) {
      clearInterval(this.options.timerInterval);
    }
    if (this.options.currentType === 'timer') {
      this.render();
    }
  }

  clearNote() {
    const textarea = document.querySelector(".note-editor");
    if (textarea) {
      textarea.value = "";
      this.options.note.content = "";
    }
  }

  saveNote() {
    const textarea = document.querySelector(".note-editor");
    if (textarea) {
      this.options.note.content = textarea.value;
      console.log("Note saved successfully!");
      this.render();
    }
  }

  refreshWeather() {
    // 模拟API调用
    this.options.weather.temp = Math.round(Math.random() * 10 + 20); // 20-30°C
    this.options.weather.humidity = Math.round(Math.random() * 30 + 50); // 50-80%
    this.options.weather.wind = Math.round(Math.random() * 20 + 5); // 5-25 km/h

    const conditions = ["Sunny", "Cloudy", "Partly Cloudy", "Rainy", "Thunderstorm"];
    this.options.weather.condition = conditions[Math.floor(Math.random() * conditions.length)];

    if (this.options.currentType === 'weather') {
      this.render();
    }
  }

  toggleSetting(setting) {
    this.options.settings[setting] = !this.options.settings[setting];

    if (setting === "darkMode") {
      this.options.darkMode = this.options.settings.darkMode;
      document.body.classList.toggle("dark", this.options.darkMode);
      document.body.classList.toggle("bg-gray-900", this.options.darkMode);
      document.body.classList.toggle("bg-gray-100", !this.options.darkMode);
      document.body.classList.toggle("text-white", this.options.darkMode);
      document.body.classList.toggle("text-black", !this.options.darkMode);
    }

    if (this.options.currentType === 'settings') {
      this.render();
    }
  }

  showSystemInfo() {
    console.log(
      `System Information:
      Platform: ${navigator.platform}
      User Agent: ${navigator.userAgent}
      Screen: ${window.screen.width}x${window.screen.height}`
    );
  }

  handleAction(actionText) {
    const action = this.options.notification.actions.find(
      (a) => a.text === actionText
    );
    if (action && action.handler) {
      action.handler();
    }
  }
}

// 全局实例
let island;

// 初始化示例
window.onload = function () {
  island = new FloatingIsland('floating-island-container', {
    defaultType: 'notification',
    defaultExpanded: true,
    darkMode: true
  });
};