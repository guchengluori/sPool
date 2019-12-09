/**
 * 用户鉴权 session 控制类
 * 提供外部放大  
 * getAuthority 获取session信息
 * setAuthority 设置 session 方法
 * 
 * 将权限信息存入localStorage key为 sPool-authority
 */
/**
 * 权限获取
 */
export function getAuthority(str) {
  // return localStorage.getItem('sPool-authority') || ['admin', 'user'];
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('sPool-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['root'];
}

/**
 * 权限设置
 * @param {*} authority 
 */
export function setAuthority(authority) {
  if (authority === null) {
    return localStorage.removeItem('sPool-authority');
  }
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('sPool-authority', JSON.stringify(proAuthority));
}
