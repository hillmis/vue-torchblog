<template>
  <div class="article-outline">
    <h3 class="font-bold text-lg mb-4">文章大纲</h3>
    <ul class="space-y-2">
      <li v-for="(item, index) in outline" 
          :key="index" 
          :class="{'pl-4': item.level === 3}"
      >
        <a :href="`#${item.id}`" 
           :class="['outline-link', { 'active': activeId === item.id }]"
           @click.prevent="scrollTo(item.id)"
        >
          {{ item.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ArticleOutline',
  props: {
    outline: {
      type: Array,
      required: true,
      default: () => []
    },
    activeId: {
      type: String,
      default: ''
    }
  },
  emits: ['scroll-to'],
  methods: {
    scrollTo(id) {
      this.$emit('scroll-to', id)
    }
  }
}
</script>

<style scoped>
.article-outline {
  @apply p-4 bg-bg-secondary rounded-lg;
}

.outline-link {
  @apply block py-1 px-2 rounded transition-all duration-300 text-text-secondary hover:text-text-primary hover:bg-blue-900/30;
  position: relative;
}

.outline-link.active {
  @apply text-accent bg-blue-900/20;
}

.outline-link.active::before {
  content: '';
  position: absolute;
  left: -0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.25rem;
  height: 1rem;
  background-color: var(--accent);
  border-radius: 0.125rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .article-outline {
    @apply p-3;
    max-height: calc(100vh - 8rem);
    overflow-y: auto;
  }

  .outline-link {
    @apply py-2;
  }

  .outline-link:active {
    @apply bg-blue-900/30;
  }
}

/* 平滑滚动效果 */
.article-outline {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
</style>
