import withIntl, { parseArguments } from 'umi/withIntl';
import { handleMessages } from './utils';

export default (...arg) => {
  const { options } = parseArguments(arg);
  return withIntl({
    host: window.location.origin,
    resHandler: res => handleMessages(res),
    ...options,
  });
};
