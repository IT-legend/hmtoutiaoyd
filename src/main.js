import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 引入我们自定义的导航守卫
import store from './store'
import Vant from 'vant' // 引入vant组件库
import 'vant/lib/index.less' // 引入vant组件的样式（这里改成less，因为我们需要修改某些样式变量）
import 'amfe-flexible' // 引入rem适配包
import '@/styles/index.less' // 引入自定义全局样式
Vue.use(Vant) // 注册vant组件
// 以上做法是完整导入Vant的模式，以后优化代码时可以按需导入
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
