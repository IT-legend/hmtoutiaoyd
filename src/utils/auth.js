// auth.js专门用来处理token的读写和删除
// create by wmd 2020/3/15
const USER_TOKEN = '94-heima-toutiao-m' // 专门存储用户信息
// 设置用户的token信息 导出是为了使用
export function setUser (user) {
  // user应该是一个对象
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user)) // 对象需要转成字符串
}

// 获取用户的token信息 导出是为了使用
export function getUser () {
  // 将字符串转换成对象再返回
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}') // 短路表达式，前面false后面才会执行
}

// 删除用户的token信息 导出是为了使用
export function delUser () {
  localStorage.removeItem(USER_TOKEN) // 删除用户信息
}
