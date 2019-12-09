import { formatMessage } from 'umi/locale';
import { queryHost, removeHost, addHost, updateHost } from './service';

export default {
  namespace: 'hostMgmt',

  state: {
    dataList: [],
    dataListTotal: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(queryHost, payload);
      const dataList = data && data.response.data && data.response.data.detail || [];
      const dataListTotal = data && data.response.data && data.response.data.all || 0;
      yield put({
        type: 'save',
        payload: { dataList, dataListTotal },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const data = yield call(addHost, payload);
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
      const data = yield call(removeHost, payload);
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
      const data = yield call(updateHost, payload);
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
