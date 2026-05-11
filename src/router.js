import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/p/:slug', name: 'project', component: Home, props: true }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    const togglingModal =
      (to.name === 'home' && from.name === 'project') ||
      (to.name === 'project' && from.name === 'home') ||
      (to.name === 'project' && from.name === 'project')
    if (togglingModal) return undefined
    return { top: 0 }
  }
})
