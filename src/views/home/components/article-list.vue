<template>
<!-- 这里放置div目的是形成滚动条 因为我们后期要做阅读记忆-->
    <!-- van-list可以帮助我们实现上拉加载，需要一些变量 -->
<div class="scrollwrapper">
    <!-- 文章列表 -->
    <!-- van-list组件如果我们不干涉它，它初始化完毕就会自动检测距离底部的长度，如果超过了限定，就会自动执行load加载事件，会自动把绑定的loading的值变为true -->
    <van-list v-model="uploading" @load="onload" :finished='finished'></van-list>
</div>
</template>

<script>
export default {
  data () {
    return {
      uploading: false, // 表示是否开启了上拉加载，默认值是false
      finished: false // 表示是否已经完成所有数据的加载
    }
  },
  methods: {
    onload () {
      console.log('开始加载数据')
      // 如果想关掉，必须将全部数据加载完毕的finished属性值改为true
      // 如果有数据，应该把数据加到list中，再结束加载
      setTimeout(() => {
        this.finished = true // 表示 数据已经加载完毕，没有数据了
      }, 1000)
    }
  }
}
</script>

<style>

</style>
