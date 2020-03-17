// 此文件是 导航守卫
import router from '@/router' // 先引入路由实例
import store from '@/store' // 引入store对象
// 前置守卫
// 路由发生变化即执行
router.beforeEach(function (to, from, next) {
  // 判断请求地址和token
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 如果以user开头，需要拦截，让它去登陆
    next({
      path: '/login', // 跳转地址
      query: {
        // 告诉登陆页，我之前没完成的访问，登录后请跳转回去
        // fullPath是完整的路径，会带？后面的参数
        redirectUrl: to.fullPath
      }
    })
  } else {
    //   如果不是，直接放行
    next()
  }
})
