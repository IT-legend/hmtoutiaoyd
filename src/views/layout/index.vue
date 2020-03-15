<template>
  <div class="container">
    <!-- 1-导航组件 采用Vant组件导航 fixed表示固定-->
    <!-- 当页面地址是/user的时候应该隐藏顶部栏 用v-if-->
    <van-nav-bar title="黑马头套" right-text="搜索" fixed v-if="$route.path !== '/user'" @click-right="$router.push('/search')"></van-nav-bar>
    <!-- 2-放置二级路由容器 -->
    <!-- 判断当前地址如果是/user，就给一个noTop Class -->
    <div class="my-wrapper" :class="{noTop: $route.path==='/user'}">
      <router-view></router-view>
    </div>
    <!-- 3-标签栏组件 -->
    <!-- 父标签添加route属性表示开启路由模式 子标签直接to+地址即可实现跳转-->
    <van-tabbar route>
      <!-- 点击导航标签 并跳转路由 -->
      <van-tabbar-item icon='bag-o' to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="music-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="smile-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {

}
</script>

<style lang='less' scoped>
  .container{
  width: 100%;
  height: 100%;
  position: relative;
  // 控制二级路由容器的高宽属性
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
