<template>
  <transition name="island">
    <div class="fixed left-1/2 -translate-x-1/2 top-2 z-50 cursor-pointer"
         :class="{
           'w-[55px]': !hasContent && !expanded,
           'w-auto min-w-[120px] max-w-[300px]': hasContent && !expanded && !shouldAutoExpand,
           'w-auto min-w-[200px] max-w-[400px]': expanded || shouldAutoExpand
         }">
      <div class="backdrop-blur-lg border rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
           :class="{
             'h-12': !expanded,
             'h-auto': expanded,
             'bg-white/80 border-gray-200': !isDarkMode,
             'bg-black/80 border-gray-800': isDarkMode
           }"
           @click="handleMainClick">
        
        <!-- 基础状态 -->
        <div class="px-4 h-12 flex items-center justify-between overflow-hidden"
             :class="{'text-black': !isDarkMode, 'text-white': isDarkMode}">
          <div class="flex items-center gap-4 min-w-0 flex-1">
            <!-- 图标区域 -->
            <i v-if="defaultIcon" class="fas fa-fire text-2xl flame-icon shrink-0"></i>
            <img v-else-if="type === 'music'" :src="musicInfo.cover" class="w-8 h-8 rounded-lg object-cover shrink-0" />
            <i v-else class="fas fa-bell text-2xl shrink-0"></i>
            
            <!-- 文字内容区域 -->
            <div class="flex-1 min-w-0">
              <div v-if="hasContent" class="flex flex-col">
                <!-- 主要文字 -->
                <span ref="textContent" class="text-sm font-medium truncate">
                  {{ title || (type === 'music' ? `${musicInfo.title} - ${musicInfo.artist}` : content) }}
                </span>
                <!-- 次要文字（如有） -->
                <span v-if="actions.length" class="text-xs opacity-75 truncate">
                  {{ actions.map(a => a.text).join(' · ') }}
                </span>
              </div>
              <!-- 打字机效果 -->
              <span v-else-if="!hasContent" 
                    ref="textContent" 
                    class="text-sm font-medium typewriter">
                {{ displayText }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center gap-3 shrink-0">
            <!-- 音乐控制按钮（未展开状态） -->
            <div v-if="type === 'music' && !expanded" class="flex items-center gap-2">
              <button class="hover:text-primary-500 transition-colors" @click.stop="togglePlay">
                <i :class="['fas', isPlaying ? 'fa-pause' : 'fa-play']"></i>
              </button>
            </div>
            <!-- 展开/收起箭头 -->
            <i v-if="expanded || shouldAutoExpand" 
               :class="['fas', expanded ? 'fa-chevron-up' : 'fa-chevron-up', 'transition-transform duration-300']"
               @click.stop="handleArrowClick">
            </i>
          </div>
        </div>

        <!-- 展开状态内容保持不变 -->
        <div v-if="expanded" class="px-4 pb-4">
          <div class="border-t pt-3"
               :class="{'border-gray-200': !isDarkMode, 'border-gray-700': isDarkMode}">
            <!-- 音乐播放器 -->
            <div v-if="type === 'music'" class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <img :src="musicInfo.cover" class="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <div class="font-medium">{{ musicInfo.title }}</div>
                    <div class="text-sm opacity-75">{{ musicInfo.artist }}</div>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <button class="hover:text-primary-500 transition-colors" @click.stop="previousTrack">
                    <i class="fas fa-step-backward"></i>
                  </button>
                  <button class="hover:text-primary-500 transition-colors" @click.stop="togglePlay">
                    <i :class="['fas', isPlaying ? 'fa-pause' : 'fa-play']"></i>
                  </button>
                  <button class="hover:text-primary-500 transition-colors" @click.stop="nextTrack">
                    <i class="fas fa-step-forward"></i>
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <div class="h-1 bg-bg-secondary rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 transition-all duration-300"
                       :style="{ width: `${progress}%` }"></div>
                </div>
                <div class="flex justify-between text-xs opacity-75">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span>{{ formatTime(duration) }}</span>
                </div>
              </div>
            </div>

            <!-- 通知消息 -->
            <div v-if="type === 'notification'" class="space-y-3">
              <div class="text-sm leading-relaxed">{{ content }}</div>
              <div v-if="actions.length" class="flex space-x-3">
                <button v-for="action in actions" 
                        :key="action.text"
                        class="px-3 py-1 rounded-full text-sm bg-primary-500/10 hover:bg-primary-500/20 transition-colors"
                        @click.stop="action.handler">
                  {{ action.text }}
                </button>
              </div>
            </div>

            <!-- 进度指示器 -->
            <div v-if="showProgress" class="mt-3">
              <div class="h-1 bg-bg-secondary rounded-full overflow-hidden">
                <div class="h-full bg-primary-500 transition-all duration-300"
                     :style="{ width: `${progress}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isVisible: true, // 修改为默认可见
      expanded: false,
      type: 'notification',
      status: 'info',
      title: '',
      content: '',
      actions: [],
      showProgress: false,
      progress: 0,
      // 音乐播放相关
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      musicInfo: {
        cover: '',
        title: '',
        artist: ''
      },
      isDarkMode: true, // 默认深色模式
      observer: null,
      defaultIcon: true, // 控制默认图标显示
      typewriterText: "Hello World", // 要显示的文字
      displayText: "", // 当前显示的文字
      typewriterInterval: null,
      shouldAutoExpand: false,
      textWidth: 0,
      containerWidth: 400, // 默认容器宽度
      hasContent: false, // 新增：是否有实际内容
    }
  },
  watch: {
    // 监听内容变化
    '$data': {
      handler(newData) {
        this.hasContent = !!(newData.title || newData.content || 
                            (newData.type === 'music' && newData.musicInfo.title))
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 监听主题变化
    this.observer = new MutationObserver(this.checkTheme)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    // 初始化主题
    this.checkTheme()
    this.startTypewriter()
    // 添加窗口大小改变监听
    window.addEventListener('resize', this.checkTextOverflow)
  },
  beforeUnmount() {
    // 清理观察器
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval)
    }
    window.removeEventListener('resize', this.checkTextOverflow)
  },
  methods: {
    startTypewriter() {
      // 只在没有实际内容时启动打字机效果
      if (this.hasContent) {
        this.displayText = this.typewriterText
        return
      }
      let index = 0
      this.displayText = ""
      if (this.typewriterInterval) {
        clearInterval(this.typewriterInterval)
      }
      
      this.typewriterInterval = setInterval(() => {
        if (index < this.typewriterText.length) {
          this.displayText += this.typewriterText[index]
          index++
        } else {
          // 重置动画
          setTimeout(() => {
            if (!this.hasContent) { // 确保仍然没有内容时才重置
              index = 0
              this.displayText = ""
            }
          }, 100) // 等待2秒后重新开始
        }
      }, 150) // 每个字符的打字间隔
    },
    show(options) {
      this.type = options.type || 'notification'
      this.status = options.status || 'info'
      this.title = options.title || ''
      this.content = options.content || ''
      this.actions = options.actions || []
      this.showProgress = options.showProgress || false
      this.progress = options.progress || 0
      this.musicInfo = options.musicInfo || this.musicInfo
      this.isVisible = true
      this.expanded = options.expanded || false
      this.defaultIcon = !options.title
      this.hasContent = true // 更新内容状态
      if (options.duration) {
        setTimeout(() => {
          this.hide()
        }, options.duration)
      }
      if (this.typewriterInterval) {
        clearInterval(this.typewriterInterval)
      }
    },
    hide() {
      this.expanded = false
      this.title = ''
      this.content = ''
      this.type = 'notification'
      this.hasContent = false
      this.defaultIcon = true
      // 重新启动打字机效果
      this.startTypewriter()
    },
    checkTextOverflow() {
      const textElement = this.$refs.textContent
      if (!textElement) return
      // 获取文本实际宽度
      this.textWidth = textElement.scrollWidth
      
      // 如果文本宽度超过容器宽度，自动展开
      this.shouldAutoExpand = this.textWidth > (this.containerWidth - 100) // 100px 用于预留图标和间距
    },
    toggleExpand() {
      if (this.shouldAutoExpand && !this.expanded) {
        // 只有在自动展开且未手动展开的状态下才自动收起
        this.shouldAutoExpand = false
        this.expanded = false
      } else {
        // 手动点击切换展开状态
        this.expanded = !this.expanded
        // 如果收起，同时重置自动展开状态
        if (!this.expanded) {
          this.shouldAutoExpand = false
        }
      }
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    // 音乐控制
    togglePlay() {
      this.isPlaying = !this.isPlaying
      this.$emit('toggle-play')
    },
    previousTrack() {
      this.$emit('previous-track')
    },
    nextTrack() {
      this.$emit('next-track')
    },
    updateProgress(value) {
      this.progress = value
    },
    checkTheme() {
      this.isDarkMode = document.documentElement.classList.contains('dark-mode')
    },
    handleMainClick() {
      // 点击主体区域只能展开
      if (!this.expanded) {
        this.expanded = true
      }
    },
    handleArrowClick() {
      // 点击箭头按钮时切换展开/收起状态
      this.expanded = !this.expanded
      // 如果收起，同时重置自动展开状态
      if (!this.expanded) {
        this.shouldAutoExpand = false
      }
    },
  }
}
</script>

