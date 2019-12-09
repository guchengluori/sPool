import { queryBaseInfo, queryVolumeOverview, queryAlarmOverview } from './service';

export default {
  namespace: 'homemodel',
  state: {
    baseInfo: {},
    volumeInfo: {},
    alarmInfo: {},
  },

  effects: {
    *effects_queryBaseInfo({ payload }, { call, put }) {
      const data = yield call(queryBaseInfo, payload);
      const baseInfo = data && data.response.data || {};
      yield put({
        type: 'save',
        payload: { baseInfo},
      });
    },

    *effects_queryVolumeOverview({ payload }, { call, put }) {
      const data = yield call(queryVolumeOverview, payload);
      const volumeInfo = data && data.response.data || [];
      yield put({
        type: 'save',
        payload: { volumeInfo },
      });
    },

    *effects_queryAlarmOverview({ payload }, { call, put }) {
      const data = yield call(queryAlarmOverview, payload);
      const alarmInfo = data && data.response.data && data.response.data.detail || [];
      yield put({
        type: 'save',
        payload: { alarmInfo },
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
