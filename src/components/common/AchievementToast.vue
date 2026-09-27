<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { useTravelStore } from '../../stores/travel'

const store = useTravelStore()
const notices = computed(() => store.pendingUnlockNotices)

// 轻量提醒：展示数秒后自动关闭，也可手动关闭
const AUTO_DISMISS_MS = 6000
let timer = null

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

watch(notices, (list) => {
  clearTimer()
  if (list.length) {
    timer = setTimeout(() => store.dismissUnlockNotices(), AUTO_DISMISS_MS)
  }
})

onBeforeUnmount(clearTimer)
</script>

<template>
  <Teleport to="body">
    <transition name="unlock-toast">
      <div v-if="notices.length" class="unlock-toast">
        <div class="unlock-toast-head">
          <strong>🎉 解锁新徽章</strong>
          <button
            type="button"
            class="unlock-toast-close"
            aria-label="关闭"
            @click="store.dismissUnlockNotices()"
          >
            ×
          </button>
        </div>
        <div v-for="a in notices" :key="a.id" class="unlock-toast-item">
          <span class="unlock-toast-icon" :style="{ background: a.color }">{{ a.glyph }}</span>
          <div class="unlock-toast-text">
            <strong>{{ a.name }}</strong>
            <small>{{ a.description }}</small>
          </div>
        </div>
        <router-link
          class="unlock-toast-link"
          to="/achievements"
          @click="store.dismissUnlockNotices()"
        >
          查看成就徽章 →
        </router-link>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.unlock-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 300px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 14px 16px;
  z-index: 200;
}

.unlock-toast-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.unlock-toast-close {
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  color: var(--text-secondary);
}

.unlock-toast-close:hover {
  color: var(--text);
}

.unlock-toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.unlock-toast-item + .unlock-toast-item {
  margin-top: 10px;
}

.unlock-toast-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.unlock-toast-text {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
}

.unlock-toast-text small {
  color: var(--text-secondary);
}

.unlock-toast-link {
  display: inline-block;
  margin-top: 10px;
  font-size: 13px;
  color: var(--primary);
}

.unlock-toast-enter-active,
.unlock-toast-leave-active {
  transition: all 0.25s ease;
}

.unlock-toast-enter-from,
.unlock-toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
