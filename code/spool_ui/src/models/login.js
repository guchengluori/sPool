import { routerRedux } from 'dva/router';
import { fakeAccountLogin, logout } from '@/services/user';
import { setAuthority } from '@/utils/authority';


export default {
  namespace: 'login',

  state: {
    status: undefined,
    currentAuthority: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      const { currentAuthority } = response.response;
      response.currentAuthority = currentAuthority;
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put(routerRedux.push('/'));
    },

    *logout(_, { call, put }) {
      yield call(logout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: null,
        },
      });
      yield put(
        routerRedux.push('/userLogin')
        // routerRedux.push({
        //   pathname: '/UserLogin',
        //   search: stringify({
        //     redirect: window.location.href,
        //   }),
        // })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        currentAuthority: payload.currentAuthority
      };
    },
  },
};
