<template>
  <div class="container">
    <!-- 1- 放置tabs组件 默认绑定激活页签-->
    <van-tabs v-model="activeIndex">
      <!-- 2- 放置子标签，title值为当前显示内容 -->
      <!-- van-tab时候vant组件的样式 -->
      <!-- 拿到channels数据之后，按要求填入 -->
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 生成若干个单元格 -->
        <!-- 有多少tab 就有多少个articlelist实例 -->
        <!-- 需要将频道id传递给每一个列表组件：父=>子(props) -->
        <!-- 监听article-list触发的showAction事件 -->
        <!-- 监听谁就给谁的标签写 -->
        <ArticleList :channel_id="item.id" @showAction="openAction"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 4- 放置一个小图标 -->
    <span class="bar_btn">
      <!-- 放入vant图标 -->
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 放置一个弹层组件van-popup -->
    <van-popup v-model="showMoreAction" style="width:80%">
      <!-- 放置反馈的组件 -->
      <!-- 应该在此位置监听more-article触发的事件 -->
      <MoreAction @dislike="dislikeArticle"/>
    </van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
// 获取频道数据
import { getMyChannels } from '@/api/channels'
// 直接在父级组件中引入反馈组件 并完成注册
import MoreAction from './components/more-action'
import { dislikeArticle } from '@/api/articles' // 不感兴趣接口
import eventbus from '@/utils/eventbus' // 引入公共事件的处理器
export default {
  name: 'Home',
  components: {
    ArticleList,
    MoreAction
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 是否显示弹层，默认不显示组件
      articleId: null, // 用来接收点击文章的id
      activeIndex: 0 // 当前默认激活的页面0
    }
  },
  methods: {
    async getMyChannels () {
      const data = await getMyChannels() // data接收返回的数据结果
      // 将返回的数据赋值给data中的数据
      this.channels = data.channels
    },
    // 此方法会在article-list组件触发，showAction的时候触发
    openAction (artId) {
      // 此时应该弹出反馈层
      this.showMoreAction = true
      // 应该把id给存储起来
      this.articleId = artId
    },
    // 对文章不感兴趣的方法
    async dislikeArticle () {
      // 调接口
      try {
        await dislikeArticle({
          target: this.articleId // 不感兴趣的id
        })
        // await下面的逻辑是resolve成功之后的
        this.$wnotify({
          type: 'success',
          message: '操作成功'
        })
        // 成功后应该触发一个事件 通过eventbus的广播机制将对应的tab中的数据删除
        // 出了传一个文章之外，还需要告诉现在处于哪个频道，可以传递频道id
        // this.channels[this.activeIndex].id 就是当前激活的频道数据
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id) // 坚挺了这个事件组件 就要根据id来删除数据
        // 最后：操作成功后关闭弹层显示内容
        this.showMoreAction = false
      } catch (error) {
        // 默认是红色
        this.$wnotify({
          message: '操作失败'
        })
      }
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
