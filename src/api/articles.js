// 处理文章模块的请求数据
import request from '@/utils/request'

// 导出获取文章数据
// 需要传入三个参数：timestamp 时间戳、channels_id 频道id
export function getArticles (params) {
  return request({
    //   这里必须用完整地址 因为之前设置的baseURL是v1_0版本
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 合并数据
  })
}
// 不感兴趣的文章接口
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post', // 请求类型
    data // body的参数位于data中
  })
}
// 举报文章接口
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'
  })
}
// 获取联想搜索建议
export function getSuggestion (params) {
  return request({
    url: '/suggestion', // 搜索建议地址
    params // query参数放在params中
  })
}
// 封装一个搜索文章的方法
export function searchAticle (params) {
  return request({
    url: '/search',
    params // 关键词以及分页信息
  })
}
// 获取文章详情
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}` // 获取文表id
  })
}
