import safeGet from 'lodash/get';
import request from '@/utils/request';
import  { http } from '@/utils/request_axios';
import fishxConfig from '../../.fishxconfig.json';

// POST请求时，通用处理body参数
export function getBodyParams(params) {
  // eslint-disable-next-line compat/compat
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

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryMenus() {
  const code = safeGet(fishxConfig, 'staffCode', undefined);
  const projectId = safeGet(fishxConfig, 'projectName', undefined);
  const url = code && projectId ? `/api/auth/menu/list?code=${code}&projectId=${projectId}` : `/menuList`;
  return request(url);
}

// 全局-已读未读标记
export async function getOperRead() {
  const res = await http.get(`/api/spool/log/oper/read`);
  return res;
}

export async function fakeAccountLogin(params) {
  // eslint-disable-next-line compat/compat
  const loginparams = new URLSearchParams();
  loginparams.append('username', params.username);
  loginparams.append('password', params.password);
  loginparams.append('type', params.type);
  const res = await http.post('/api/auth/user/login', loginparams);
  return res
}

export async function logout() {
  const res = await http.post('/api/auth/user/logout');
  return res;
}
