import React from 'react';
import { getLocale } from 'umi/locale';
import { EventEmitter } from 'events';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function initialToLower(str) {
  if (typeof str !== 'string') return str;
  return str.replace(str[0], str[0].toLowerCase());
}

export function getWebRoot() {
  let webroot = document.location.href;
  webroot = webroot.substring(webroot.indexOf('//') + 2, webroot.length);
  webroot = webroot.substring(webroot.indexOf('/') + 1, webroot.length);
  webroot = webroot.substring(0, webroot.indexOf('/'));
  webroot = webroot.replace('index.html', '');
  webroot = webroot === '#' ? '' : webroot;
  const rootpath = webroot.length <= 0 ? '' : `/${webroot}`;
  return rootpath;
}

export function arrayToTree(array, id = 'menuId', pid = 'parentId', children = 'children') {
  const data = JSON.parse(JSON.stringify(array));
  const result = [];
  const hash = {};
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach(item => {
    const hashVP = hash[item[pid]];
    if (hashVP) {
      if (!hashVP[children]) {
        hashVP[children] = [];
      }
      hashVP[children].push(item);
    } else {
      const etem = item;
      if (!etem.children) etem.children = [];
      etem.children = [];
      result.push(etem);
    }
  });
  return result;
}

export function getMessages(data, key = 'il8n', id = 'name') {
  const il8nArr = [];
  data.map(menu => {
    il8nArr.push({
      id: menu[id],
      ...menu[key],
    });
    return null;
  });
  return il8nArr;
}

export function getDefaultLang() {
  const support = {
    'en-US': 'enUS',
    'zh-CN': 'zhCN',
    'zh-TW': 'zhTW',
    'zh-HK': 'zhHK',
  };
  return support[getLocale()] || support[Object.keys(support)[0]];
}

export function handleMessages(res) {
  const messages = getMessages(res);
  let newMessages = {};
  const lang = getDefaultLang();
  messages.map(message => {
    const { id } = message;
    newMessages = {
      ...newMessages,
      [id]: message[lang],
    };
    return null;
  });
  return newMessages;
}

// 只做一件事，把`WrappedComponent`回传个`getInstance`（如果有的话）
export const withRef = WrappedComponent =>
  class extends React.Component {
    state = {};

    render() {
      // 这里重新定义一个props的原因是，你直接去修改this.props.ref在react开发模式下会报错，不允许你去修改
      const props = { ...this.props };
      // 在这里把getInstance赋值给ref，传给`WrappedComponent`，这样就getInstance能获取到`WrappedComponent`实例
      props.ref = el => {
        const { getInstance, ref } = this.props;
        if (getInstance) {
          getInstance(el);
        }
        if (ref) {
          ref(el);
        }
      };
      return <WrappedComponent {...props} />;
    }
  };

export const emitter = new EventEmitter();

const logActive = { key: '' };
export { logActive };
export const onChangeLogActiveKey = key => {
  if (key) {
    logActive.key = key;
  } else {
    logActive.key = '';
  }
};

export const createWebSocket = () => {
  let client;
  if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
    // 生产环境
    client = new WebSocket(`ws://${window.location.hostname}:9091/websocket`);
  } else {
    // 开发环境
    client = new WebSocket(`ws://10.45.69.15:9091/websocket`);
  }
  return client;
}
