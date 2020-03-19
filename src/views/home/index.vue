<template>
  <div class="container">
    <!-- 1- 放置tabs组件 -->
    <van-tabs>
      <!-- 2- 放置子标签，title值为当前显示内容 -->
      <!-- van-tab时候vant组件的样式 -->
      <!-- 拿到channels数据之后，按要求填入 -->
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 生成若干个单元格 -->
        <!-- 有多少tab 就有多少个articlelist实例 -->
        <!-- 需要将频道id传递给每一个列表组件：父=>子(props) -->
        <ArticleList :channel_id="item.id"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 4- 放置一个小图标 -->
    <span class="bar_btn">
      <!-- 放入vant图标 -->
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
// 获取频道数据
import { getMyChannels } from '@/api/channels'
export default {
  name: 'Home',
  components: {
    ArticleList
  },
  data () {
    return {
      channels: [] // 接收频道数据
    }
  },
  methods: {
    async getMyChannels () {
      const data = await getMyChannels() // data接收返回的数据结果
      // 将返回的数据赋值给data中的数据
      this.channels = data.channels
    }
  },
  created () {
    // 直接调用获取频道数据的方法
    this.getMyChannels()
  }
}
</script>

<style lang='less' scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
