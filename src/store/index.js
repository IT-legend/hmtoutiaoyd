// 此js文件，专门处理vuex中的模块
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth' // 引入自己封装的获取token方法
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // state中专门来放置需要共享的状态
    user: auth.getUser() // user对象就是token信息对象，如果要做持久化，初始不能给null，应该要读取缓存中是否有token
  },
  // 要修改token只能通过mutations
  mutations: {
    // 1-修改token
    updateUser (state, payload) {
      state.user = payload.user // 定义载荷中的新user数据赋值给state
      // 更新vuex的时候，也应该将最新的数据，存入本地缓存state中
      auth.setUser(payload.user) // 保持vuex和本地存储的同步
    },
    // 2-删除token
    delUser (state) {
      state.user = {} // 将state中的token设为空对象
      // 缓存中的数据也要更新，所以调取auth中的方法直接删除缓存中的数据即可
      auth.delUser()
    }
  },
  actions: {
  },
  modules: {
  }
})
