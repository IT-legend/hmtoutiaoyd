// 此文件专门处理postcss插件
// 所有写法都是固定的，不可更改
module.exports = {
  // 所有的postcss插件
  plugins: {
    //   自动给css样式加前缀的属性
    autoprefixer: {},
    'postcss-pxtorem': {
      // 基准值
      rootValue: 37.5,
      propList: ['*'] // 包含哪些文件，所有的都转化rem
    }
  }
}
