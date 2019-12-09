import { join } from 'path';

export default [
  [
    'umi-plugin-react',
    {
      antd: true,
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
  // ['umi-plugin-menus', {
  //   build: join(__dirname, './routes.json'),
  // }],
  [
    'umi-plugin-pro-block',
    {
      moveMock: true,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: false,
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
];
