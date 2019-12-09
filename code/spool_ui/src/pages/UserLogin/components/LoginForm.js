import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Icon, Input, Button } from 'antd';
import { connect } from 'dva';
import { btn } from '../index.less';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'login/login',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label={formatMessage({ id: 'app.login.username' })}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'The field is required.' }],
          })(
          // <Input size="default" autoComplete="off" />
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'app.login.password' })}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'The field is required.' }],
          })(<Input type="password" autoComplete="off" />)}
        </FormItem>
        <FormItem>
          <Button type="default" htmlType="submit" className={btn}>
            <Icon type="arrow-right" />
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default connect(({ login }) => ({
  login,
}))(Form.create()(NormalLoginForm));
