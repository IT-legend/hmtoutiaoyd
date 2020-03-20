<template>
  <!-- 这里放置div目的是形成滚动条 因为我们后期要做阅读记忆-->
  <!-- van-list可以帮助我们实现上拉加载，需要一些变量 -->
  <div class="scroll-wrapper">
    <!-- 文章列表 -->
    <!-- van-list组件如果我们不干涉它，它初始化完毕就会自动检测距离底部的长度，如果超过了限定，就会自动执行load加载事件，会自动把绑定的loading的值变为true -->
    <!-- 1- 我们应该用下拉刷新组件 包裹 整个列表组件 因为刷新是整个列表都要刷新 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <!-- 2- 列表组件 -->
      <van-list v-model="uploading" @load="onload" :finished="finished" finished-text="没有数据了">
        <!-- 3- 循环内容 用van-cell单元格实现-->
        <van-cell-group>
          <!-- 此时art_id并不是一个数字而是一个大数字对象，v-for的key需要用字符串或者数字，所以会报错 -->
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <!-- 4- 放置元素 文章列表的循环项：无图、单图、三图 -->
            <!-- 4-1 三图文章 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <!-- 此时需要根据当前的封面类型决定显示单图三图还是无图 -->
              <!-- 三张图片 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <!-- 图片组件用的是vant组件库中的图片组件，需要使用该组件完成图片的懒加载 -->
                <van-image class="w33" fit="cover" :src="item.cover.images[0]"></van-image>
                <van-image class="w33" fit="cover" :src="item.cover.images[1]"></van-image>
                <van-image class="w33" fit="cover" :src="item.cover.images[2]"></van-image>
              </div>
              <!-- 单图模式 暂时隐藏-->
              <div class="img_box" v-if="item.cover.type === 1">
                <van-image class="w100" fit="cover" :src="item.cover.images[0]"></van-image>
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}</span>
                <span>{{ item.pubdate | relTime }}</span>
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
// 引入请求文章列表的api模块
import { getArticles } from '@/api/articles'
export default {
  data () {
    return {
      successText: '', // 定义下拉刷新成功的文本
      downLoading: false, // 定义下拉刷新状态 表示是否正在下拉刷新
      uploading: false, // 表示是否开启了上拉加载，默认值是false
      finished: false, // 表示是否已经完成所有数据的加载
      articles: [], // 文章列表数据，用来存放时局
      timestamp: null // 定义一个时间戳 用来存储历史时间戳
    }
  },
  // props: ['channel_id'], // 字符串数组的接收数据方式 比较简单 易于上手
  // 第二种接收数据方式：props：{跟对象}
  props: {
    // key（属性名）：value（对象 配置）
    // props对象形式 可以约束传入的值 必须填
    channel_id: {
      required: true, // 此属性的含义是：要求该props必须传
      type: Number, // 表示要传入的prop属性的类型
      default: null // 默认值的意思，假如没有传入prop属性，默认值就会被采用
    }
  },
  methods: {
    // 1- onload会自动执行的
    // 上拉加载方法
    async onload () {
      console.log('开始加载文章列表数据')
      // 这里要往文章列表数组中添加数据，使其撑满，load就会停止，那么如何快速生成一个数组呢？
      // 如果数据已经加载完毕，应该把finished设置为true，表示一切结束了，不再请求
      // 此时强制判断总条数如果超过100条，就直接关闭
      // 第一次加载必须让list出现滚动条，没有滚动条就无法继续向下拉
      // if (this.articles.length > 50) {
      //   // 如果此时记录已经大于50
      //   this.finished = true // 关闭加载
      // } else {
      //   const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
      //   // 上拉加载数据，不是覆盖，而是追加到数组的尾上
      //   this.articles.push(...arr)
      //   // 添加完数据，直接手动关掉loading加载
      //   this.uploading = false
      // }
      // 下面这么写是无法停止刷新的
      // 如果想关掉，必须将全部数据加载完毕的finished属性值改为true
      // 如果有数据，应该把数据加到list中，再结束加载
      // setTimeout(() => {
      //   this.finished = true // 表示 数据已经加载完毕，没有数据了
      // }, 1000)
      await this.$sleep() // 人为的控制了请求的时间，让用户强制等待
      const data = await getArticles({
        // 指的是当前的频道id
        channel_id: this.channel_id,
        // this.timestamp是当前时间戳，有就用，否则用date历史时间戳
        // 短路表达式：前面true后面不执行，前面false后面才执行
        timestamp: this.timestamp || Date.now()
      }) // 获取当前的频道id
      // 将数据追加到队尾
      this.articles.push(...data.results) // 这里data必须加三个点，将数组结构成一条一条的数据后再放入新数组再添加到页面中去，如不结构加载就会一卡一卡的
      // 关闭加载状态
      this.uploading = false
      // 需要将历史时间戳给timestamp 但是赋值之前有个判断：要判断一下历史时间戳是否为0
      // 如果历史时间戳为0，说明已经没有历史数据了，应该宣布结束 将finished为true
      if (data.pre_timestamp) {
        // 如果有历史时间戳 表示还有数据可以进行加载
        this.timestamp = data.pre_timestamp
      } else {
        // 时间戳为0表示没有数据可以求了
        this.finished = true
      }
    },
    // 2- 定义下拉刷新数据方法
    async onRefresh () {
      await this.$sleep() // 人为的控制了请求的时间，让用户强制等待
      // 下拉刷新要做什么事情？
      // 下拉刷新要发送最新的时间戳
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now()// !-永远传最新的时间戳-!
      })
      // 下拉成功后应该手动关闭下拉刷新的状态
      this.downLoading = false
      // 此时需要判断 最新的时间戳能否换来数据
      // 如果能，就用新数据替换全部旧数据
      // 如果不能 就提示：暂时没有新闻
      if (data.results.length) {
        // 有返回数据，替换整个articles
        this.articles = data.results
        // 此时已经全部覆盖了，但是假如已经拉到了顶端，就意味着之前的finished已经是true了
        if (data.pre_timestamp) {
          // 因为下拉刷新换了一波新的数据 里面有历史时间戳
          this.finished = false // 唤醒数据，可以继续上拉加载
          // 并且记录当前新的时间戳给变量
          this.timestamp = data.pre_timestamp
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果换不来新的数据
        this.successText = '当前数据已是最新的'
      }
      // setTimeout(() => {
      //   // 下拉刷新，表示要读取最新的数据，而且最新的数据要添加到数据的头部
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   // 数组添加到头部的方法：unshift追加
      //   this.articles.unshift(...arr)
      //   // 添加后手动关闭正在加载的状态
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
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
