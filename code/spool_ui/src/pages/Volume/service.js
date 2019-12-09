import { stringify } from 'qs';
// import request from '@/utils/request';
import { http } from '@/utils/request_axios';

// POST请求时，通用处理body参数
export function getBodyParams(params) {
  // eslint-disable-next-line compat/compat
  const p = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (
      typeof params[key] === 'string' ||
      typeof params[key] === 'number' ||
      typeof params[key] === 'boolean'
    ) {
      p.append(key, params[key] !== undefined ? params[key] : '');
    } else if (typeof params[key] === 'object') {
      p.append(key, JSON.stringify(params[key]));
    }
  });
  return p;
}

// 磁盘卷管理
// 获取磁盘卷列表
export async function queryVolumeList(params) {
  const res = await http.get(`/api/spool/volume/list?${stringify(params)}`);
  return res;
}

// 新增磁盘卷
export async function addVolume(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/volume/create`, obj);
  return res;
}

// 修改磁盘卷
export async function modifyVolume(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/volume/modify`, obj);
  return res;
}

// 删除磁盘卷
export async function deleteVolume(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/volume/delete`, obj);
  return res;
}

// 启动/停止磁盘卷
export async function operVolume(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/volume/oper`, obj);
  return res;
}

// 磁盘卷详情-Brick列表
export async function queryBrickList(params) {
  const res = await http.get(`/api/spool/volume/detail/brick?${stringify(params)}`);
  return res;
}

// 磁盘卷详情-参数列表
export async function queryParamList(params) {
  const res = await http.get(`/api/spool/volume/detail/param?${stringify(params)}`);
  return res;
}

// 磁盘卷详情-参数修改
export async function modifyParam(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/volume/detail/param/modify`, obj);
  return res;
}

// 磁盘卷详情-客户端详情列表数据
export async function queryClientDetailList(params) {
  const res = await http.get(`/api/spool/volume/brick/client/detail?${stringify(params)}`);
  return res;
}

// 磁盘卷详情-数据统计列表
export async function queryDataStatistics(params) {
  const res = await http.get(`/api/spool/volume/detail/datastatistics?${stringify(params)}`);
  return res;
}

// 集群管理
// 获取集群列表
export async function queryClusterList(params) {
  const res = await http.get(`/api/spool/cluster/list?${stringify(params)}`);
  return res;
}

// 卷替换
export async function replaceBrick(params){
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/volume/brick/replace`, obj);
  return res;
}

// 卷brick 详情
export async function queryBrickInfo(params) {
  const res = await http.get(`/api/spool/volume/detail/brick/list?${stringify(params)}`);
  return res;
}
