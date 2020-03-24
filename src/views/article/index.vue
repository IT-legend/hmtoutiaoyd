<template>
   <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{ article.aut_name }}</p>
          <p class="time">{{ article.pubdate | relTime }}</p>
        </div>
        <van-button :loading="followLoading" @click="follow" round size="small" type="info">{{ article.is_followed ? '已关注' : '+ 关注' }}</van-button>
      </div>
      <div class="content" v-html="article.content">
        <!-- 文章内容有标签 有属性 有样式 将标签设置到对应元素即可 无需单独生成-->
      </div>
      <div class="zan">
        <!-- 需要genuine当前的态度 决定谁拥有active -->
        <van-button round size="small" :class="{active:article.attitude === 1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active:article.attitude === 0}" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
    <!-- 放置一个遮罩层 -->
    <van-overlay :show="loading">
      <!-- 加载进度条 -->
      <div class="loading-container">
        <van-loading />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, unfollowUser } from '@/api/user'
export default {
  data () {
    return {
      article: {}, // 接收文章详情数据
      followLoading: false, // 是否正在点击关注
      loading: false // 遮罩层状态
    }
  },
  methods: {
    // 获取文章详情数据
    async getArticleInfo () {
      // 打开遮罩层
      this.loading = true
      // 获取地址参数
      const { artId } = this.$route.query // 从当前路由信息对象中读取query参数
      this.article = await getArticleInfo(artId) // 得到文章结果
      // 关闭遮罩层
      this.loading = false
    },
    // 关注或取消关注
    async follow () {
      this.followLoading = true
      // 调接口
      try {
        if (this.article.is_followed) {
        // 取消关注
          await unfollowUser(this.article.aut_id) // 传入作者id
        } else {
        // 加关注
          await followUser({ target: this.article.aut_id }) // 传入作者id
        }
        // 如果成功了 需要干嘛呢？
        this.article.is_followed = !this.article.is_followed // 将状态改为对立状态
        this.$wnotify({ type: 'success', message: '关注成功' })
      } catch (error) {
        // 失败会进入
        // error.message 就是报错信息 就可以知道哪里出了问题
        this.$wnotify({ message: '操作失败' })
      } finally {
        // 无论成功还是失败都会进入这里
        this.followLoading = false // 关闭加载状态
      }
    }
  },
  created () {
    // 初始化调用
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
