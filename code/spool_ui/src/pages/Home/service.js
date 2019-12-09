// This is for http service
import { stringify } from 'qs';
import { http } from '@/utils/request_axios';


export async function queryBaseInfo() {
  const res = await http.get('/api/spool/home/baseinfo');
  return res;
}

export async function queryVolumeOverview() {
  const res = await http.get('/api/spool/home/volume/overview');
  return res;
}

export async function queryAlarmOverview() {
  const res = await http.get('/api/spool/home/alarm/overview');
  return res;
}