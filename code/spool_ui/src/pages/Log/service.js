import { stringify } from 'querystring';
import { http } from '@/utils/request_axios';
import { getBodyParams } from '@/services/user';

// 集群列表
export async function getClusterList(params) {
  const res = await http.get(`/api/spool/cluster/list?${stringify(params)}`);
  return res;
}

// 主机列表
export async function getNodeList(params) {
  const res = await http.get(`/api/spool/host/list?${stringify(params)}`);
  return res;
}

// 卷列表
export async function getVolumeList(params) {
  const res = await http.get(`/api/spool/volume/list?${stringify(params)}`);
  return res;
}

// Brick列表
export async function getBrickList(params) {
  const res = await http.get(`/api/spool/volume/detail/brick?${stringify(params)}`);
  return res;
}

// 生成日志
export async function createLog(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/log/create`, obj);
  return res;
}

// 删除日志
export async function deleteLog(params) {
  const obj = getBodyParams(params);
  const res = await http.post(`/api/spool/log/delete`, obj);
  return res;
}

// 集群/Brick日志-列表
export async function getClusterLogList(params) {
  const res = await http.get(`/api/spool/log/list?${stringify(params)}`);
  return res;
}

// 告警项-列表
export async function getThresholdList(params) {
  const res = await http.get(`/api/spool/system/alarmthreshold/list?${stringify(params)}`);
  return res;
}

// 告警日志-列表
export async function getAlarmLogList(params) {
  const res = await http.get(`/api/spool/log/alarm/list?${stringify(params)}`);
  return res;
}

// 操作日志-列表
export async function getOperList(params) {
  const res = await http.get(`/api/spool/log/operlist?${stringify(params)}`);
  return res;
}
