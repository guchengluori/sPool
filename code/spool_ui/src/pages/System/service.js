import { stringify } from 'querystring';
import { http } from '@/utils/request_axios';
import { getBodyParams } from '@/services/user';

// 告警阈值-列表
export async function getThresholdList(params) {
  const res = await http.get(`/api/spool/system/alarmthreshold/list?${stringify(params)}`);
  return res;
}

// 告警阈值-修改
export async function editThreshold(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/system/alarmthreshold/modify`, obj);
  return res;
}

// 告警阈值-启用/禁用
export async function operThreshold(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/system/alarmthreshold/opera`, obj);
  return res;
}

// 系统参数-列表
export async function getParamsList(params) {
  const res = await http.get(`/api/spool/system/param/list?${stringify(params)}`);
  return res;
}

// 系统参数-修改
export async function editParams(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/system/param/modify`, obj);
  return res;
}

// 系统服务-列表
export async function getServiceList(params) {
  const res = await http.get(`/api/spool/system/service/list?${stringify(params)}`);
  return res;
}

// 命令集-列表
export async function getCommandList(params) {
  const res = await http.get(`/api/spool/system/cmd/list?${stringify(params)}`);
  return res;
}
