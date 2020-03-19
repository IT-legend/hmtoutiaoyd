// 处理文章模块的请求数据
import request from '@/utils/request'

// 导出获取文章数据
// 需要传入timestamp时间戳

export function getArticles (params) {
  return request({
    //   这里必须用完整地址 因为之前设置的baseURL是v1_0版本
    url: 'http://ttapi.research.itcast.cn/api.v1_1/articles',
    params: { with_top: 1, ...params } // 合并数据

  })
}
