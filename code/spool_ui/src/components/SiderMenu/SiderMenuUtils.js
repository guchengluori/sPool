import pathToRegexp from 'path-to-regexp';
import { isArray, forEach } from 'lodash';
import { urlToList } from '../_utils/pathTools';

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menus
 */
export const getFlatMenuKeys = menuData => {
  let keys = [];
  menuData.forEach(item => {
    keys.push(item.path);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });
/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
export const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
  } = props;
  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};

export const getItemPath = (path, menuData) => {
  if (!path) return;
  const pathArr = [];
  let flag = false;
  const getPath = (arr, o) => {
    let findit = false;
    let oCopy = o;
    if (oCopy.path) arr.push(oCopy.path);
    if (!isArray(oCopy)) oCopy = oCopy.children;
    forEach(oCopy, v => {
      if (flag) return false;
      if (v.children) {
        getPath(arr, v);
      } else if (v.path === path || path.startsWith(v.path)) {
        flag = true;
        findit = true;
        arr.push(v.path);
        return false;
      }
      return null;
    });
    if (!flag && !findit) arr.pop();
  };
  getPath(pathArr, menuData);
  /* eslint-disable*/
  return pathArr;
};
