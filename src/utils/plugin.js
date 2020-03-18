// 此文件专门处理小函数和vue中常用的过滤器以及函数

export default {
  // 导出默认对象
  install (Vue) {
    // 此方法会在Vue.use时被调用
    // 执行此行代码时，Vue.protopype.$notify应该已经挂载完成了
    Vue.prototype.$wnotify = (params) => Vue.prototype.$notify({ duration: 1000, ...params })
    // 给Vue的原型属性赋值一个函数，函数名自定义
  }
}
