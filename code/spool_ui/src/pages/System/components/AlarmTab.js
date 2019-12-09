import React from 'react';
import { Form, Table, Modal, Icon, Tooltip, message, Badge, Divider, InputNumber } from 'antd';
import { formatMessage } from 'umi/locale';

const { confirm } = Modal;

class AlarmTab extends React.Component {
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
    // 获取告警设置列表
    this.getThresholdList();
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  // 获取告警设置列表
  getThresholdList = current => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    // 分页
    const payload = {
      page: current || 1,
      pagesize: pagination.pageSize,
    };
    dispatch({
      type: 'system/getThresholdList',
      payload,
    }).then(() => {
      const {
        system: { thresholdTotal },
      } = this.props;
      this.setState({
        pagination: {
          ...pagination,
          current: current || 1,
          total: thresholdTotal,
        },
      });
    });
  };

  // 修改/启用/禁用
  onOper = (type, record) => {
    if (type === 'edit') {
      this.setState({
        visible: true,
        operInfo: record,
      });
    } else {
      const self = this;
      const { dispatch } = this.props;
      const text =
        type === 'enable'
          ? formatMessage({ id: 'common.opt.enable.confirm' })
          : formatMessage({ id: 'common.opt.disable.confirm' });
      confirm({
        title: type === 'enable' ? 'Enable' : 'Disable',
        content: `${text}: ${record.uuid}?`,
        okText: formatMessage({ id: 'common.yes' }),
        cancelText: formatMessage({ id: 'common.no' }),
        maskClosable: true,
        onOk() {
          dispatch({
            type: 'system/operThreshold',
            payload: {
              type,
              uuid: record.uuid,
            },
          }).then(() => {
            const {
              system: { successInfo },
            } = self.props;
            message.success(successInfo);
            self.onRefresh();
          });
        },
      });
    }
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
    this.getThresholdList(pagination.current);
  };

  // 修改后刷新
  onRefresh = () => {
    const {
      pagination: { current },
    } = this.state;
    this.getThresholdList(current);
  };

  render() {
    const {
      system: { thresholdList = [] },
      thresholdListLoading,
    } = this.props;
    const { pagination, visible, operInfo } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'system_table_alarmitem' }),
        dataIndex: 'uuid',
        width: '20%',
        render: text => formatMessage({ id: `system_table_${text}` }) || '-',
      },
      {
        title: formatMessage({ id: 'system_table_triger' }),
        dataIndex: 'threshold',
        width: '20%',
        render: (text, record) => {
          if (record.uuid !== 'brick_inode_usage' && record.uuid !== 'brick_capacity_usage') {
            return formatMessage({ id: `system_table_threshold_${record.uuid}` }) || '-';
          }
          return text;
        },
      },
      {
        title: formatMessage({ id: 'system_table_level' }),
        dataIndex: 'level',
        width: '10%',
        render: text => {
          const color = text === 'critical' ? '#dd1916' : '#f1a81f';
          const name =
            text === 'critical'
              ? formatMessage({ id: 'system_table_critical' })
              : formatMessage({ id: 'system_table_warning' });
          return <Badge color={color} text={name} />;
        },
      },
      {
        title: formatMessage({ id: 'system_table_scan_time' }),
        dataIndex: 'scan_frequency',
        width: '10%',
        render: text => `${text}s`,
      },
      {
        title: formatMessage({ id: 'system_table_scan_count' }),
        dataIndex: 'scan_count',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'common.opt.status' }),
        dataIndex: 'enabled',
        width: '10%',
        render: text => {
          const color = text === 'true' ? '#58b431' : '#d9d9d9';
          const name =
            text === 'true'
              ? formatMessage({ id: 'common.opt.enable' })
              : formatMessage({ id: 'common.opt.disable' });
          return <Badge color={color} text={name} />;
        },
      },
      {
        title: formatMessage({ id: 'common.opt.oper' }),
        width: '20%',
        render: (_, record) => (
          <React.Fragment>
            <Tooltip title={formatMessage({ id: 'common.opt.edit' })}>
              <Icon type="edit" theme="twoTone" onClick={() => this.onOper('edit', record)} />
            </Tooltip>
            <Divider type="vertical" />
            {record.enabled === 'true' ? (
              <Tooltip title={formatMessage({ id: 'common.opt.disable' })}>
                <Icon
                  type="close-circle"
                  theme="twoTone"
                  onClick={() => this.onOper('disable', record)}
                />
              </Tooltip>
            ) : (
              <Tooltip title={formatMessage({ id: 'common.opt.enable' })}>
                <Icon
                  type="check-circle"
                  theme="twoTone"
                  onClick={() => this.onOper('enable', record)}
                />
              </Tooltip>
            )}
          </React.Fragment>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Table
          rowKey="uuid"
          size="small"
          loading={thresholdListLoading}
          columns={columns}
          dataSource={thresholdList}
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

export default AlarmTab;

@Form.create()
class OperModal extends React.Component {
  // 提交
  handleOk = e => {
    e.preventDefault();
    const { form, operInfo, dispatch, onRefresh } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const params = {
          uuid: operInfo.uuid,
          scan_frequency: values.scan_frequency,
          scan_count: values.scan_count,
        };
        // 使用率，带参数threshold
        if (operInfo.uuid === 'brick_inode_usage' || operInfo.uuid === 'brick_capacity_usage') {
          if (values.threshold) {
            if (`${values.threshold}`.includes('%')) {
              params.threshold = values.threshold;
            } else {
              params.threshold = `${values.threshold}%`;
            }
          } else {
            params.threshold = '0%';
          }
        }
        dispatch({
          type: 'system/editThreshold',
          payload: params,
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

  // 触发条件可以为文本或百分比
  onGetDiffItem = () => {
    const { operInfo } = this.props;
    return operInfo.uuid === 'brick_inode_usage' || operInfo.uuid === 'brick_capacity_usage' ? (
      <InputNumber
        min={0}
        max={100}
        precision={0}
        formatter={value => `${value}%`}
        parser={value => value.replace('%', '')}
      />
    ) : (
      <span className="ant-form-text">{operInfo.threshold}</span>
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      operInfo,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
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
          <Form.Item label={formatMessage({ id: 'system_table_alarmitem' })}>
            <span className="ant-form-text">{operInfo.uuid}</span>
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'system_table_triger' })}>
            {getFieldDecorator('threshold', {
              initialValue: operInfo.threshold || 0,
            })(this.onGetDiffItem())}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'system_table_level' })}>
            <span className="ant-form-text">
              {operInfo.level === 'critical'
                ? formatMessage({ id: 'system_table_critical' })
                : formatMessage({ id: 'system_table_warning' })}
            </span>
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'system_table_scan_time' })}>
            {getFieldDecorator('scan_frequency', {
              initialValue: operInfo.scan_frequency || 1,
            })(
              <InputNumber
                min={1}
                precision={0}
                formatter={value => `${value}s`}
                parser={value => value.replace('s', '')}
              />
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'system_table_scan_count' })}>
            {getFieldDecorator('scan_count', {
              initialValue: operInfo.scan_count || 1,
            })(<InputNumber min={1} precision={0} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
