import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { initialToLower, arrayToTree } from '@/utils/utils';
import Exception404 from '../pages/404';
import { queryMenus, getOperRead } from '@/services/user';

// Conversion router to menu.
function formatter(data) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }
      const result = {
        ...item,
      };
      if (item.children) {
        const children = formatter(item.children);
        // Reduce memory usage
        result.children = children;
      }
      return result;
    })
    .filter(item => item);
}

function handleRouter(data) {
  return data
    .map(item => {
      const { path = '/' } = item;
      const etem = {
        ...item,
      };
      if (path !== '/' && path.indexOf('UserLogin') < 0) {
        etem.name = initialToLower(path.split('/')[1]);
        etem.icon = 'smile';
      }
      return etem;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get menuIl8n
 */
const getMessages = (data, key = 'il8n', id = 'name') => {
  const il8nArr = [];
  data.map(menu => {
    il8nArr.push({
      id: menu[id],
      ...menu[key],
    });
    return null;
  });
  return il8nArr;
};

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => getSubMenu(item))
    .filter(item => item);
};

/**
 * filter allMenuData
 */
const filterAllMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name)
    .map(item => getSubMenu(item))
    .filter(item => item);
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    breadcrumbNameMap: {},
    menuMessages: [], // 菜单国际化数据
    pendingNum: 0,
    errorNum: 0,
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      // 注释模板原有逻辑
      // const { data } = yield call(queryMenus);
      // let menuData = [];
      // let menuMessages = [];
      // if (data.length > 0) {
      //   menuData = filterMenuData(memoizeOneFormatter(arrayToTree(data)));
      //   menuMessages = getMessages(data);
      // } else {
      //   const { routes } = payload;
      //   const routesMenu = handleRouter(routes);
      //   menuData = filterMenuData(memoizeOneFormatter(routesMenu));
      // }
      const { routes } = payload;
      routes.splice(routes.length - 1, 0, { component: Exception404 });
      const menuData = filterMenuData(memoizeOneFormatter(routes));
      menuData.sort((a, b) => (a.order && b.order ? a.order - b.order : 0));
      const allMenuData = filterAllMenuData(memoizeOneFormatter(routes));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(allMenuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },
      });
    },

    // 操作日志-已读未读标记
    *getOperRead({ payload }, { call, put }) {
      const data = yield call(getOperRead, payload);
      const pendingNum = (data && data.response.data && data.response.data.pending) || 0;
      const errorNum = (data && data.response.data && data.response.data.error) || 0;
      yield put({ type: 'save', payload: { pendingNum, errorNum } });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
