import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {
    Modal,
    Form,
    Input,
    message,
} from 'antd';

@Form.create()
@connect(({ hostMgmt }) => ({
  hostMgmt,
}))
class OperationModal extends React.Component {
  state = {
    // request: false,
  };

  componentDidMount() {
    
  };


  handleSubmit = e => {
    e.preventDefault();
    const { form, operInfo } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const handleValues = {...values};
        const { dispatch, operTitle } = this.props;
        const self = this;
        if (operTitle !== "common.opt.add") {
          handleValues.sn = operInfo.sn;
        }
        dispatch({
          type: operTitle === 'common.opt.add' ? 'hostMgmt/add' : 'hostMgmt/update',
          payload: handleValues,
        }).then(() => {
          const {
            hostMgmt: { successInfo },
            onRefresh,
          } = self.props;
          message.success(successInfo);
          self.onCancel();
          onRefresh();
        });
      }
    });
  };

  onCancel = () => {
    const { onCancel, form } = this.props;
    onCancel();
    form.resetFields();
  };

  render() {
    const {
      visible,
      operTitle,
      form: { getFieldDecorator },
      operInfo,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };

    return (
      <Modal
        title={formatMessage({ id: operTitle })}
        visible={visible}
        maskClosable={false}
        onOk={this.handleSubmit}
        onCancel={this.onCancel}
      >
        <Form>
          <Form.Item label={formatMessage({ id: 'host.form.ip'})} {...formItemLayout}>
            {getFieldDecorator('ip', {
              rules: [
                { required: true, message: formatMessage({ id: 'host.form.ip.required' }) },
                { message: formatMessage({ id: 'host.form.ip.pattern' }), pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/ }
              ],
              initialValue: operTitle === 'common.opt.add' ? '' : operInfo.ip,
            })(
              <Input
                placeholder={formatMessage({ id: 'host.form.ip.required' })}
                autoComplete="new-password"
                disabled={operTitle === 'common.opt.edit'}
              />
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'host.form.username'})} {...formItemLayout}>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: formatMessage({ id: 'host.form.username.required' }) },
              ],
              initialValue: operTitle === 'common.opt.add' ? '' : operInfo.username,
            })(
              <Input
                placeholder={formatMessage({ id: 'host.form.username.required' })}
                autoComplete="new-password"
              />
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'host.form.password'})} {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: formatMessage({ id: 'host.form.password.required' }) },
              ],
              initialValue: operTitle === 'common.opt.add' ? '' : operInfo.password,
            })(
              <Input.Password
                placeholder={formatMessage({ id: 'host.form.password.required' })}
                autoComplete="new-password"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default OperationModal;