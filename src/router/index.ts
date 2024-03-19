import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/main',
      component: HomeView,
      children: [
        {
          path: '/main',
          meta:{title:'光云-首页'},
          component: () => import('../views/secondMenu/MainPage.vue')
        },
        {
          path: '/transport',
          meta:{title:'光云-传输'},
          component: () => import('../views/secondMenu/Transport.vue')
        },
        {
          path: '/share',
          meta:{title:'光云-分享'},
          component: () => import('../views/secondMenu/Share.vue')
        },
        {
          path: '/recycle',
          meta:{title:'光云-回收站'},
          component: () => import('../views/secondMenu/RecycleBin.vue')
        }
      ]
    },{
      path: '/login',
      name: 'login',
      meta:{title:'光云-登录'},
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue')
    },{
      path: '/shareView/:shareId',
      name: 'shareView',
      meta:{title:'光云-提取文件'},
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ShareView.vue')
    }
  ]
})

router.beforeEach((to, from) => {
  document.title = to.meta.title as string||'LightCloud'
})

export default router
