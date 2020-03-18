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
// 引入login方法
import { login } from '@/api/user'
import { mapMutations } from 'vuex' // 辅助函数可以把mutation方法映射到methods方法中
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
    async login () {
      // 同时校验手机号和验证码
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        // 如果两个检查结果都是true，表示通过校验
        // console.log('校验成功')
        // 校验成功后需要调接口验证用户名和验证码是否正确
        try {
          const result = await login(this.loginForm)
          // console.log(result)
          // 把结果设置给vuex中的state
          // this.$store.commit('')
          this.updateUser({ user: result }) // 相当于更新当前的token和refresh_token
          // 更新完毕理当跳转到主页，但是如果是从别的页面跳过来的，应该跳回去，所以需要判断一下：是否有需要跳转的页面，有就跳转 没有去主页
          const { redirectUrl } = this.$route.query // query查询参数也就是？后面的东西
          // 有值跳转，没有就跳主页
          this.$router.push(redirectUrl || '/') // 短路表达式
        } catch (error) {
          // 提示用户 告诉用户登陆失败
          this.$notify({
            message: '手机号或验证码错误',
            duration: 1000
          })
          // 这里我们要装个比，自己封装一个方法
          this.$wnotify({ message: '手机号或者验证码错误' })
        }
      }
    },
    // 4- 获取vuex中定义的方法
    ...mapMutations(['updateUser']) // 直接把vuex中的update方法映射到当前methods方法中
  }
}
</script>

<style>
.login-box {
  padding: 5px;
}
</style>
