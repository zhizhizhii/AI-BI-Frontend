import Vue from 'vue'
import VueRouter from 'vue-router'
import getPageTitle from '@/utils/get-page-title'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import("@/views/layout"),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import("@/views/home"),
        meta:{ title:"主页" }
      },
      {
        path: '/person',
        name: 'person',
        component: () => import("@/views/person"),
        meta:{ title: "人物查询" }
      }, 
      {
        path: '/org',
        name: 'organization',
        component: () => import("@/views/organization"),
        meta:{ title: "企业查询" }
      }, 
      {
        path:'/personinfo',
        name:'personinfo',
        component: () => import("@/views/personinfo")
      },
      {
        path:'/orginfo',
        name:'orginfo',
        component: () => import("@/views/orginfo")
      },
      {
        path:'/fileupload',
        name:'fileupload',
        component: () => import("@/views/fileupload")
      },
      {
        path:'/multisearch',
        name:'multisearch',
        component: () => import("@/views/multisearch")
      }
    ]
  },

]

const router = new VueRouter({
  routes
})

router.beforeEach(async(to, from, next) => {
  document.title = getPageTitle(to.meta.title);
  next();
})

export default router
