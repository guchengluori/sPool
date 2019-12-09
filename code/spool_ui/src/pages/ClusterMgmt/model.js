import { formatMessage } from 'umi/locale';
import { queryCluster, removeCluster, addCluster, updateCluster, queryClusterClient } from './service';

export default {
  namespace: 'clusterMgmt',

  state: {
    dataList: [],
    dataListTotal: '',
    clientList: [], // 集群客户端列表
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(queryCluster, payload);
      const dataList = data && data.response.data && data.response.data.detail || [];
      const dataListTotal = data && data.response.data && data.response.data.all || 0;
      yield put({
        type: 'save',
        payload: { dataList, dataListTotal },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const data = yield call(addCluster, payload);
      const successCode = data && data.response && data.response.message_code || "";
      const successInfo = formatMessage({ id: successCode });
      yield put({
        type: 'save',
        payload: {
          successInfo
        }
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const data = yield call(removeCluster, payload);
      const successCode = data && data.response && data.response.message_code || "";
      const successInfo = formatMessage({ id: successCode });
      yield put({
        type: 'save',
        payload: {
          successInfo
        }
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const data = yield call(updateCluster, payload);
      const successCode = data && data.response && data.response.message_code || "";
      const successInfo = formatMessage({ id: successCode });
      yield put({
        type: 'save',
        payload: {
          successInfo
        }
      });
      if (callback) callback();
    },
    *effects_queryClusterClient({ payload }, { call, put }) {
      const data = yield call(queryClusterClient, payload);
      const clientList = data && data.response.data || [];
      yield put({
        type: 'save',
        payload: { clientList },
      });
    },
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
