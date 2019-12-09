import React from 'react';
import { Radio, Table, Divider, Modal, Select, Button, Icon, Form, message } from 'antd';
import { formatMessage } from 'umi/locale';

const { Option } = Select;
const { confirm } = Modal;

@Form.create()
class ClusterTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioVal: 1,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      filter: {
        cluster: '',
        host: '',
      },
    };
    props.getRef && props.getRef(this);
  }

  componentDidMount() {
    // 获取集群列表
    this.getClusterList();
    // 获取集群日志列表
    this.getClusterLogList();
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  // 集群列表
  getClusterList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'log/getClusterList',
    });
  };

  // 主机列表
  getNodeList = obj => {
    if (obj) {
      const { dispatch } = this.props;
      dispatch({
        type: 'log/getNodeList',
        payload: {
          cluster_uuid: obj.key,
        },
      });
    }
  };

  // 选中集群-筛选主机/卷
  onSelectCluster = obj => {
    if (obj) {
      // 筛选主机
      this.getNodeList(obj);
      // 筛选卷
      this.getVolumeList(obj);
    }
    const { form } = this.props;
    // 清除主机、卷、brick选项
    form.resetFields(['node', 'volume', 'brick']);
  };

  // 选中卷-筛选Brick
  onSelectVolume = obj => {
    if (obj) {
      this.getBrickList(obj);
    }
    const { form } = this.props;
    // 清除brick选项
    form.resetFields(['brick']);
  };

  // 查询卷列表
  getVolumeList = obj => {
    if (obj) {
      const { dispatch } = this.props;
      dispatch({
        type: 'log/getVolumeList',
        payload: { cluster: obj.key },
      });
    }
  };

  // 查询Brick列表
  getBrickList = volume => {
    const { dispatch, form } = this.props;
    const cluster = form.getFieldValue('cluster');
    if (volume && cluster) {
      dispatch({
        type: 'log/getBrickList',
        payload: {
          uuid: volume.key,
          volume_name: volume.label,
          cluster: cluster.key,
        },
      });
    }
  };

  // 集群日志列表
  getClusterLogList = current => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    // 分页
    const payload = {
      page: current || 1,
      pagesize: pagination.pageSize,
    };
    dispatch({
      type: 'log/getClusterLogList',
      payload,
    }).then(() => {
      const {
        log: { clusterLogTotal },
      } = this.props;
      this.setState({
        pagination: {
          ...pagination,
          current: current || 1,
          total: clusterLogTotal,
        },
      });
    });
  };

  // 切换单选框
  onChangeRadio = e => {
    const { value: radioVal } = e.target;
    this.setState({ radioVal });
  };

  // 表头筛选-下拉框切换事件
  onChangeSelect = (val, dataIndex) => {
    const { filter } = this.state;
    const params = { filter: { ...filter } };
    if (dataIndex === 'cluster') {
      params.filter.cluster = val;
    } else if (dataIndex === 'host') {
      params.filter.host = val;
    }
    this.setState(params);
  };

  // 表头筛选
  getColumnSelect = (dataIndex, clusterList = []) => ({
    filterDropdown: ({ confirm: yesFunc, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Select
          placeholder={formatMessage({ id: 'log_cluster_placeholder_and_tooltip' })}
          onChange={val => this.onChangeSelect(val, dataIndex)}
          style={{ width: '100%', marginBottom: 8 }}
        >
          {clusterList.map(item => (
            <Option value={item.uuid} key={item.uuid}>
              {item.name}
            </Option>
          ))}
        </Select>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            type="primary"
            onClick={() => {
              yesFunc();
              // this.getClusterLogList(1, logFilter);
            }}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {formatMessage({ id: 'common.confirm' })}
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              // this.onResetTime();
            }}
            size="small"
            style={{ width: 90 }}
          >
            {formatMessage({ id: 'common.opt.reset' })}
          </Button>
        </div>
      </div>
    ),
    filterIcon: () => <Icon type="search" style={{ color: [].length ? '#1890ff' : undefined }} />,
  });

  // 分页
  handleTableChange = pagination => {
    const { pagination: pager } = this.state;
    this.setState({
      pagination: {
        ...pager,
        current: pagination.current,
      },
    });
    this.getClusterLogList(pagination.current);
  };

  // 生成日志
  onCreateLog = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { radioVal } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        if (!(values.cluster && values.cluster.key)) {
          message.warn(formatMessage({ id: 'log_cluster_placeholder_cluster_tooltip' }));
          return;
        }
        const params = {
          cluster_name: values.cluster.label,
          cluster_uuid: values.cluster.key,
        };
        if (radioVal === 1) {
          // 集群日志下载
          if (!(values.node && values.node.key)) {
            message.warn(formatMessage({ id: 'log_cluster_placeholder_node_tooltip' }));
            return;
          }
          params.node_name = values.node.key;
        } else if (radioVal === 2) {
          // Brick日志下载
          if (!(values.volume && values.volume.key)) {
            message.warn(formatMessage({ id: 'log_cluster_placeholder_volume_tooltip' }));
            return;
          }
          if (!(values.brick && values.brick.key)) {
            message.warn(formatMessage({ id: 'log_cluster_placeholder_brick_tooltip' }));
            return;
          }
          params.volume_name = values.volume.label;
          params.brick_name = values.brick.label;
        }
        dispatch({
          type: 'log/createLog',
          payload: {
            type: radioVal === 1 ? 'cluster' : 'brick',
            ...params,
          },
        }).then(() => {
          const {
            log: { successInfo },
          } = this.props;
          message.success(successInfo);
          form.resetFields();
          this.getClusterLogList(1);
        });
      }
    });
  };

  // 删除日志
  onDelete = record => {
    const self = this;
    const { dispatch } = this.props;
    const {
      radioVal,
      pagination: { current },
    } = this.state;
    confirm({
      title: formatMessage({ id: 'common.opt.del' }),
      content: `${formatMessage({ id: 'common.opt.del.confirm' })}: ${record.logfile}?`,
      okText: formatMessage({ id: 'common.yes' }),
      cancelText: formatMessage({ id: 'common.no' }),
      maskClosable: true,
      onOk() {
        dispatch({
          type: 'log/deleteLog',
          payload: {
            type: radioVal === 1 ? 'cluster' : 'brick',
            code: record.log_uuid,
            logfile: record.logfile,
          },
        }).then(() => {
          const {
            log: { successInfo },
          } = self.props;
          message.success(successInfo);
          self.getClusterLogList(current);
        });
      },
    });
  };

  render() {
    const {
      log: {
        clusterList = [],
        nodeList = [],
        volumeList = [],
        brickList = [],
        clusterLogList = [],
      },
      clusterListLoading,
      nodeListLoading,
      volumeListLoading,
      brickListLoading,
      clusterLogListLoading,
      form: { getFieldDecorator },
    } = this.props;
    const { radioVal, pagination } = this.state;
    const selectStyle = { style: { width: 222 } };
    const columns = [
      {
        title: formatMessage({ id: 'log_cluster_table_logtype' }),
        dataIndex: 'log_type',
        width: '10%',
        render: text => {
          const type =
            text === 'cluster'
              ? formatMessage({ id: 'log_cluster' })
              : text === 'brick'
              ? 'Brick'
              : '-';
          return <span>{type}</span>;
        },
      },
      {
        title: formatMessage({ id: 'log_cluster_table_time' }),
        dataIndex: 'oper_time',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'log_cluster' }),
        dataIndex: 'cluster',
        width: '15%',
        // ...this.getColumnSelect('cluster', clusterList),
      },
      {
        title: formatMessage({ id: 'log_node' }),
        dataIndex: 'host',
        width: '15%',
      },
      {
        title: formatMessage({ id: 'log_cluster_table_volume' }),
        dataIndex: 'volume',
        width: '15%',
      },
      {
        title: formatMessage({ id: 'log_cluster_table_logfile' }),
        dataIndex: 'logfile',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'common.opt.oper' }),
        width: '15%',
        render: (_, record) => {
          const href =
            record.log_type === 'cluster'
              ? `/template/cluster/${record.logfile}`
              : record.log_type === 'brick'
              ? `/template/brick/${record.logfile}`
              : '';
          return (
            <span>
              <Button href={href} type="link" style={{ padding: 0 }}>
                {formatMessage({ id: 'common.opt.download' })}
              </Button>
              <Divider type="vertical" />
              <Button type="link" onClick={() => this.onDelete(record)} style={{ padding: 0 }}>
                {formatMessage({ id: 'common.opt.del' })}
              </Button>
            </span>
          );
        },
      },
    ];
    return (
      <React.Fragment>
        <Radio.Group onChange={this.onChangeRadio} value={radioVal} style={{ marginBottom: 16 }}>
          <Radio value={1}>{formatMessage({ id: 'log_cluster_log_download' })}</Radio>
          <Radio value={2}>{formatMessage({ id: 'log_cluster_brick_download' })}</Radio>
        </Radio.Group>
        <Form
          layout="inline"
          onSubmit={this.onCreateLog}
          style={{ marginBottom: 16, lineHeight: '40px' }}
        >
          <Form.Item label={formatMessage({ id: 'log_cluster' })}>
            {getFieldDecorator('cluster', {
              // rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Select
                allowClear
                labelInValue
                loading={clusterListLoading}
                placeholder={formatMessage({ id: 'log_cluster_placeholder_cluster_tooltip' })}
                onChange={this.onSelectCluster}
                {...selectStyle}
              >
                {clusterList.map(item => (
                  <Option key={item.uuid} value={item.uuid}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {radioVal === 1 ? (
            <Form.Item label={formatMessage({ id: 'log_node' })}>
              {getFieldDecorator('node', {
                // rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Select
                  allowClear
                  labelInValue
                  loading={nodeListLoading}
                  placeholder={formatMessage({ id: 'log_cluster_placeholder_node_tooltip' })}
                  {...selectStyle}
                >
                  {nodeList.map(item => (
                    <Option key={item.sn} value={item.sn}>
                      {item.hostname}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            <React.Fragment>
              <Form.Item label={formatMessage({ id: 'log_volume' })}>
                {getFieldDecorator('volume', {
                  // rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Select
                    allowClear
                    labelInValue
                    loading={volumeListLoading}
                    placeholder={formatMessage({ id: 'log_cluster_placeholder_volume_tooltip' })}
                    onChange={this.onSelectVolume}
                    {...selectStyle}
                  >
                    {volumeList.map(item => (
                      <Option key={item.uuid} value={item.uuid}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Brick">
                {getFieldDecorator('brick', {
                  // rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Select
                    labelInValue
                    loading={brickListLoading}
                    placeholder={formatMessage({ id: 'log_cluster_placeholder_brick_tooltip' })}
                    {...selectStyle}
                  >
                    {brickList.map(item => (
                      <Option key={item.uuid} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </React.Fragment>
          )}
          <Button type="primary" htmlType="submit">
            {formatMessage({ id: 'log_cluster_log_generate' })}
          </Button>
        </Form>
        <Table
          rowKey="log_uuid"
          size="small"
          loading={clusterLogListLoading}
          columns={columns}
          dataSource={clusterLogList}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </React.Fragment>
    );
  }
}

export default ClusterTab;
