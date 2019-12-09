import axios from 'axios';

function requestHandler(config) {
  const ret = config;
  // 头部塞入token等
  // const session = localStorage.getItem("X-CSRF-TOKEN");
  // if (session) {
  //   ret.headers['X-CSRF-TOKEN'] = session;
  // }
  return ret;
}
/* 创建一个新的 AXIOS 对象，确保原有的对象不变 */
const axiosWrap = axios.create({
  // transformRequest:[function (data, header){
  //   /* 自定义请求参数解析方式（如果必要的话） */
  // }],
  // paramsSerializer:function(params){
  //   /* 自定义链接参数解析方式（如果必要的话） */
  // }
});

/* 过滤请求 */
axiosWrap.interceptors.request.use(requestHandler);
/* 过滤响应 */
// axiosWrap.interceptors.response.use((result) => {
//   /* 假设当code为0时代表响应成功 */
//   if (result.data.code !== 0) {
//     return Promise.reject(result)
//   }
//   return result.data.data
// }, result => {
//   return Promise.reject(result)
// });

export default axiosWrap;
