// 此文件专门用来处理用户相关的请求

// 引入请求需要的工具
import request from '@/utils/request'
// request相当于是axios的一个实例 跟axios有同样的方法和属性

// 导出登陆方法
export function login (data) {
  return request({
    // 配置选项
    url: '/authorizations', // 请求地址
    method: 'post',
    data // axios 的 body 参数写在 data 中
  })
//   返回一个promise对象
}

// 关注用户接口
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data // body参数
  })
}
// 取消关注用户接口
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'
  })
}
// 获取用户自己的个人信息、粉丝数、文章数
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
