<template>
  <div class="channel-edit">
      <!-- 1- 我的频道 -->
    <div class="channel">
      <div class="tit">
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 1-1 我的频道的循环选项 -->
    <!-- 我的频道的数据是当前用户自己的频道（登陆情况下的和匿名情况下的） -->
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
            <!-- 实现点击我的频道跳转到相应频道的页面 => 将点击的频道id或者索引传出去 传给父级-->
            <!-- 方法一：传id -->
          <!-- <span class="f12" @click="$emit('selectChannel',item.id)">{{ item.name }}</span> -->
          <!-- 方法二：传索引 -->
          <span class="f12" @click="$emit('selectChannel',index)"
          :class="{red: index === activeIndex }">{{ item.name }}</span>
          <!-- 叉号标签应该在进入编辑状态时显示 退出编辑时隐藏-->
          <!-- 下标为0的第一个选项不允许删除 -->
          <!-- 点击叉号应该调用父组件删除方法 并传出当前要删除的id-->
          <van-icon class="btn" name="cross" v-if="index!==0 && editing" @click="$emit('delChannel',item.id)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 2- 可选频道 -->
    <!-- 可选频道 是全部的频道 - 我的频道 -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <!-- 2-1 可选频道的循环选项 -->
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id"
        @click="$emit('addChannel',item)">
          <span class="f12">{{ item.name }}</span>
          <!-- 找到+号图标 注册点击事件 -->
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false, // 正在编辑状态，用这个状态来控制是否显示删除图标
      allChannels: [] // 定义变量接收全部的频道数据
    }
  },
  //   props: ['channels'] // 可以直接用props接收父组件传递过来的channels
  props: {
    channels: {
      // required 必传 type 类型 default 默认值
      required: true, // 表示必须传递channels
      type: Array,
      default: () => [] // 默认值给空数组 表示此函数返回一个空数组
    },
    // 父组件传递过来的被选中的下标索引
    activeIndex: {
      required: true, // 表示必须传递索引
      type: Number, // 指定type是number类型
      default: 0 // 可写可不写
    }
  },
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  },
  //   因为可选频道是一个动态的属性，所以用计算属性实现全部频道-我的频道=可选频道的功能
  computed: {
    optionalChannels () {
      //   全部频道-当前频道
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    this.getAllChannels() // 调用组件方法
  }

}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
