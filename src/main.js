import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useTravelStore } from './stores/travel'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化：先从 localStorage 恢复数据，再订阅变更自动持久化并检测徽章解锁
const store = useTravelStore(pinia)
store.load()
store.$subscribe(
  () => {
    store.persist()
    store.syncAchievementNotices()
  },
  { detached: true }
)

app.mount('#app')
