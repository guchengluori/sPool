import { stringify } from 'qs';
import { http } from '@/utils/request_axios';

// POST请求时，通用处理body参数
export function getBodyParams(params) {
  const p = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (typeof params[key] === 'object') {
      p.append(key, JSON.stringify(params[key]));
    } else {
      p.append(key, params[key] !== undefined ? params[key] : '');
    }
  });
  return p;
}

export async function queryCluster(params) {
  const res = await http.get(`/api/spool/cluster/list?${stringify(params)}`);
  return res;
}

export async function removeCluster(params) {
  const obj = getBodyParams(params);
  const res = await http.post('/api/spool/cluster/delete', obj);
  return res;
}

export async function addCluster(params) {
  const obj = getBodyParams(params);
  const res = await http.post('/api/spool/cluster/create', obj);
  return res;
}

export async function updateCluster(params) {
  const obj = getBodyParams(params);
  const res = await http.post('/api/spool/cluster/modify', obj);
  return res;
}

/**
 *  获取集群客户端列表
 */
export async function queryClusterClient(params) {
  const res = await http.get(`/api/spool/cluster/detail?${stringify(params)}`);
  return res;
}
