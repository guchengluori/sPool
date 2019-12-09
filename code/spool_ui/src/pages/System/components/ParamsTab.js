import React from 'react';
import { Table, Modal, Icon, Tooltip, message, Form, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import { createWebSocket } from '@/utils/utils';

class ParamsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      visible: false, // 修改弹窗
      operInfo: {}, // 修改信息
    };
  }

  componentDidMount() {
    // 获取系统参数列表
    this.getParamsList();
    // 建立websocket连接
    this.getWebSocket();
  }

  componentWillUnmount() {
    this.onCloseWS();
    this.setState = () => {};
  }

  onCloseWS = () => {
    this.client && this.client.close();
  };

  getWebSocket = () => {
    this.onCloseWS();
    // 开始建立连接
    this.client = createWebSocket();
    console.log('%o', '正在建立连接', this.client.readyState);
    // 开始传参通信
    this.client.onopen = () => {
      const param = {
        monitor: ['system_param_list'],
      };
      console.log('%o', '已连接，传参通信', this.client.readyState);
      this.client.send(JSON.stringify(param));
    };
    // 接收服务端推送的数据
    this.client.onmessage = evt => {
      const obj = JSON.parse(evt.data) || {};
      console.log('接收数据', obj);
      const { activeKey } = this.props;
      if (obj.system_param_list && activeKey === 'params') {
        this.getParamsList();
      }
    };
    // 关闭webSocket连接
    this.client.onclose = error => console.log('断开连接', error.code);
  };

  // 获取系统参数列表
  getParamsList = current => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    // 分页
    const payload = {
      page: current || 1,
      pagesize: pagination.pageSize,
    };
    dispatch({
      type: 'system/getParamsList',
      payload,
    }).then(() => {
      const {
        system: { paramsTotal },
      } = this.props;
      this.setState({
        pagination: {
          ...pagination,
          current: current || 1,
          total: paramsTotal,
        },
      });
    });
  };

  // 分页
  handleTableChange = pagination => {
    const { pagination: pager } = this.state;
    this.setState({
      pagination: {
        ...pager,
        current: pagination.current,
      },
    });
    this.getParamsList(pagination.current);
  };

  // 修改后刷新
  onRefresh = () => {
    const {
      pagination: { current },
    } = this.state;
    this.getParamsList(current);
  };

  render() {
    const {
      system: { paramsList = [] },
      paramsListLoading,
    } = this.props;
    const { pagination, visible, operInfo } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'system_params_name' }),
        dataIndex: 'name',
        width: '40%',
      },
      {
        title: formatMessage({ id: 'system_params_value' }),
        dataIndex: 'value',
        width: '40%',
      },
      {
        title: formatMessage({ id: 'common.opt.oper' }),
        width: '20%',
        render: (_, record) => (
          <Tooltip title={formatMessage({ id: 'common.opt.edit' })}>
            <Icon
              type="edit"
              theme="twoTone"
              onClick={() =>
                this.setState({
                  visible: true,
                  operInfo: record,
                })
              }
            />
          </Tooltip>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Table
          rowKey="name"
          size="small"
          loading={paramsListLoading}
          columns={columns}
          dataSource={paramsList}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
        <OperModal
          visible={visible}
          operInfo={operInfo}
          onCancel={() => {
            this.setState({ visible: false, operInfo: {} });
          }}
          onRefresh={this.onRefresh}
          {...this.props}
        />
      </React.Fragment>
    );
  }
}

export default ParamsTab;

@Form.create()
class OperModal extends React.Component {
  // 提交
  handleOk = e => {
    e.preventDefault();
    const { form, dispatch, onRefresh } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          name: values.name.trim(),
          value: values.value.trim(),
        };
        dispatch({
          type: 'system/editParams',
          payload,
        }).then(() => {
          const {
            system: { successInfo },
          } = this.props;
          message.success(successInfo);
          this.onCancel();
          onRefresh();
        });
      }
    });
  };

  // 重置表单，关闭弹窗
  onCancel = () => {
    const { form, onCancel } = this.props;
    onCancel();
    form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      operInfo,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    return (
      <Modal
        title={formatMessage({ id: 'common.opt.edit' })}
        visible={visible}
        onOk={this.handleOk}
        maskClosable={false}
        onCancel={this.onCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label={formatMessage({ id: 'system_params_name' })}>
            {getFieldDecorator('name', {
              initialValue: operInfo.name || '',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'system_params_name_placeholder' }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'system_params_value' })}>
            {getFieldDecorator('value', {
              initialValue: operInfo.value || '',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'system_params_value_placeholder' }),
                },
              ],
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
