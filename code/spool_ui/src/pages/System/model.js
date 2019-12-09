import { formatMessage } from 'umi/locale';
import {
  getThresholdList,
  editThreshold,
  operThreshold,
  getParamsList,
  editParams,
  getServiceList,
  getCommandList,
} from './service';

export default {
  namespace: 'system',

  state: {
    thresholdList: [], // 告警阈值-列表
    thresholdTotal: 0,
    paramsList: [], // 系统参数-列表
    paramsTotal: 0,
    serviceList: [], // 系统服务-列表
    serviceTotal: 0,
    commandList: [], // 命令集-列表
    commandTotal: 0,
    successInfo: '', // 操作成功提示
  },

  effects: {
    // 告警阈值-列表
    *getThresholdList({ payload }, { call, put }) {
      const data = yield call(getThresholdList, payload);
      const thresholdList = (data && data.response.data && data.response.data.detail) || [];
      const thresholdTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({ type: 'save', payload: { thresholdList, thresholdTotal } });
    },
    // 告警阈值-修改
    *editThreshold({ payload }, { call, put }) {
      const data = yield call(editThreshold, payload);
      const successCode = (data && data.response && data.response.message_code) || '-';
      const successInfo = formatMessage({ id: successCode });
      yield put({ type: 'save', payload: { successInfo } });
    },
    // 告警阈值-启用/禁用
    *operThreshold({ payload }, { call, put }) {
      const data = yield call(operThreshold, payload);
      const successCode = (data && data.response && data.response.message_code) || '-';
      const successInfo = formatMessage({ id: successCode });
      yield put({ type: 'save', payload: { successInfo } });
    },

    // 系统参数-列表
    *getParamsList({ payload }, { call, put }) {
      const data = yield call(getParamsList, payload);
      const paramsList = (data && data.response.data && data.response.data.detail) || [];
      const paramsTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({ type: 'save', payload: { paramsList, paramsTotal } });
    },
    // 系统参数-修改
    *editParams({ payload }, { call, put }) {
      const data = yield call(editParams, payload);
      const successCode = (data && data.response && data.response.message_code) || '-';
      const successInfo = formatMessage({ id: successCode });
      yield put({ type: 'save', payload: { successInfo } });
    },
    // 系统服务-列表
    *getServiceList({ payload }, { call, put }) {
      const data = yield call(getServiceList, payload);
      const serviceList = (data && data.response.data && data.response.data.detail) || [];
      const serviceTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({ type: 'save', payload: { serviceList, serviceTotal } });
    },
    // 命令集-列表
    *getCommandList({ payload }, { call, put }) {
      const data = yield call(getCommandList, payload);
      const commandList = (data && data.response.data && data.response.data.detail) || [];
      const commandTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({ type: 'save', payload: { commandList, commandTotal } });
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
