// 需要导出一个对象
module.exports = {
  // 需要更改less中变量的配置
  css: {
    // css相关
    loaderOptions: {
      // 所有关于样式loader的相关选项
      less: {
        //   这里的选项写什么呢?
        // modifyVars 是less-loader的一个选项，通过这个选项可以改变变量的值，完成我们的样式替换
        modifyVars: {
          // 直接修改覆盖变量，变量名不需要@
          blue: '#3296fa'
        }
      }
    }
  }
}
