import React, { Component } from 'react';
import { Tag, Spin, Icon, Radio, Select, Popover, Button, Pagination, Empty } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../index.less';

const { Option } = Select;

export const getAlarmContent = data => {
  /**
   * 告警内容国际化规范
   * 
    volume_split_brain: 
      '集群:' + cluster_name + 
      '卷:' + volume['volume_name'] + '存在脑裂状态'
    host_status: 
      '主机' + node['node_info']['ip'] + '的系统状态为离线'
    cluster_status: 
      '集群' + cluster['cluster_info']['alias'] + '状态异常'
    cluster_service_status: 
      '集群'+ node_cluster_name + 
      '主机'+ node['node_info']['hostname'] + '的系统状态为离线'
    brick_status: 
      '集群:' + cluster_name + 
      '卷:' + volume + 
      'brick:' + brick + '异常'
    brick_inode_usage: 
      '集群:' + cluster_name + 
      '卷:' + volume + 
      'brick:' + brick + 
      'iNode使用率' + str(brick_inode_use) + '超出阈值'
    brick_capacity_usage: 
      '集群:' + cluster_name + 
      '卷:' + volume + 
      'brick:' + brick + 
      '空间使用率' + str(brick_capactiy_use) + '超过阈值'
  */
  const name =
    data.alert_item === 'host_status'
      ? `${formatMessage({ id: 'log_node' })}: ${data.node}`
      : `${formatMessage({ id: 'log_cluster' })}: ${data.cluster}`;
  const volume = `${formatMessage({ id: 'log_volume' })}: ${data.volume}`;
  const brick = `Brick: ${data.brick}`;
  const hasVolume =
    data.alert_item === 'volume_split_brain' ||
    data.alert_item === 'brick_inode_usage' ||
    data.alert_item === 'brick_capacity_usage' ||
    data.alert_item === 'brick_status';
  const hasBrick =
    data.alert_item === 'brick_inode_usage' ||
    data.alert_item === 'brick_capacity_usage' ||
    data.alert_item === 'brick_status';
  return (
    <div className={styles.alarm_content}>
      {/* 集群或主机名 */}
      <span>{name}</span>
      {/* 主机 */}
      {data.alert_item === 'cluster_service_status' ? (
        <span>{`${formatMessage({ id: 'log_node' })}: ${data.node}`}</span>
      ) : null}
      {/* 集群状态异常 */}
      {data.alert_item === 'cluster_status' ? (
        <span>{formatMessage({ id: 'log_alarm_error_status' })}</span>
      ) : null}
      {/* 主机的系统状态为离线 */}
      {data.alert_item === 'host_status' || data.alert_item === 'cluster_service_status' ? (
        <span>{formatMessage({ id: 'log_alarm_node_offline' })}</span>
      ) : null}
      {/* 卷名 */}
      {hasVolume ? <span>{volume}</span> : null}
      {data.alert_item === 'volume_split_brain' ? (
        <span>{formatMessage({ id: 'log_alarm_volume_split_brain' })}</span>
      ) : null}
      {/* brick */}
      {hasBrick ? <span>{brick}</span> : null}
      {/* brick异常 */}
      {data.alert_item === 'brick_status' ? (
        <span>{formatMessage({ id: 'log_alarm_error' })}</span>
      ) : null}
      {/* Brick iNode使用率/Brick空间使用率 */}
      {data.alert_item === 'brick_inode_usage' || data.alert_item === 'brick_capacity_usage' ? (
        <React.Fragment>
          <span>
            {`${formatMessage({ id: `system_table_${data.alert_item}` })}: ${
              data.alert_item === 'brick_inode_usage'
                ? data.brick_inode_use
                : data.brick_capactiy_use
            }`}
          </span>
          <span>{formatMessage({ id: 'log_alarm_morethan' })}</span>
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default class AlarmTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      criticalColor: '#dd1916',
      warningColor: '#f1a81f',
      // 存储表头上的过滤数据
      filter: {
        alert_item: '', // 表头-告警项-uuid
        cluster: '',
        cluster_id: '',
        node: '',
        node_sn: '',
        volume: '',
        volume_id: '',
        level: '',
        alert_item_bool: false, // 表头-告警项-未筛选-(true表示已筛选，高亮图标)
        cluster_bool: false,
        node_bool: false,
        volume_bool: false,
        level_bool: false,
      },
      visible: {
        alert_item: false, // 手动控制弹层的显隐，因为确定或重置需默认隐藏
        cluster: false,
        node: false,
        volume: false,
        level: false,
      },
      // 接口请求优化，不要一次性请求五个接口，点开弹层时请求对应的接口且请求一次即可
      haha: {
        alert_item: false,
        cluster: false,
        node: false,
        volume: false,
      },
    };
  }

  componentDidMount() {
    // 告警日志列表
    this.getAlarmLogList();
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  // 告警日志列表
  getAlarmLogList = (current, filter, type) => {
    const { dispatch } = this.props;
    const { pagination, filter: filterOld } = this.state;
    // 分页
    const payload = {
      page: current || 1,
      pagesize: pagination.pageSize,
    };
    // 表头过滤
    let obj = '';
    if (type === 'changeTab') {
      obj = filterOld;
    } else {
      obj = filter;
    }
    if (obj) {
      const params = {};
      // 过滤空值以及高亮图标的bool值
      Object.keys(obj).forEach(item => {
        if (obj[item] && obj[item] !== true) {
          params[item] = obj[item];
        }
      });
      Object.assign(payload, params);
    }
    dispatch({
      type: 'log/getAlarmLogList',
      payload,
    }).then(() => {
      const {
        log: { alarmLogTotal },
      } = this.props;
      this.setState({
        pagination: {
          ...pagination,
          current: current || 1,
          total: alarmLogTotal,
        },
      });
    });
  };

  // 分页
  onChangePage = page => {
    const { filter } = this.state;
    this.getAlarmLogList(page, filter);
  };

  // 选中下拉框
  onSelectFilter = (obj, item) => {
    if (obj) {
      const { filter } = this.state;
      this.setState({
        filter: {
          ...filter,
          [item.name]: obj.label,
          [item.id]: obj.key,
        },
      });
    }
  };

  // 选中严重/告警单选项
  onChangeRadio = e => {
    const { value } = e.target;
    const { filter } = this.state;
    this.setState({
      filter: {
        ...filter,
        level: value,
      },
    });
  };

  // 确定过滤/重置-高亮图标
  onFilterData = (type, item) => {
    const { filter, visible } = this.state;
    const val = `${[item.name]}_bool`;
    const temp = {};
    if (type === 'reset') {
      temp[item.name] = '';
      temp[item.id] = '';
    }
    const params = {
      ...filter,
      ...temp,
      [val]: type === 'confirm',
    };
    // 高亮图标
    this.setState({
      filter: params,
      visible: {
        ...visible,
        [item.name]: false,
      },
    });
    // 刷新
    this.getAlarmLogList(1, params);
  };

  // 控制弹层显隐
  onVisibleChange = (bool, item) => {
    const { dispatch } = this.props;
    const { visible, haha } = this.state;
    // 接口拆分优化，判断是否请求过对应类型的接口，请求一次即可
    if (!haha[item.name] && item.name === 'alert_item') {
      dispatch({
        type: 'log/getThresholdList',
      });
    } else if (!haha[item.name] && item.name === 'cluster') {
      dispatch({
        type: 'log/getClusterList',
      });
    } else if (!haha[item.name] && item.name === 'node') {
      dispatch({
        type: 'log/getNodeList',
      });
    } else if (!haha[item.name] && item.name === 'volume') {
      dispatch({
        type: 'log/getVolumeList',
      });
    }
    this.setState({
      visible: {
        ...visible,
        [item.name]: bool,
      },
      haha: {
        ...haha,
        [item.name]: true,
      },
    });
  };

  // 渲染需要过滤的表头组件
  getTipContent = item => {
    const {
      log: { thresholdList = [], clusterList = [], nodeList = [], volumeList = [] },
      thresholdListLoading,
      clusterListLoading,
      nodeListLoading,
      volumeListLoading,
    } = this.props;
    const { filter } = this.state;
    let dataSource = [];
    let loading = false;
    if (item.name === 'alert_item') {
      dataSource = thresholdList;
      loading = thresholdListLoading;
    } else if (item.name === 'cluster') {
      dataSource = clusterList;
      loading = clusterListLoading;
    } else if (item.name === 'node') {
      dataSource = nodeList.map(node => ({ uuid: node.sn, name: node.hostname || node.ip }));
      loading = nodeListLoading;
    } else if (item.name === 'volume') {
      dataSource = volumeList;
      loading = volumeListLoading;
    }
    return (
      <React.Fragment>
        {item.name === 'level' ? (
          <Radio.Group
            value={filter.level}
            onChange={this.onChangeRadio}
            style={{
              width: '100%',
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <Radio value="critical">{formatMessage({ id: 'log_alarm_critical' })}</Radio>
            <Radio value="warning">{formatMessage({ id: 'log_alarm_warning' })}</Radio>
          </Radio.Group>
        ) : (
          <Select
            labelInValue
            loading={loading}
            placeholder={formatMessage({ id: 'common.opt.placeholder' })}
            onChange={val => this.onSelectFilter(val, item)}
            value={filter[item.id] ? [{ key: filter[item.id], label: filter[item.name] }] : []}
            style={{ width: '100%', marginBottom: 8 }}
          >
            {dataSource.map(data => (
              <Option value={data.uuid} key={data.uuid}>
                {data.name}
              </Option>
            ))}
          </Select>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            type="primary"
            onClick={() => {
              this.onFilterData('confirm', item);
            }}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {formatMessage({ id: 'common.confirm' })}
          </Button>
          <Button
            onClick={() => {
              this.onFilterData('reset', item);
            }}
            size="small"
            style={{ width: 90 }}
          >
            {formatMessage({ id: 'common.opt.reset' })}
          </Button>
        </div>
      </React.Fragment>
    );
  };

  // 渲染每一项值
  getEveryValue = (data, dataIndex) => {
    if (dataIndex === 'alert_item') {
      return formatMessage({ id: `system_table_${data[dataIndex]}` }) || '-';
    }
    if (dataIndex === 'content') {
      const html = getAlarmContent(data);
      return html;
    }
    return data[dataIndex] || '-';
  };

  render() {
    const {
      log: { alarmLogList = [] },
      alarmListLoading,
    } = this.props;
    const { pagination, criticalColor, warningColor, filter, visible } = this.state;
    // 用于统一调整表头及内容区的宽度样式
    const commonArr = [
      {
        style: { width: '15%' },
        title: formatMessage({ id: 'log_alarm_item' }),
        name: 'alert_item',
        id: 'alert_item',
        filter: true,
      },
      {
        style: { width: '15%' },
        title: formatMessage({ id: 'log_cluster' }),
        name: 'cluster',
        id: 'cluster_id',
        filter: true,
      },
      {
        style: { width: '15%' },
        title: formatMessage({ id: 'log_node' }),
        name: 'node',
        id: 'node_sn',
        filter: true,
      },
      {
        style: { width: '15%' },
        title: formatMessage({ id: 'log_volume' }),
        name: 'volume',
        id: 'volume_id',
        filter: true,
      },
      {
        style: { width: '5%' },
        title: formatMessage({ id: 'log_alarm_level' }),
        name: 'level',
        filter: true,
      },
      { style: { width: '15%' }, title: formatMessage({ id: 'log_time' }), name: 'time' },
      {
        style: { width: '20%' },
        title: formatMessage({ id: 'log_alarm_content' }),
        name: 'content',
      },
    ];
    // 特殊处理告警项左侧的border样式
    const renderStyle = (data, item) => {
      const params = { ...item.style };
      if (item.name === 'alert_item') {
        const color =
          data.level === 'critical' ? criticalColor : data.level === 'warning' ? warningColor : '';
        if (color) {
          Object.assign(params, { borderLeft: `8px solid ${color}` });
        }
      }
      return params;
    };
    return (
      <React.Fragment>
        {/* 标题 */}
        <div className={styles.listtitle}>
          {commonArr.map(item => (
            <span key={item.name} style={item.style}>
              {item.title}
              {item.filter ? (
                // 表头过滤
                <Popover
                  onVisibleChange={bool => this.onVisibleChange(bool, item)}
                  visible={visible[item.name]}
                  content={this.getTipContent(item)}
                  trigger="click"
                  placement="bottomRight"
                >
                  <Icon
                    type="caret-down"
                    style={{ marginLeft: 4, color: filter[`${item.name}_bool`] && '#1890FF' }}
                  />
                </Popover>
              ) : null}
            </span>
          ))}
        </div>
        {/* 数据 */}
        <Spin spinning={alarmListLoading} style={{ margin: '32px 0px' }}>
          {alarmLogList.length ? (
            alarmLogList.map(data => (
              <div key={data.index} className={styles.listContent}>
                {commonArr.map(item => (
                  <span key={item.name} style={renderStyle(data, item)}>
                    {item.name === 'level' ? (
                      data[item.name] === 'critical' ? (
                        <Tag color={criticalColor}>
                          {formatMessage({ id: 'log_alarm_critical' })}
                        </Tag>
                      ) : data[item.name] === 'warning' ? (
                        <Tag color={warningColor}>{formatMessage({ id: 'log_alarm_warning' })}</Tag>
                      ) : (
                        '-'
                      )
                    ) : (
                      // 渲染每一项值
                      this.getEveryValue(data, item.name)
                    )}
                  </span>
                ))}
              </div>
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Spin>
        {/* 分页 */}
        {alarmLogList.length ? (
          <Pagination
            onChange={this.onChangePage}
            style={{ float: 'right', margin: '16px 0px' }}
            {...pagination}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
