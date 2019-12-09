export default {
  namespace: 'global',

  state: {
    collapsed: true,
    menuBar: false, // 产品与服务浮框
    // 仅展示
    languages: [
      {
        key: 'en-US',
        showValue: 'English',
      },
      {
        key: 'zh-CN',
        showValue: '中文',
      },
    ],
  },

  effects: {},

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeMenuBar(state, { payload }) {
      return {
        ...state,
        menuBar: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
