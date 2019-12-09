import { routerRedux } from 'dva/router';
import { query as queryUsers, queryCurrent } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const { success, response } = yield call(queryCurrent);
      if (success && Object.keys(response).length > 0) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } else {
        const { hash } = new URL(window.location.href);
        if (hash.indexOf('userLogin') <= -1) {
          yield put(routerRedux.push('/userLogin'));
        }
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