<style scoped>
.island-enter-active,
.island-leave-active {
  transition: all 0.3s ease;
}
.island-enter-from,
.island-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
/* 玻璃拟态效果 */
.backdrop-blur-lg {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
/* 添加高度过渡效果 */
.backdrop-blur-lg {
  transition: height 0.3s ease-in-out, background-color 0.3s ease;
}
/* 设置展开状态的最小内边距 */
.h-auto {
  min-height: 3rem;
  padding-bottom: 1rem;
}
/* 适配深色模式的阴影 */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.dark-mode .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
              0 4px 6px -2px rgba(0, 0, 0, 0.2);
}
/* 火把动效 */
.flame-icon {
  color: #f59e0b;
  animation: flicker 3s infinite alternate;
}
@keyframes flicker {
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 8px #f59e0b,
                 0 0 15px #f59e0b,
                 0 0 20px #f59e0b;
  }
  25% {
    opacity: 0.8;
    text-shadow: 0 0 4px #f59e0b,
                 0 0 10px #f59e0b;
  }
  50% {
    opacity: 0.9;
    text-shadow: 0 0 6px #f59e0b,
                 0 0 12px #f59e0b,
                 0 0 18px #f59e0b;
  }
}
/* 自适应过渡 */
.w-auto {
  transition: width 0.3s ease-in-out;
}
.text-sm {
  transition: opacity 0.3s ease;
}
/* 添加文字悬停效果 */
.cursor-pointer:hover .text-sm {
  opacity: 0.8;
}
/* 文字溢出处理 */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
/* 确保图标不被压缩 */
.shrink-0 {
  flex-shrink: 0;
}
/* 打字机效果相关样式 */
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
/* 优化文字显示 */
.text-sm {
  letter-spacing: 0.05em;
  font-family: 'Courier New', Courier, monospace;
}
</style>