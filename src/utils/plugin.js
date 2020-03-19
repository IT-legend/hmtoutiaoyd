
// 此文件专门处理小函数和vue中常用的过滤器以及函数

export default {
  // 导出默认对象
  install (Vue) {
    // 此方法会在Vue.use时被调用
    // 执行此行代码时，Vue.protopype.$notify应该已经挂载完成了
    Vue.prototype.$wnotify = (params) => Vue.prototype.$notify({ duration: 1000, ...params })
    // 给Vue的原型属性赋值一个函数，函数名自定义
    Vue.prototype.$sleep = sleep // 定义原型属性叫$sleep，所有的组件都可以使用这个属性了
  }
}

// 定义一个休眠函数
// time = 1000 表示直接设置了默认值
function sleep (time = 1000) {
  // 需要返回一个promise
  return new Promise(function (resolve, reject) {
    // 肯定是成功执行，但是需要一个延迟
    setTimeout(() => resolve(), time)
  })
}
