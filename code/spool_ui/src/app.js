// import { notification } from 'antd';
// import { formatMessage } from 'umi/locale';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      // notification.error({
      //   message: formatMessage({ id: 'ERROR' }),
      //   description: err.message,
      // });
    },
  },
};

export function render(oldRender) {
  oldRender();
}
