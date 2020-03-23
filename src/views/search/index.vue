<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索组件 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容 ：当输入框有内容时 显示联想 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell v-for="(item,index) in suggestList" :key="index" icon="search" @click="toResult(item)">
        <span>{{ item }}</span>
      </van-cell>
    </van-cell-group>
    <!-- 历史记录部分 所有搜索记录都会在这里展示 输入框无内容时，这里显示-->
    <!-- <div class="history-box" v-if="!q"> -->
    <div class="history-box" v-else>
      <!-- 如果没有历史记录，就隐藏掉这个单元格 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <!-- 清空历史记录按钮 注册点击事件 -->
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 需要把这个位置变成动态的真实数据 -->
        <van-cell @click="toResult(item)" v-for="(item,index) in historyList" :key="index">
          <!-- 显示循环内容 -->
          <a class="word_btn">{{ item }}</a>
          <!-- 给按钮注册删除历史记录方法 -->
          <!-- 此时事件冒泡了，需要阻止冒泡，vue中用修饰符直接阻止事件冒泡 -->
          <van-icon class="close_btn" slot="right-icon" name="cross"
          @click.stop="delHistory(index)"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 引入获取联想搜索建议api
import { getSuggestion } from '@/api/articles'
const key = 'heima-94-history' // 此key用来作为历史记录在本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字的数据
      // 当data初始化时会读取后面的数据
      historyList: JSON.parse(localStorage.getItem(key) || '[]'), // 定义接收历史记录数据的空变量
      suggestList: [] // 联想的搜索建议
    }
  },
  watch: {
    // 一：防抖写法
    // q () {
    //   // 我们要在这个位置，去请求接口，但是事件触发的太频繁给服务器压力太大，所以要降低触发函数的频率
    //   clearTimeout(this.timer) // 先清除掉定时器
    //   // 实现防抖函数
    //   this.timer = setTimeout(async () => {
    //     // 需要判断当清空的时候不能发送请求 但是要把联想的建议同时清空
    //     if (!this.q) {
    //       // 表示搜索关键字无内容应该清空候选
    //       this.suggestList = []
    //       return // 直接停止
    //     }
    //     // 此函数中需要请求联想搜索的建议
    //     // 联想搜索的建议，需要放置在一个变量中
    //     const data = await getSuggestion({ q: this.q })
    //     this.suggestList = data.options // 将返回的词条的options赋值给当前的联想建议
    //   }, 300)
    // }
    // 二：节流写法
    q () {
      if (!this.timer) {
        // 要求300毫秒执行一次
        this.timer = setTimeout(async () => {
          // 先将标记设置为空
          this.timer = null
          if (!this.q) {
          // 表示搜索关键字无内容应该清空候选
            this.suggestList = []
            return // 直接停止
          }
          // 此函数中需要请求联想搜索的建议
          // 联想搜索的建议，需要放置在一个变量中
          const data = await getSuggestion({ q: this.q })
          this.suggestList = data.options // 将返回的词条的options赋值给当前的联想建议
        }, 500)
      }
    }
  },
  methods: {
    // 到结果页
    toResult (text) {
      // 应该也把这个text 放到历史记录
      this.historyList.push(text) // 加到历史记录
      // 有可能重复
      this.historyList = Array.from(new Set(this.historyList)) // 去重
      // 设置到本地缓存中
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 将历史记录设置到缓存
      // 并且跳转到搜索结果
      this.$router.push({ path: '/serach/result', query: { q: text } })
    },
    // 删除历史
    delHistory (index) {
      // 先在data中删除 然后将data中的数据同步到本地缓存中
      this.historyList.splice(index, 1) // 直接删除对应的历史记录数据，还要将数据同步到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 跳转到搜索结果页
    // toSerachResult (text) {
    //   // 如何实现跳转
    //   // this.$router 是路由对象实例
    //   // this.$route 是当前路由页面对象的信息 当前的地址啊、params参数、query参数、fullPath等等
    //   // 这里需要路由传参
    //   // 方法一 直接地址拼接传参
    //   // this.$router.push('/search/result?q=' + text)
    //   // 方法二 采用对象传参形式
    //   this.$router.push({
    //     path: '/search/result',
    //     query: { q: text }
    //   })
    // },
    // 清空历史记录
    async clear () {
      // 本身也支持promise
      try {
        await this.$dialog.confirm({
          title: 'warning',
          message: 'Are you sure？'
        })
        // 成功就执行下面代码，将本地历史记录设置为空
        this.historyList = []
        // 将本地缓存中的记录也清空
        localStorage.setItem(key, '[]')
      } catch (error) {
        // 不需要设置
      }
    },
    onSearch () {
      // 首先判断 搜索内容是否为空 为空直接返回
      if (!this.q) return
      // 跳转之前，需要把搜索结果q添加到历史记录中，并且同步到本地缓存去 这里要去重set
      this.historyList.push(this.q)
      // 一行代码搞定去重
      this.historyList = Array.from(new Set(this.historyList))
      // 设置到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 搜索事件触发的时候，应该跳转到搜索结果页，并且携带参数
      this.$router.push({
        path: '/search/result',
        query: { q: this.q }
      })
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
