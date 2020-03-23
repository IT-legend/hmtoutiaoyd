<template>
  <div class="container">
    <!-- 导航 显示返回箭头 -->
    <!-- click-left点击左侧事件 返回上层页面-->
    <!-- fixed属性 将导航栏固定在顶部 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
    <!-- 放置搜索结果列表 实现上拉加载的功能-->
    <van-list v-model="upLoading" @load="onLoad" :finished="finished">
      <van-cell-group>
        <!-- 文章列表固定结构 -->
        <van-cell v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ item.title }}</h3>
            <div class="img_box" v-if="item.cover.type === 3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type === 1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ item.aut_name }}</span>
              <span>{{ item.comm_count}}</span>
              <!-- 用我们封装的过滤器处理时间 -->
              <span>{{ item.pubdate | relTime }}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import * as Articles from '@/api/articles'
export default {
  data () {
    return {
      upLoading: false, // 上拉加载状态
      finished: false, // 表示当前加载是否全部完成 如果完成就设置成true
      articles: [], // 专门放置搜索结果文章
      page: {
        page: 1, // 当前第几页
        per_page: 10 // 每页多少条
      }
    }
  },
  methods: {
    // 该方法会在滚动条到底部的时候执行
    async onLoad () {
      // 加载数据 调接口
      const { q } = this.$route.query // 获取query参数
      const data = await Articles.searchAticle({ ...this.page, q })
      // 得到的结果 应该追加到articles数据的最后面
      this.articles.push(...data.results) // 解构数据再追加到队尾
      // 关闭上拉加载的状态
      this.upLoading = false
      // 如何判断我们的数据已经全部拿过来了呢？
      // 接口并没有告诉我们什么时候结束，但我们可以根据 当前返回数据是否 有记录来判断 是否还有 下一页数据
      if (data.results.length) {
        // 有下一页数据
        this.page.page++ // 有下一页应该把页码切换到下一页
      } else {
        // 没有数据了
        this.finished = true // 没有数据了
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
