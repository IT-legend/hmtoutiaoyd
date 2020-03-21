<template>
  <div class="more-action">
      <!-- 单元格组1 -->
      <!-- v-if（前面满足，前面显示） （前面不满足，后面显示）v-else -->
      <van-cell-group v-if="!isReport">
          <!-- 给不感兴趣按钮注册点击事件，希望调用不感兴趣的接口 -->
          <!-- 点击事件 实际上是调用父组件的方法 来触发接口 -->
          <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
          <van-cell is-link @click="isReport=true">反馈辣鸡内容</van-cell>
          <van-cell>拉黑作者</van-cell>
      </van-cell-group>
      <!-- 单元格组2 -->
      <van-cell-group v-else>
          <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
          <!-- 注册举报选项的点击事件 -->
          <van-cell @click="$emit('report',item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
      </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants' // 引入常量变量
import eventBus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false, // 是否举报的意思
      reports // 相当于 定义一个reports变量 初始值来源于 constants中的reports
    }
  },
  created () {
    // 一开始就要监听
    eventBus.$on('delArticle', () => (this.isReport = false)) // 只要一开始删除，我就把弹层中反馈组件重置
  }
}
</script>

<style lang='less' scoped>
    .more-action {
        border-radius: 4px;
    }
</style>
