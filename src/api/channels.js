// 负责处理频道数据
import store from '@/store' // 游客用户的key
import request from '@/utils/request'
const CACHE_CHANNEL_V = 'hm-94-touxiao-v' // 登陆用户的key
const CACHE_CHANNEL_T = 'hm-94-touxiao-t'

// 获取我的频道数据 没有参数 匿名用户也可以获取频道数据
// 这里要将此方法 改造成 本地化的频道
export function getMyChannels () {
  // 我们要对原来的方法进行改造 但是不想改造调用的方式
  // 原来的接口存在问题，我们需要将其本地化
  return new Promise(function (resolve, reject) {
    // 要支持本地化缓存 要注意区分登录用户or游客用户 那么怎么区分呢？ 可以根据当前有没有token来判断是游客还是用户
    // key是根据当前登录状态来判断的
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 拿到key去缓存中读取用户数据
    const str = localStorage.getItem(key) // 通过缓存key来获取缓存中用户的频道数据
    if (str) {
      // 本地缓存有数据 应该吧本地数据释放给后面的执行结果
      resolve({
        channels: JSON.parse(str)
      })
    } else {
      // 本地缓存没数据，我们需要到线上拉取数据
      request({ url: '/user/channels' }).then(result => {
        // 获取请求的结果
        localStorage.setItem(key, JSON.stringify(result.channels))
        // 虽然写入缓存了，但是还需要resolve我们的数据
        resolve(result) // 这里表示直接成功执行了 获取用户频道数据
      }) // 得到线上的用户频道列表数据 ，我们需要将其放入缓存中
    }
  })
  // return request({
  //   url: '/user/channels'
  // })
}

// 获取全部频道数据 没有参数 默认是get类型
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
