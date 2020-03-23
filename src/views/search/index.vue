<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索组件 -->
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容 ：当输入框有内容时 显示联想 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <span>java</span>
      </van-cell>
    </van-cell-group>
    <!-- 历史记录部分 所有搜索记录都会在这里展示 输入框无内容时，这里显示-->
    <!-- <div class="history-box" v-if="!q"> -->
    <div class="history-box" v-else>
      <!-- 如果没有历史记录，就隐藏掉这个单元格 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <van-icon name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 需要把这个位置变成动态的真实数据 -->
        <van-cell v-for="(item,index) in historyList" :key="index">
          <!-- 显示循环内容 -->
          <a class="word_btn">{{ item }}</a>
          <!-- 给按钮注册删除历史记录方法 -->
          <van-icon class="close_btn" slot="right-icon" name="cross"
          @click="delHistory(index)"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'heima-94-history' // 此key用来作为历史记录在本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字的数据
      // 当data初始化时会读取后面的数据
      historyList: JSON.parse(localStorage.getItem(key) || '[]') // 定义接收历史记录数据的空变量
    }
  },
  methods: {
    // 删除历史
    delHistory (index) {
      // 先在data中删除 然后将data中的数据同步到本地缓存中
      this.hostoryList.splice(index, 1) // 直接删除对应的历史记录数据，还要将数据同步到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
    }
  }
  // created () {
  //   // 钩子函数实例初始化之后 读取本地缓存数据
  //   this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  // }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
