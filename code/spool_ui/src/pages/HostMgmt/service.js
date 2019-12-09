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

export async function queryHost(params) {
  const res = await http.get(`/api/spool/host/list?${stringify(params)}`);
  return res;
}

export async function removeHost(params) {
  const obj = getBodyParams(params);
  const res = await http.post('/api/spool/host/delete', obj);
  return res;
}

export async function addHost(params) {
  const obj = getBodyParams(params);
  const res = await http.post('/api/spool/host/create', obj);
  return res;
}

export async function updateHost(params) {
  const obj = getBodyParams(params);
  const res = await http.post('/api/spool/host/modify', obj);
  return res;
}
