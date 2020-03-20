
// 此文件专门处理小函数和vue中常用的过滤器以及函数
import dayjs from 'dayjs' // 引入dayjs插件
import relativeTime from 'dayjs/plugin/relativeTime'
// dayjs不会自动引入语言包，默认只支持英文语言包
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime) // 相当于dayjs扩展相当于时间的方法 这样dayjs就有了from方法
export default {
  // 导出默认对象
  install (Vue) {
    // 此方法会在Vue.use时被调用
    // 执行此行代码时，Vue.protopype.$notify应该已经挂载完成了
    Vue.prototype.$wnotify = (params) => Vue.prototype.$notify({ duration: 1000, ...params })
    // 给Vue的原型属性赋值一个函数，函数名自定义
    Vue.prototype.$sleep = sleep // 定义原型属性叫$sleep，所有的组件都可以使用这个属性了
    // 要用到之前学过的过滤器
    // Vue.filter('过滤器名称','过滤器函数')
    Vue.filter('relTime', relTime) // 注册全局过滤器
  }
}

// 1-定义一个休眠函数
// time = 1000 表示直接设置了默认值
function sleep (time = 1000) {
  // 需要返回一个promise
  return new Promise(function (resolve, reject) {
    // 肯定是成功执行，但是需要一个延迟
    setTimeout(() => resolve(), time)
  })
}

// 2-定义转化日期函数
function relTime (date) {
  // dayjs()生成当前时间 .form（）就代表当前时间距离日期时间有多远
  // 对dayjs进行本地语言包的转化
  return dayjs().locale('zh-cn').from(date) // from中的值是日期或者dayjs得到的日期
}
