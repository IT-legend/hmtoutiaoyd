<template>
  <div class="container">
    <van-nav-bar title="登陆" left-arrow="" @click-left="$router.back()"></van-nav-bar>
    <!-- 登录布局 -->
    <van-cell-group>
      <!-- 登录手机号 -->
    <van-field label="手机号" placeholder="请输入手机号" v-model.trim="loginForm.mobile" :error-message="errorMessage.mobile"
    @blur="checkMobile"/>
    <!-- 验证码 -->
    <van-field label="验证码" placeholder="请输入验证码" v-model.trim="loginForm.code" :error-message="errorMessage.code"
    @blur="checkCode">
    <van-button slot="button" size="small" type="primary">发送验证码</van-button>
    </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="login-box">
      <van-button type="info" block round size="small" @click="login">登陆</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 定义表单数据用于校验表单数据
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      // 此对象专门放置消息
      errorMessage: {
        mobile: '', // 手机的错误消息，默认值为空
        code: '' // 验证码的错误消息，默认值为空
      }
      // codeMessage: '', // 定义验证码提示消息变量
      // mobileMessage: '' // 定义手机号提示消息变量
    }
  },
  methods: {
    // 1- 定义检查手机号方法
    checkMobile () {
      // 1-1 获取手机号，判断是否为空，满足手机号的格式
      if (!this.loginForm.mobile) {
        // 表示输入为空，提示用户
        this.errorMessage.mobile = '手机号不能为空'
        // 此时表示没有必要再往下进行了
        return false // 返回false表示此轮校验未通过，通过返回true
      }
      // 1-2 校验手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 手机号不满足正则，提示用户
        this.errorMessage.mobile = '手机号格式错误'
        // 此时表示没有必要再往下进行了
        return false
      }
      // 1-3 如果前两个都过了，代码到达这里说明校验通过了
      this.errorMessage.mobile = '' // 通过校验，没有错误消息了
      return true // 表示通过校验了
    },
    // 2- 定义检查验证码的方法
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码格式错误'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    // 3- 定义登陆校验方法
    login () {
      // 同时校验手机号和验证码
      if (this.checkMobile() && this.checkCode()) {
        // 如果两个检查结果都是true，表示通过校验
        console.log('校验成功')
        // 校验成功后需要调接口验证用户名和验证码是否正确
      }
    }
  }
}
</script>

<style>
.login-box {
  padding: 5px;
}
</style>
