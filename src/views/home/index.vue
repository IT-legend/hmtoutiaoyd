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
    <!-- 4- 在tabs下放置一个小图标=>编辑频道的图标 -->
    <span class="bar_btn" @click="showChannelEdit = true">
      <!-- 放入vant图标 -->
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 放置一个弹层组件van-popup -->
    <van-popup v-model="showMoreAction" style="width:80%">
      <!-- 放置反馈的组件 -->
      <!-- 应该在此位置监听more-article触发的事件 -->
      <!-- 不喜欢文章和举报文章用一个方法 -->
      <!-- @事件名="方法名"  @事件名="方法名()" @事件名="方法名($event 参数)" @事件名="逻辑" -->
        <!-- $event 是事件参数 在h5标签中 dom元素的事件参数  自定义事件中$event 就是自定义事件传出的第一个参数 -->
      <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)"/>
    </van-popup>
    <!-- 频道编辑组件放在弹出面板的组件上 -->
    <van-action-sheet v-model="showChannelEdit" title="编辑频道" :round="false">
      <!-- 放置频道编辑组件 -->
      <!-- 此时将父组件的频道数据传递给了子组件 -->
      <ChannelEdit :channels="channels" @selectChannel='selectChannel'></ChannelEdit>
    </van-action-sheet>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
// 获取频道数据
import { getMyChannels } from '@/api/channels'
// 直接在父级组件中引入反馈组件 并完成注册
import MoreAction from './components/more-action'
import { dislikeArticle, reportArticle } from '@/api/articles' // 不感兴趣接口
import eventbus from '@/utils/eventbus' // 引入公共事件的处理器
import ChannelEdit from './components/channel-edit' // 引入编辑频道组件
export default {
  name: 'Home',
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit // 完成组件注册
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 是否显示弹层，默认不显示组件
      articleId: null, // 用来接收点击文章的id
      activeIndex: 0, // 当前默认激活的页面0
      showChannelEdit: false // 是否显示频道编辑组件，默认隐藏
    }
  },
  methods: {
    // 当子组件触发selectChannel时，触发这个方法，获取到了子组件中的item.id
    // selectChannel (id) {
    //   // alert(id)
    //   // 拿到id后 需要找到id对应得频道索引
    //   const index = this.channels.findIndex(item => item.id === id) // 获取索引
    //   // 然后将获取的索引直接赋值给当前激活的索引即可完成切换
    //   this.activeIndex = index
    //   this.showChannelEdit = false
    // },
    // 方法二：传索引
    selectChannel (index) {
      // alert(id)
      // 拿到传过来的index后 直接将其设置为对应的频道索引即可
      this.activeIndex = index
      this.showChannelEdit = false
    },
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
    // operateType 是操作类型 如果是dislike 就是不喜欢 如果是 report 就是 举报
    async dislikeOrReport (operateType, type) {
      // 调接口
      try {
        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId // 不感兴趣的id
        }) : await reportArticle({ target: this.articleId, type }) // 这里的type通过$event导出即可
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
    // // 举报文章
    // async reportArticle (type) {
    //   try {
    //   // 调用举报文章接口
    //     await reportArticle({ target: this.articleId, type })
    //     this.$gnotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     // await下方认为举报成功
    //     // 同样的也要讲举报的文章删除掉
    //     eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     this.showMoreAction = false // 此时关闭弹层
    //   } catch (error) {
    //     // 默认是红色
    //     this.$gnotify({
    //       message: '操作失败'
    //     })
    //   }
    // }
  },
  created () {
    // 直接调用获取频道数据的方法
    this.getMyChannels()
  }
}
</script>

<style lang='less' scoped>
// 弹出编辑面板的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
