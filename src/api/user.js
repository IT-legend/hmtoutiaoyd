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
