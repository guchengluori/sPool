import { formatMessage } from 'umi/locale';
import {
  getClusterList,
  getNodeList,
  getVolumeList,
  getBrickList,
  createLog,
  deleteLog,
  getClusterLogList,
  getThresholdList,
  getAlarmLogList,
  getOperList,
} from './service';

export default {
  namespace: 'log',

  state: {
    clusterList: [], // 集群列表
    nodeList: [], // 主机列表
    volumeList: [], // 卷列表
    brickList: [], // Brick列表
    clusterLogList: [], // 集群日志列表
    clusterLogTotal: 0,
    thresholdList: [], // 告警项列表
    thresholdTotal: 0,
    alarmLogList: [], // 告警日志列表
    alarmLogTotal: 0,
    operList: [], // 操作日志列表
    operTotal: 0,
    successInfo: '', // 操作成功提示
  },

  effects: {
    // 集群列表
    *getClusterList({ payload }, { call, put }) {
      const data = yield call(getClusterList, payload);
      const clusterList = (data && data.response.data && data.response.data.detail) || [];
      yield put({ type: 'save', payload: { clusterList } });
    },
    // 主机列表
    *getNodeList({ payload }, { call, put }) {
      const data = yield call(getNodeList, payload);
      const nodeList = (data && data.response.data && data.response.data.detail) || [];
      yield put({ type: 'save', payload: { nodeList } });
    },
    // 卷列表
    *getVolumeList({ payload }, { call, put }) {
      const data = yield call(getVolumeList, payload);
      const volumeList = (data && data.response.data && data.response.data.detail) || [];
      yield put({ type: 'save', payload: { volumeList } });
    },
    // Brick列表
    *getBrickList({ payload }, { call, put }) {
      const data = yield call(getBrickList, payload);
      const brickList = (data && data.response.data && data.response.data.detail) || [];
      yield put({ type: 'save', payload: { brickList } });
    },
    // 生成日志
    *createLog({ payload }, { call, put }) {
      const data = yield call(createLog, payload);
      const successCode = (data && data.response && data.response.message_code) || '-';
      const successInfo = formatMessage({ id: successCode });
      yield put({ type: 'save', payload: { successInfo } });
    },
    // 删除日志
    *deleteLog({ payload }, { call, put }) {
      const data = yield call(deleteLog, payload);
      const successCode = (data && data.response && data.response.message_code) || '-';
      const successInfo = formatMessage({ id: successCode });
      yield put({ type: 'save', payload: { successInfo } });
    },
    // 集群日志列表
    *getClusterLogList({ payload }, { call, put }) {
      const data = yield call(getClusterLogList, payload);
      const clusterLogList = (data && data.response.data && data.response.data.detail) || [];
      const clusterLogTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({ type: 'save', payload: { clusterLogList, clusterLogTotal } });
    },
    // 告警项列表
    *getThresholdList({ payload }, { call, put }) {
      const data = yield call(getThresholdList, payload);
      const thresholdList = (data && data.response.data && data.response.data.detail) || [];
      const thresholdTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({ type: 'save', payload: { thresholdList, thresholdTotal } });
    },
    // 告警日志列表
    *getAlarmLogList({ payload }, { call, put }) {
      const data = yield call(getAlarmLogList, payload);
      const alarmLogList = (data && data.response.data && data.response.data.detail) || [];
      // 缺少唯一标识，加个字段index
      for (let i = 0; i < alarmLogList.length; i++) {
        alarmLogList[i].index = i;
      }
      const alarmLogTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({ type: 'save', payload: { alarmLogList, alarmLogTotal } });
    },
    // 操作日志列表
    *getOperList({ payload }, { call, put }) {
      const data = yield call(getOperList, payload);
      const operList = (data && data.response.data && data.response.data.detail) || [];
      const operTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({ type: 'save', payload: { operList, operTotal } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {};
    },
  },
};
