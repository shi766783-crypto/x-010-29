<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTravelStore } from './stores/travel'
import AchievementToast from './components/common/AchievementToast.vue'

const route = useRoute()
const store = useTravelStore()

const navItems = [
  { path: '/dashboard', label: '出行看板' },
  { path: '/plans', label: '出行计划' },
  { path: '/achievements', label: '成就徽章' },
  { path: '/leaderboard', label: '排行榜' },
  { path: '/profile', label: '个人中心' },
]

const unlockedCount = computed(() => store.achievements.filter((a) => a.unlocked).length)
const totalTrips = computed(() => store.plans.length)

// 运行时检测新解锁徽章；启动基线已在 store.load() 中静默建立，不会补发历史提醒
watch(
  () => store.achievements,
  () => store.syncAchievementToasts()
)
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-logo">旅</span>
        <div class="brand-text">
          <strong>出行管家</strong>
          <small>家庭出行规划</small>
        </div>
      </div>

      <nav class="nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <span class="nav-dot"></span>{{ item.label }}
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="mini-stat">
          <span>出行次数</span>
          <strong>{{ totalTrips }}</strong>
        </div>
        <div class="mini-stat">
          <span>已解锁徽章</span>
          <strong>{{ unlockedCount }}/12</strong>
        </div>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <h1 class="page-title">{{ route.meta.title || '出行看板' }}</h1>
      </header>
      <div class="content">
        <router-view />
      </div>
    </main>

    <AchievementToast />
  </div>
</template>
