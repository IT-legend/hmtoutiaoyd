<template>
<!-- 这里放置div目的是形成滚动条 因为我们后期要做阅读记忆-->
    <!-- van-list可以帮助我们实现上拉加载，需要一些变量 -->
  <div class="scroll-wrapper">
      <!-- 文章列表 -->
      <!-- van-list组件如果我们不干涉它，它初始化完毕就会自动检测距离底部的长度，如果超过了限定，就会自动执行load加载事件，会自动把绑定的loading的值变为true -->
      <!-- 1- 下拉刷新组件 包裹 列表组件 -->
      <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
        <!-- 2- 列表组件 -->
        <van-list v-model="uploading" @load="onload" :finished='finished' finished-text="没有数据了">
          <!-- 3- 循环内容 -->
          <van-cell-group>
            <van-cell v-for="item in articles" :key="item">
              <!-- 4- 放置元素 文章列表的循环项 无图、单图、三图 -->
              <div class="article_item">
                <!-- 标题 -->
                <h3 class="van-ellipsis">啦啦啦德玛西亚</h3>
                <!-- 三张图片 -->
                <div class="img_box">
                  <!-- 图片组件用的是vant的图片组件，需要使用该组件完成图片的懒加载 -->
                  <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"></van-image>
                  <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"></van-image>
                  <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"></van-image>
                </div>
                <!-- 单图 展示隐藏掉 -->
                <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"></van-image>
                <!-- 作者信息 -->
                <div class="info_b">
                  <span>cc</span>
                  <span>1w+评论</span>
                  <span>10分钟前</span>
                  <span class="close">
                    <van-icon name="cross"></van-icon>
                  </span>
                </div>
              </div>
            </van-cell>
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
  </div>
</template>

<script>
// import { getArticles } from '@/api/articles'
export default {
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 下载刷新状态 表示是否正在下拉刷新
      uploading: false, // 表示是否开启了上拉加载，默认值是false
      finished: false, // 表示是否已经完成所有数据的加载
      articles: [], // 文章列表数据
      timestamp: null // 定义一个时间戳 用来存储历史时间戳
    }
  },
  // props: ['channel_id'], // 字符串数组 接收方式 比较简单 易于上手
  props: {
    channel_id: {
      required: true, // 此属性的含义是：要求该props必须传
      type: Number, // 表示要传入的prop属性的类型
      default: null // 默认值的意思，假如没有传入prop属性，默认值就会被采用
    }
  },
  methods: {
    // 1- onload会自动执行的
    // 上拉加载方法
    onload () {
      console.log('开始加载数据')
      // 这里要往文章列表数组中添加数据，使其撑满，load就会停止，那么如何快速生成一个数组呢？
      // 如果数据已经加载完毕，应该把finished设置为true，表示一切结束了，不再请求
      // 此时强制判断总条数如果超过100条，就直接关闭
      if (this.articles.length > 50) {
        // 如果此时记录已经大于50
        this.finished = true // 关闭加载
      } else {
        const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
        // 上拉加载数据，不是覆盖，而是追加到数组的尾上
        this.articles.push(...arr)
        // 添加完数据，直接手动关掉loading
        this.uploading = false
      }

      // 如果想关掉，必须将全部数据加载完毕的finished属性值改为true
      // 如果有数据，应该把数据加到list中，再结束加载
      // setTimeout(() => {
      //   this.finished = true // 表示 数据已经加载完毕，没有数据了
      // }, 1000)
    },
    // 2- 下拉刷新数据方法
    onRefresh () {
      setTimeout(() => {
        // 下拉刷新，表示要读取最新的数据，而且最新的数据要添加到数据的头部
        const arr = Array.from(Array(2), (value, index) => '追加' + (index + 1))
        // 数组添加到头部
        this.articles.unshift(...arr)
        // 手动关闭正在加载的状态
        this.downLoading = false
        this.successText = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
