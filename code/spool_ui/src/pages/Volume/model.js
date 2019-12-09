import { formatMessage } from 'umi/locale';
import {
  queryVolumeList,
  addVolume,
  modifyVolume,
  deleteVolume,
  operVolume,
  queryClusterList,
  queryBrickList,
  queryParamList,
  modifyParam,
  queryClientDetailList,
  queryDataStatistics,
  replaceBrick,
  queryBrickInfo
} from './service';

export default {
  namespace: 'volume',

  state: {
    volumeList: [], // 卷列表
    volumeTotal: 0, // 卷总记录数
    clusterList: [], // 集群列表
    clusterTotal: 0, // 集群总记录数
    successInfo: '', // 请求返回信息
    successCode: '',
    brickList: [], // Brick列表
    brickTotal: 0, // Brick记录总数
    paramList: [], // 参数列表
    paramTotal: 0, // 参数记录总数
    clientDetailList: [], // 客户端详情列表
    clientDetailTotal: 0, // 客户端详情记录总数
    statisticsList: [], // 数据统计信息列表
    statisticsTotal: 0, // 数据统计信息记录总数
    brickInfo: {} // 卷详细信息
  },

  effects: {
    // 卷列表
    *effects_queryVolumeList({ payload }, { call, put }) {
      const data = yield call(queryVolumeList, payload);
      const volumeList = (data && data.response.data && data.response.data.detail) || [];
      const volumeTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({
        type: 'save',
        payload: {
          volumeList,
          volumeTotal,
        },
      });
    },

    // 卷-新增
    *effects_addVolume({ payload }, { call, put }) {
      const data = yield call(addVolume, payload);
      const successCode = (data && data.response && data.response.message_code) || '';
      const successInfo = formatMessage({ id: successCode });
      yield put({
        type: 'save',
        payload: {
          successInfo,
        },
      });
    },

    // 卷-修改
    *effects_modifyVolume({ payload }, { call, put }) {
      const data = yield call(modifyVolume, payload);
      const successCode = (data && data.response && data.response.message_code) || '';
      const successInfo = formatMessage({ id: successCode });
      yield put({
        type: 'save',
        payload: {
          successInfo,
        },
      });
    },

    // 卷-删除
    *effects_deleteVolume({ payload }, { call, put }) {
      const data = yield call(deleteVolume, payload);
      const successCode = (data && data.response && data.response.message_code) || '';
      const successInfo = formatMessage({ id: successCode });
      yield put({
        type: 'save',
        payload: {
          successInfo,
        },
      });
    },

    // 卷-启动/停止
    *effects_operVolume({ payload }, { call, put }) {
      const data = yield call(operVolume, payload);
      const successCode = (data && data.response && data.response.message_code) || '-';
      const successInfo = formatMessage({ id: successCode });
      yield put({
        type: 'save',
        payload: {
          successInfo,
        },
      });
    },

    // 集群列表
    *effects_queryClusterList({ payload }, { call, put }) {
      const data = yield call(queryClusterList, payload);
      const clusterList = (data && data.response.data && data.response.data.detail) || [];
      const clusterTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({
        type: 'save',
        payload: {
          clusterList,
          clusterTotal,
        },
      });
    },

    // 卷详情-Brick列表
    *effects_queryBrickList({ payload }, { call, put }) {
      const data = yield call(queryBrickList, payload);
      const brickList = (data && data.response.data && data.response.data.detail) || [];
      const brickTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({
        type: 'save',
        payload: {
          brickList,
          brickTotal,
        },
      });
    },

    // 卷详情-参数列表
    *effects_queryParamList({ payload }, { call, put }) {
      const data = yield call(queryParamList, payload);
      const paramList = (data && data.response.data && data.response.data.detail) || [];
      const paramTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({
        type: 'save',
        payload: {
          paramList,
          paramTotal,
        },
      });
    },

    // 卷详情-参数修改
    *effects_modifyParam({ payload }, { call, put }) {
      const data = yield call(modifyParam, payload);
      const successCode = (data && data.response && data.response.message_code) || '';
      const successInfo = formatMessage({ id: successCode });
      yield put({
        type: 'save',
        payload: {
          successInfo,
          successCode,
        },
      });
    },

    // 卷详情-客户端详情列表
    *effects_queryClientDetailList({ payload }, { call, put }) {
      const data = yield call(queryClientDetailList, payload);
      const clientDetailList = (data && data.response.data && data.response.data.detail) || [];
      const clientDetailTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({
        type: 'save',
        payload: {
          clientDetailList,
          clientDetailTotal,
        },
      });
    },

    // 卷详情-数据库统计数据列表
    *effects_queryDataStatistics({ payload }, { call, put }) {
      const data = yield call(queryDataStatistics, payload);
      const statisticsList = (data && data.response.data && data.response.data.detail) || [];
      const statisticsTotal = (data && data.response.data && data.response.data.all) || 0;
      yield put({
        type: 'save',
        payload: {
          statisticsList,
          statisticsTotal,
        },
      });
    },

    // 卷替换
    *effects_replaceBrick({ payload }, { call, put }) {
      const data = yield call(replaceBrick, payload);
      const successCode = (data && data.response && data.response.message_code) || '';
      const successInfo = formatMessage({ id: successCode });
      yield put({
        type: 'save',
        payload: {
          successInfo,
          successCode,
        },
      });
    },

    // 卷详情-Brick列表
    *effects_queryBrickInfo({ payload }, { call, put }) {
      const data = yield call(queryBrickInfo, payload);
      const brickInfo = (data && data.response.data) || {};
      yield put({
        type: 'save',
        payload: {
          brickInfo,
        },
      });
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
