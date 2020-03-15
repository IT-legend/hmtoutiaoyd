import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 用按需加载的方式配置路由
const Layout = () => import('@/views/layout') // 按需引入一级路由
const home = () => import('@/views/home') // 按需引入二级路由
const question = () => import('@/views/question') // 按需引入二级路由
const video = () => import('@/views/video') // 按需引入二级路由
const user = () => import('@/views/user') // 按需引入二级路由
// 建立其它一级路由
const chat = () => import('@/views/user/chat') // 小智同学
const profile = () => import('@/views/user/profile') // 编辑资料
const login = () => import('@/views/login') // 登录模块
const search = () => import('@/views/search') // 搜索中心
const searchresult = () => import('@/views/search/result') // 搜索结果
const article = () => import('@/views/article') // 文章中心
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout, // 布局组件，一级路由
    // 将二级路由挂载到一级路由下
    children: [
      {
        path: '',
        component: home
      },
      {
        path: '/question',
        component: question
      },
      {
        path: '/video',
        component: video
      },
      {
        path: '/user',
        component: user
      }
    ]
  },
  {
    path: '/user/chat', // 一级路由小智
    component: chat
  },
  {
    path: '/login', // 一级路由登陆模块
    component: login
  },
  {
    path: '/user/profile', // 一级路由编辑资料
    component: profile
  },
  {
    path: '/search', // 一级路由搜索页面
    component: search
  },
  {
    path: '/search/result', // 一级路由搜索页面返回值
    component: searchresult
  },
  {
    path: '/article', // 一级路由文章详情
    component: article
  }

]

const router = new VueRouter({
  routes
})

export default router
