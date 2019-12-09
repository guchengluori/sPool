import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { withIntl } from 'umi/withIntl';
import { Alert, Input, Form, Select } from 'antd';
import Login from '@/components/Login';
import styles from './index.less';

const FormItem = Form.Item;
const { Submit } = Login;
const { Option } = Select;

@withIntl('UserLogin')
@Form.create()
@connect(({ login, user, setting, menu, loading }) => ({
  login,
  user,
  setting,
  menu,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'user',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = () => {
    const self = this;
    const { type } = this.state;
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
            type,
          },
        }).then(() => {
          const {
            login: { currentAuthority },
          } = self.props;
          dispatch({
            type: 'user/saveCurrentUser',
            payload: { name: currentAuthority },
          });
          dispatch({
            type: 'setting/getSetting',
          });
          dispatch({
            type: 'menu/getMenuData',
            payload: { routes: window.g_routes[0].routes },
          });
        });
      }
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  // 切换国际化
  handleChange = key => {
    setLocale(key);
  };

  render() {
    const {
      submitting,
      form: { getFieldDecorator },
    } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div className={styles.mainbox}>
            <Form>
              <p>{formatMessage({ id: 'app.login.userName' })}</p>
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.userName.required' }),
                    },
                  ],
                })(<Input size="default" autoComplete="off" />)}
              </FormItem>
              <p>{formatMessage({ id: 'app.login.password' })}</p>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.password.required' }),
                    },
                  ],
                })(<Input type="password" autoComplete="off" />)}
              </FormItem>
            </Form>
            {/* 切换国际化 */}
            <Select
              defaultValue={getLocale()}
              onChange={this.handleChange}
              style={{ display: 'flex', justifyContent: 'flex-start' }}
            >
              <Option value="zh-CN">简体中文</Option>
              <Option value="en-US">English</Option>
            </Select>
            <Submit loading={submitting}>
              <FormattedMessage id="app.login.login" />
            </Submit>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
