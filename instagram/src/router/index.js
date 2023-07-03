import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }, 
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: ProfileView
    }
  ]
})

export default router
