/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import safeGet from 'lodash/get';
import webpackPlugin from './plugins.config';
import { primaryColor } from '../src/defaultSettings';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: false,
      dva: {
        hmr: true,
      },
      routes: {
        exclude: [
          /(consts|models|messages|locales|services|components|utils)/,
          /model\.js/,
          /config\.js/,
          /service\.js/,
          /_mock\.js/,
        ],
      },
      locale: false,
      // targets: {
      //   ie: 10,
      // },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      // },
    },
  ],
  [
    '@whalecloud/portal-plugin-i18n',
    {
      locale: {
        default: 'en',
      },
      translate: {
        support: {
          enUS: 'en-US',
          zhCN: 'zh-CN',
        },
      },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: true,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: false,
    },
  ],
];


export default {
  plugins,
  targets: {
    ie: 10,
  },
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
  // 添加反向代理
  proxy: {
    "/api": {
      "target": "http://10.45.69.14",
      "changeOrigin": true
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/spool/'
  },
  base: '/spool/',
  publicPath: '/spool/',
  history: 'hash',
  chainWebpack: webpackPlugin,
};
