// 第一步 写注释 ： request就是请求管理工具
import axios from 'axios' // 引入axios，基于axios封装
import JSONBig from 'json-bigint' // 引入大数字处理插件
import store from '@/store' // 引入vuex中的store实例对象，相当于组件中this.$store
import router from '@/router' // 引入router对象
// axios.defaults是对原有默认值进行修改
// axios.create()相当于new了一个新的axios 实例，跟原本的axios毫无关系

const instance = axios.create({
  // 构造参数 传入一些配置
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础请求地址
  //   transformResponse函数是后台响应回来，但是还没进入到axios的响应拦截器时执行 数组里面可以写多个处理函数
  transformResponse: [function (data) {
    //   data就是后端响应回来的字符串
    // 判断data是否存在
    return data ? JSONBig.parse(data) : {}
  }]
}) // 创建axios新实例

// 1- token的注入 应该在请求之前注入token 也就是请求拦截器
instance.interceptors.request.use(function (config) {
  // 成功时：读取配置信息 注入token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}` // 将token统一注入headers中
  }
  //   config.headers.Authorization && (config.headers.Authorization = `Bearer ${store.state.user.token}`) // 将token统一注入headers中,前面成立才执行&号后面的
  return config // 注入后返回数据
}, function (error) {
  // 错误时：返回promise的错误
  return Promise.reject(error) // 会直接进入axios的catch中
})
// 2- 响应拦截器处理返回结果的数据，将多层嵌套的结构解构出来
instance.interceptors.response.use(function (response) {
  // response已经被axios默认包了一层
  // response.data才是我们之前处理过的数据，几乎所有的返回数据都有一层data
  try {
    //    如果成功返回，就解开两层，返回两层
    return response.data.data
  } catch (error) {
    //    失败说明response.data不存在，就解开、返回一层
    return response.data
  }
}, async function (error) {
  // 如果请求失败或者失效或者其他错误，就会进入到相应拦截器的错误区域
//   所以，只要是401就是token失效（因为导航守卫已经把没有token的拦截在外面了）
// error中参数：
// config 是错误请求的配置信息
// request 请求对象
// response 响应对象 status（状态码）
  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login',
      // 3- 路由传参的两种方式：动态路由和query传参
      query: {
        // 4- 需要传递的参数就是之前的地址
        redirectUrl: router.currentRoute.fullPath // 表示登录页面需要跳转的地址
      }
    }
    // 如果状态码是401 就认为token失效 需要处理token的失效问题
    // 1- 判断本地有无refresh_token
    if (store.state.user.refresh_token) {
      // 2-进入这里说明有refresh_token，有的话就换取新的token，需要调用刷新token的接口
    //   2-1 发请求要工具，用我们封装的instance还是axios呢？=>这里必须用axios，因为token已经失效，instance的拦截器还是会去将失效的token注入到headers中，所以会进入401死循环=>所以我们用axios刷新token请求
      try {
        const result = await axios({
          method: 'put', // 请求类型
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 这里必须是完整的url地址，因为上面配置的baseurl是属于instance的，axios并没有基地址
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` } // 在请求头总注入refresh_token
        })
        //   2-2 后面就是请求成功的逻辑
        //   result.data.data.token // 这就是拿到了新的token
        //   2-3 拿到后直接更新vuex中的token数据
        store.commit('updateUser', {
          //   载荷数据
          user: {
            // 里面就是token
            token: result.data.data.token, // 最新的
            refresh_token: store.state.user.refresh_token// 还是原来的有效期14天
          }
        }) // 提交mutations，更新vuex数据
        //   2-4 之所以到现在这个位置，是因为401 401也就意味着之前的请求是错误的
        // 这里需要把错误的请求发送出去=>instance
        return instance(error.config) // 相当于执行之前出现401错误的请求
      } catch (error) {
        // 2-5 如果到这里意味着尝试重新获取但是又失败了
        // 所以只能重新登录，但是在登陆之前需要删除token，因为此时token和refesh_token都已失效
        store.commit('delUser') // 删除token
        // 重新跳转到的登录页
        router.push(path)
      }
    } else {
      // 3-进入这里说明没有refresh_token，应直接宣布over，直接跳到登陆页
    //   3-1 如果由于token失效，需要跳到登录页，那当前页面怎么办？登陆成功后跳转的还是这个页面吗？
    // 3-2 所以我们需要实现在A页面失效了，登陆之后依旧要回到A页面这一逻辑
    // 3-3 这里我们需要在跳转到登录页的过程中，把A页面的地址传给登录页，登陆成功后先判断是否有需要跳转的（A页面）地址，如果有，就跳转回刚才的A页面，如果没有，就跳转到主页即可

      // 实现过程
      //   1- router.currentRoute // 表示当前的路由信息对象，里面包含了路由的地址和参数，我们需要获取当前带参数的地址（fullPath）
      //   2- router.push可以push地址也可以push一个对象
      store.commit('delUser') // 删除token，因为token已经失效了
      // 然后跳转到登录页
      router.push(path)
    }
  }
  // 失败时返回promise中的error信息，catch会接收到
  return Promise.reject(error)
})
export default instance
