import { formatMessage } from 'umi/locale';
import { notification } from 'antd';
import ax from './axiosWrap';
import { getWebRoot } from './utils';

const codeMessage = {
  200: formatMessage({ id: 'REQUEST_200' }),
  201: formatMessage({ id: 'REQUEST_201' }),
  202: formatMessage({ id: 'REQUEST_202' }),
  204: formatMessage({ id: 'REQUEST_204' }),
  400: formatMessage({ id: 'REQUEST_400' }),
  401: formatMessage({ id: 'REQUEST_401' }),
  403: formatMessage({ id: 'REQUEST_403' }),
  404: formatMessage({ id: 'REQUEST_404' }),
  406: formatMessage({ id: 'REQUEST_406' }),
  410: formatMessage({ id: 'REQUEST_410' }),
  422: formatMessage({ id: 'REQUEST_422' }),
  500: formatMessage({ id: 'REQUEST_500' }),
  502: formatMessage({ id: 'REQUEST_502' }),
  503: formatMessage({ id: 'REQUEST_503' }),
  504: formatMessage({ id: 'REQUEST_504' }),
};

function matchCodeMes(response) {
  const errortext = response.message || codeMessage[response.status];
  return errortext;
}

function responseErrorHandler(error, ifThrow) {
  const result = {
    success: false,
    data: null,
    errorMsg: undefined,
  };
  let message;
  let code;
  const { data, status } = error.response;
  if (data) {
    ({ message, code } = data);
  }

  if (code === undefined) {
    code = status;
  }
  message = matchCodeMes(data);

  if (message === undefined) {
    message = error.message || error;
  }

  if (code === undefined) {
    code = -1;
  }
  if (code === 'S-SYS-00027' && error.config.url.indexOf('logout') <= -1) {
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
  }

  if (ifThrow) {
    notification.error({
      message: formatMessage({ id: 'REQUEST_ERROR' }),
      description: message,
    });
  }

  result.errorMsg = message;
  result.data = data;
  // eslint-disable-next-line prefer-promise-reject-errors
  return result;
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
// 业务侧可根据具体要求自行封装
export default function request(url, option, ifThrow = true) {
  const options = {
    ...option,
  };

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  let urlN = url.indexOf('http') > -1 ? url : getWebRoot() + url;
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'PATCH' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
        ...newOptions.headers,
      };
      if (typeof newOptions.body !== 'string') newOptions.body = JSON.stringify(newOptions.body);
      newOptions.data = newOptions.body;
      delete newOptions.body;
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  } else {
    newOptions.headers = {
      'X-Requested-With': 'XMLHttpRequest',
      ...newOptions.headers,
    };
    const symbol = urlN.indexOf('?') > -1 ? '&' : '?';
    urlN += `${symbol}_=${Math.random()}`;
  }

  const config = {
    url: urlN,
    ...newOptions,
  };
  return ax
    .request(config)
    .then(response => {
      const result = {
        success: true,
        data: response.data,
        errorMsg: undefined,
      };
      return result;
    })
    .catch(error => {
      if (error.response) {
        return responseErrorHandler(error, ifThrow);
      }
      return null;
    });
}
