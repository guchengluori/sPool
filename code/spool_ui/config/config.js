/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import safeGet from 'lodash/get';
import plugins from './plugins.config';
// import babelPlugins from './babelPlugins.config';
import { primaryColor } from '../src/defaultSettings';
import fishxConfig from '../.fishxconfig.json';

const target = 'http://localhost:8080/sso/';
const targetMenu = safeGet(fishxConfig, 'menuApi.menuList', target);

export default {
  
  plugins,
  // extraBabelPlugins: babelPlugins,
  targets: {
    ie: 10,
  },
  disableRedirectHoist: true,

  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  // 添加反向代理
  proxy: {
    "/api": {
      "target": "http://10.45.69.15",
      "changeOrigin": true
    },
    // "/websocket": {
    //   target: 'wss://10.45.69.15:9091/websocket',
    //   ws: true,
    //   secure: false,
    //   logLevel: 'debug',
    //   // pathRewrite: {"^/ws/test": ""},
    // }
  },
  manifest: {
    basePath: '/spool/'
  },
  base: '/spool/',
  history: 'hash',
  publicPath: '/spool/',
};
