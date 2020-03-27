<template>
  <div class="comment">
      <!-- 列表组件 上拉加载 评论是不能一口气加载完的 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- 评论列表 -->
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
          <!-- 用户头像 -->
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
              <!-- 用户名称 -->
            <span class="name">{{ item.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <!-- 点赞数量 -->
              <span class="count">{{ item.like_count }}</span>
            </span>
          </p>
          <p>{{ item.content }}</p>
          <p>
              <!-- 时间需要过滤器 -->
            <span class="time">{{ item.pubdate | relTime }}</span>&nbsp;
            <!-- 点击回复标签 弹出面板 需要处理一些业务 -->
            <van-tag plain @click="openReply(item.com_id.toString())">{{ item.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>

    </van-list>
    <!-- 底部输入框 用来输入评论的 -->
    <div class="reply-container van-hairline--top">
        <!-- 绑定了评论内容 不论是对文章评论还是对评论评论都用的一个输入框-->
      <van-field v-model="value" placeholder="写评论...">
        <!-- 要么显示 loading -->
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <!-- 要么显示提交 如果点击了提交 首先先把提交按钮隐藏 这样做的目的是 防止重复提交 -->
        <!-- 由于点击过快 会连续两次事件 接口是异步的 会造成两次评论 -->
        <span class="submit" v-else slot="button" @click="submit">提交</span>
      </van-field>
    </div>
    <!-- 放置评论的评论的弹出面板 关闭面板是 评论id设置会为空-->
    <!-- 回复 -->
    <van-action-sheet @closed="reply.commentId=null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <!-- 列表组件 只是关闭第一次自动执行事件-->
      <van-list @load="getReply"  :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{ item.aut_name }}</span></p>
            <p>{{ item.content }}</p>
            <p><span class="time">{{ item.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import * as articles from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的评论内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 神评论数据组
      offset: null, // 分页的依据（偏移量）
      showReply: false, // 控制评论的评论的面板是否显示
      // 定义reply，用存放 评论的评论面板 加载信息的全部数据
      reply: {
        loading: false, // 表示评论的评论
        finished: false, // 评论的评论是否加载完成
        list: [], // 专门存放评论的评论的数据
        offset: null, // 评论的评论分页加载时查询的依据
        commentId: null // 用来存放每一条评论的id 用这个id来查询这个评论的 评论
      }
    }
  },
  methods: {
    //   打开回复的面板 只会调用一次
    openReply (commentId) {
      // 点击回复按钮 打开弹层
      this.showReply = true
      //   处理,拿到id
      this.reply.commentId = commentId
      //   需要在弹出窗口之前 把之前的list清空，即重置数据，下面四行代码实现了这个逻辑
      this.reply.list = []
      this.reply.offset = null // 为啥直接等于null？因为我们希望点击弹出回复面板时，展示的新的数据，从第一页开始
      this.reply.finished = false // 将finished打开
      this.reply.loading = true // 主动打开加载状态，因为此时没有主动检查了，所以我们主动给打开
      //   弹出评论的评论的层时，主动的请求数据
      this.getReply()
    },
    // 此方法用来获取评论的评论
    // 此方法会在第一次加载时执行，也会在加载后面每一页时执行
    async getReply () {
      const data = await articles.getComments({
        type: 'c', // 表示获取评论的评论
        source: this.reply.commentId, // 获取谁的评论的评论？
        offset: this.reply.offset // 偏移量:评论的评论的分页依据
      })
      //   将数据追加到reply的list的队尾
      this.reply.list.push(...data.results)
      this.reply.loading = false // 关闭加载状态
      this.reply.finished = data.last_id === data.end_id // 相等表示over
      if (!this.reply.finished) {
        //   不等 表示还有下一页数据
        this.reply.offset = data.last_id // 那么就将下一页的分页依据设置给当前的数据
      }
    },
    //   加载方法：滚动条距离底部距离超过一定距离时就会触发
    async onLoad () {
      // 数据加载
      const { artId } = this.$route.query // 任何组件的属性中都有一个$route选项 我们可以通过其属性获取我们需要的参数
      const data = await articles.getComments({
        type: 'a', // a（文章的评论） c（评论的评论）
        source: artId, // 表示要查询的 谁的 评论(需要找到id)
        offset: this.offset // 赋值当前的偏移量
      })
      this.comments.push(...data.results) // 将评论数据追加到评论列表尾部
      // 加载完成，关闭加载状态
      this.loading = false
      //   需要判断是否还有下一页数据
      // data.end_id === data.last_id => finished = true //表示没有下一页了
      this.finished = data.end_id === data.last_id // 后面两个全等，返回true
      if (!this.finished) {
        //   表示还没结束全部加载
        // data.last_id 是当前页的最后一个id
        this.offset = data.last_id
      }
    },
    // 提交评论方法
    async submit () {
      // 点击时都要做什么？
      // 因为此时并没有判断用户是否登陆了 先判断用户是否登陆 如果没登陆就不可评论
      if (this.$store.state.user.token) {
        // 此时才认为你登陆了
        // 首先应该判断是否输入了评论内容
        // 如果没有评论内容 直接返回
        if (!this.value) return false // 如果没有内容 直接返回
        // 如果有内容
        this.submiting = true // 先把提交状态打开 表示在提交中 避免重复提交 只有当提交完毕后 才关掉状态
        // 调用休眠函数 来控制执行的速度
        await this.$sleep(800) // 强制休眠800毫秒
        try {
          // 提交评论核心内容
          const data = await articles.commentOrReply({
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 要么是文章id 要么是评论id 需要根据当前是对谁评论
            // 参数
            content: this.value, // 评论内容
            art_id: this.reply.commentId ? this.$route.query.artId : null // 如果是对评论进行评论 需要传该评论属于哪个文章 如果是对文章进行评论 不要传这个参数
          }) // 直接提交方法
          // 希望调用完成之后 添加的评论数据 直接添加到我们的评论列表
          // data.new_obj 此obj数据是添加成功的一条数据 这一条数据 我们需要 加入到列表中
          // 两种场景 文章评论 和 评论评论
          if (this.reply.commentId) {
            // 如果此id存在 表示对 评论进行评论
            // 将此数据添加到评论的评论
            this.reply.list.unshift(data.new_obj)
            // 如果是对评论进行评论 需要找到 对应的评论id 将评论id的回复数+1
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            // 寻找文章评论中 等于 当前评论id 的id
            comment && comment.reply_count++ // 如果找到就将 回复数量+1
          } else {
            // 表示对文章进行评论
            this.comments.unshift(data.new_obj) // 一般评论数据加到头部
          }
          this.value = '' // 清空评论内容
        } catch (error) {
          this.$wnotify({ message: '评论失败' })
        }
        this.submiting = false // 状态关闭
      } else {
        try {
          // 认为你没有登陆
          // 告知用户 想评论 必须去登陆 放弃评论 那就放弃
          await this.$dialog.confirm({
            message: '评论需登陆'
          })
          // 点击了确定就跳到登录界面
          // fullPath就是完整地址
          // path是 /articles？artId = 123
          this.$router.push({
            path: '/login',
            query: {
              redirectUrl: this.$route.fullPath // 此地址是用户登陆成功之后需要回到的页面
            }
          }) // 跳到登录页
        } catch (error) {
          console.log('选择取消')
        }
      }
    }

  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
