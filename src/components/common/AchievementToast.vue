<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTravelStore } from '../../stores/travel'

const DURATION = 5000

const store = useTravelStore()
const router = useRouter()
const timer = ref(null)

function clearTimer() {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
}

function restartTimer() {
  clearTimer()
  timer.value = setTimeout(dismiss, DURATION)
}

function dismiss() {
  clearTimer()
  store.dismissAchievementToast()
}

// 点击提醒主体跳转到成就页
function openAchievements() {
  clearTimer()
  store.dismissAchievementToast()
  router.push('/achievements')
}

watch(
  () => store.currentAchievementToast,
  (toast) => {
    clearTimer()
    if (toast) {
      // 悬停时暂停自动消失；用户也可随时手动关闭
      restartTimer()
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="achievement-toast">
      <div
        v-if="store.currentAchievementToast"
        class="achievement-toast"
        role="status"
        @mouseenter="clearTimer"
        @mouseleave="restartTimer"
      >
        <div
          class="achievement-toast__icon"
          :style="{ background: store.currentAchievementToast.color }"
        >
          {{ store.currentAchievementToast.glyph }}
        </div>
        <div class="achievement-toast__body" @click="openAchievements">
          <span class="achievement-toast__label">解锁新徽章</span>
          <strong class="achievement-toast__name">
            {{ store.currentAchievementToast.name }}
          </strong>
          <span class="achievement-toast__desc">
            {{ store.currentAchievementToast.description }}
          </span>
        </div>
        <button
          type="button"
          class="achievement-toast__close"
          aria-label="关闭提醒"
          @click.stop="dismiss"
        >
          ×
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.achievement-toast {
  position: fixed;
  top: 76px;
  right: 28px;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 296px;
  padding: 14px 12px 14px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
}

.achievement-toast__icon {
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 19px;
  font-weight: 700;
}

.achievement-toast__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-right: 4px;
  cursor: pointer;
}

.achievement-toast__label {
  font-size: 12px;
  color: var(--primary);
  font-weight: 500;
}

.achievement-toast__name {
  font-size: 15px;
  font-weight: 600;
}

.achievement-toast__desc {
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.achievement-toast__close {
  flex: none;
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  color: var(--text-muted);
  padding: 0 2px;
}

.achievement-toast__close:hover {
  color: var(--text);
}

.achievement-toast-enter-active,
.achievement-toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.achievement-toast-enter-from,
.achievement-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 900px) {
  .achievement-toast {
    right: 12px;
    left: 76px;
    width: auto;
  }
}
</style>
