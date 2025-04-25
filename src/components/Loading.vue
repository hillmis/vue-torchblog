<!-- Loading.vue -->
<template>
  <div class="loading-container" :class="{ 'full-screen': fullScreen }">
    <div class="loading-spinner">
      <div class="torch-icon">
        <i class="fas fa-fire"></i>
      </div>
      <div class="loading-text">{{ text || '加载中...' }}</div>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: ''
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-container.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  z-index: 9999;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.torch-icon {
  font-size: 2rem;
  color: var(--accent);
  animation: torch-flicker 2s infinite;
}

@keyframes torch-flicker {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    text-shadow: 0 0 8px var(--accent);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.95);
    text-shadow: 0 0 4px var(--accent);
  }
}

.loading-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.loading-dots {
  display: flex;
  gap: 0.25rem;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--accent);
  animation: dots-bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dots-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .torch-icon,
  .loading-dots span {
    animation: none;
  }
  
  .torch-icon {
    opacity: 0.8;
  }
  
  .loading-dots span {
    opacity: 0.5;
  }
}
</style>