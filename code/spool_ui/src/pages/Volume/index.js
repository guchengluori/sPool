/**
 * name: menu.volume
 * icon: save
 * order: 4
 */

import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { stringify } from 'qs';
import { formatMessage } from 'umi/locale';
import { Form, Tooltip, Icon, Divider, div, Table, Modal, message, Switch, Badge } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableSearch from '@/components/TeamCommon/TableSearch';
import styles from './index.less';
// import { getApiPermission } from '@/utils/utils'; // 该函数用于获取操作类的权限，如获取新增按钮的权限
import ModalForm from './components/ModalForm';
import ReplaceForm from './components/ReplaceForm';
import { createWebSocket } from '@/utils/utils';

@connect(({ volume, loading }) => ({
  volume,
  loading: loading.effects['volume/effects_queryVolumeList'],
}))
@Form.create()
class VolumePageIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        // 分页信息
        pageSize: 10, // 默认一页展示10条
        current: 1, // 默认展示第一页
      },
      addBtnDisable: true, // 控制新增按钮  false是禁用按钮
      delBtnDisable: true, // 控制删除按钮  false是禁用按钮
      startBtnDisable: true, // 控制启动按钮  false是禁用按钮
      stopBtnDisable: true, // 控制停止按钮  false是禁用按钮
      modalVisible: false, // 控制新增/修改弹窗是否弹出
      selectedRow: {},
      operModalVisible: false, // 控制启动/停止弹窗是否弹出
      operRow: {},
      replaceModalVisible: false, // 控制替换弹窗是否弹出
      replaceselectedRow: {}, // 控制替换选择记录
      clusterInfo: [], // 替换是集群列表
      filteredInfo: null,
      key: '', // 模糊搜索值
    };
  }

  componentWillMount() {
    // 获取当前页面的权限，返回1表示有权限，展示按钮
    // const addShow = getApiPermission('volume_create') || 0; // 新增权限
    // const modifyShow = getApiPermission('volume_modify') || 0; // 修改权限
    // const delShow = getApiPermission('volume_delete') || 0; // 删除权限
    // const obj = {};
    // if (addShow) {
    //   obj.addBtnDisable = true;
    // }
    // if (modifyShow) {
    //   obj.modifyBtnDisable = true;
    // }
    // if (delShow) {
    //   obj.delBtnDisable = true;
    // }
    // if (JSON.stringify(obj) !== '{}') {
    //   this.setState(obj);
    // }
  }

  componentDidMount() {
    this.getVolumeList();
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
        monitor: ['volume_list'],
      };
      console.log('%o', '已连接，传参通信', this.client.readyState);
      this.client.send(JSON.stringify(param));
    };
    // 接收服务端推送的数据
    this.client.onmessage = evt => {
      const obj = JSON.parse(evt.data) || {};
      console.log('接收数据', obj);
      if (obj.volume_list) {
        this.getVolumeList();
      }
    };
    // 关闭webSocket连接
    this.client.onclose = error => console.log('断开连接', error.code);
  };

  /**
   * 获取卷列表
   */
  getVolumeList = (current, filtersArg, sorter) => {
    const self = this;
    const { dispatch } = this.props;
    const { pagination, key } = this.state;
    let pageNum = 1;
    if (current) {
      pageNum = current;
    } else if (pagination.current) {
      pageNum = pagination.current;
    }
    let params = {
      page: pageNum,
      pagesize: pagination.pageSize,
    };
    if (key) {
      params.key = key;
    }
    if (filtersArg) {
      const filters = {};
      Object.keys(filtersArg)
        .filter(item => filtersArg[item] !== null)
        .forEach(obj => {
          filters[obj] = JSON.stringify(filtersArg[obj]);
        });
      params = { ...params, ...filters };
    }
    if (sorter && sorter.field) {
      params[sorter.field] = sorter.order;
    }
    dispatch({
      type: 'volume/effects_queryVolumeList',
      payload: params,
    }).then(() => {
      const {
        volume: { volumeTotal },
      } = self.props;
      pagination.total = volumeTotal;
      if (current) {
        pagination.current = current;
      }
      self.setState({ pagination });
    });
  };

  /**
   * 监控表格页码变化
   */
  onTableChange = (pagination, filtersArg, sorter) => {
    this.getVolumeList(pagination.current, filtersArg, sorter);
    this.setState({
      filteredInfo: filtersArg,
    });
  };

  /**
   * 处理新增/编辑弹窗
   */
  handleModalVisible = (flag = 'add', record) => {
    if (flag === 'add') {
      this.setState({
        modalVisible: true,
      });
    } else if (flag === 'replace') {
      const { dispatch } = this.props;
      dispatch({
        type: 'volume/effects_queryClusterList',
        payload: {},
      }).then(() => {
        const {
          volume: { clusterList },
        } = this.props;
        let clusterInfo = {};
        clusterList.forEach(element => {
          if (record.cluster.uuid === element.uuid) {
            clusterInfo = element;
          }
        });
        // 查询卷详细信息-brick
        dispatch({
          type: 'volume/effects_queryBrickInfo',
          payload: { volume_name: record.name, cluster: record.cluster.uuid },
        }).then(() => {
          const {
            volume: { brickInfo },
          } = this.props;
          const recordNew = { ...record, ...brickInfo };
          // 查询卷详细信息-brick
          this.setState({
            replaceModalVisible: true,
            replaceselectedRow: recordNew,
            clusterInfo,
          });
        });
      });
    }
  };

  /**
   * 关闭弹窗
   */
  onCancel = () => {
    this.setState({
      modalVisible: false,
      selectedRow: {},
      operModalVisible: false,
      operRow: {},
      replaceModalVisible: false,
      replaceselectedRow: {},
    });
  };

  /**
   * 磁盘卷启动/停止
   */
  onVolumeOper = (flag, row) => {
    this.setState({
      operModalVisible: true,
      operModalFlag: flag,
      operRow: row,
    });
  };

  /**
   * 删除数据
   */
  onVolumeDelete = row => {
    const self = this;
    const { pagination } = this.state;
    const { dispatch } = this.props;
    const params = {};
    let deleteVolumeName = '';
    if (row) {
      // 单行删除
      params.uuid = row.uuid;
      params.cluster = row.cluster && row.cluster.uuid;
      params.volume_name = row.name;
      deleteVolumeName = row.name;
      if (row.state === 'started') {
        message.warning(formatMessage({ id: 'param.volume.delete.validate' }));
        return;
      }
      Modal.confirm({
        title: `${formatMessage({ id: 'param.volume.delete.confirm' })} : ${deleteVolumeName} ?`,
        okText: formatMessage({ id: 'common.confirm' }),
        cancelText: formatMessage({ id: 'common.cancel' }),
        maskClosable: true,
        onOk() {
          dispatch({
            type: 'volume/effects_deleteVolume',
            payload: params,
          }).then(() => {
            const {
              volume: { successInfo },
            } = self.props;
            message.success(successInfo);
            if (Math.ceil(pagination.total / pagination.pageSize) === pagination.current) {
              if ((pagination.total - 1) % pagination.pageSize === 0) {
                self.getVolumeList(pagination.current === 1 ? 1 : pagination.current - 1);
              } else {
                self.getVolumeList(pagination.current);
              }
            } else {
              self.getVolumeList(pagination.current);
            }
            self.setState({ selectedRow: {} });
          });
        },
        onCancel() {},
      });
    }
  };

  // 查询按钮
  onSearch = key => {
    const { filteredInfo } = this.state;
    this.setState(
      {
        key,
      },
      () => {
        this.getVolumeList(1, filteredInfo);
      }
    );
  };

  // 重置按钮
  resetCond = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      filteredInfo: null,
    });
    this.getVolumeList(1);
  };

  render() {
    const {
      volume: { volumeList },
      loading,
      dispatch,
      form,
    } = this.props;
    const {
      pagination,
      addBtnDisable,
      delBtnDisable,
      startBtnDisable,
      stopBtnDisable,
      selectedRow,
      modalVisible,
      operModalVisible,
      operModalFlag,
      operRow,
      replaceModalVisible,
      replaceselectedRow,
      clusterInfo,
    } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};
    // 定义表格属性
    const columns = [
      {
        title: formatMessage({ id: 'param.volume.name' }),
        dataIndex: 'name',
        render: (text, record) => {
          if (
            record.state === 'started' ||
            record.state === 'stopped' ||
            record.state === 'created'
          ) {
            return (
              <Tooltip
                title={`${formatMessage({ id: 'param.volume.show' })} ${text} ${formatMessage({
                  id: 'param.volume.detail',
                })}`}
                arrowPointAtCenter
              >
                <div
                  style={{
                    width: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    float: 'left',
                    marginLeft: 3,
                    height: 20,
                  }}
                >
                  <a
                    onClick={() => {
                      router.push(`/Volume/detail/${stringify(record)}`);
                    }}
                  >
                    {text}
                  </a>
                </div>
              </Tooltip>
            );
          }
          return (
            <Tooltip title={text} arrowPointAtCenter>
              <div
                style={{
                  width: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  float: 'left',
                  marginLeft: 3,
                  height: 20,
                }}
              >
                {text}
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: formatMessage({ id: 'param.volume.type' }),
        dataIndex: 'type',
        render: text => (
          <Tooltip title={text} arrowPointAtCenter>
            <div
              style={{
                width: 80,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                float: 'left',
                marginLeft: 3,
                height: 20,
              }}
            >
              {text}
            </div>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'param.volume.status' }),
        dataIndex: 'state',
        render: (text, record) => {
          let stateColor = '';
          let stateStatus = '';
          let stateTitle = '';
          if (text === 'started') {
            stateColor = '#58b431';
            stateTitle = formatMessage({ id: 'param.volume.state.started' });
          } else if (text === 'stopped') {
            stateColor = '#dd1916';
            stateTitle = formatMessage({ id: 'param.volume.state.stopped' });
          } else if (text === 'created') {
            stateColor = '#46bfe5';
            stateTitle = formatMessage({ id: 'param.volume.state.created' });
          } else if (text === 'error') {
            stateColor = '#dd1916';
            stateTitle = formatMessage({ id: 'param.volume.state.error' });
          } else if (text === 'pending' || text === 'done') {
            stateStatus = 'processing';
            stateTitle = formatMessage({ id: 'param.volume.state.pending' });
          }
          return (
            <Tooltip
              placement="top"
              title={
                text === 'error'
                  ? `${formatMessage({ id: 'param.volume.state.error' })}：${record.do_message}`
                  : stateTitle
              }
            >
              <div
                style={{
                  width: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  float: 'left',
                  marginLeft: 3,
                  height: 20,
                }}
              >
                <Badge color={stateColor} status={stateStatus} />
                {text}
                {text === 'error' ? (
                  <span style={{ color: '#aeaeae', marginLeft: '5px' }}>
                    <Icon type="question-circle" theme="twoTone" />
                  </span>
                ) : null}
              </div>
            </Tooltip>
          );
        },
        filters: [
          {
            text: 'started',
            value: 'started',
          },
          {
            text: 'stopped',
            value: 'stopped',
          },
          {
            text: 'created',
            value: 'created',
          },
          {
            text: 'error',
            value: 'error',
          },
          {
            text: 'pending',
            value: 'pending',
          },
        ],
        filteredValue: filteredInfo.state || null,
      },
      {
        title: formatMessage({ id: 'param.volume.cluster' }),
        dataIndex: 'cluster',
        render: text => (
          <Tooltip placement="top" title={text.name}>
            <div
              style={{
                width: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                float: 'left',
                marginLeft: 3,
                height: 20,
              }}
            >
              {text.name}
            </div>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'param.volume.transport' }),
        dataIndex: 'transport_type',
        render: text => (
          <Tooltip placement="top" title={text}>
            <div
              style={{
                width: 80,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                float: 'left',
                marginLeft: 3,
                height: 20,
              }}
            >
              {text.toString()}
            </div>
          </Tooltip>
        ),
        filters: [
          {
            text: 'tcp',
            value: 'tcp',
          },
          {
            text: 'rdma',
            value: 'rdma',
          },
          {
            text: 'tcp,rdma',
            value: 'tcp,rdma',
          },
        ],
        filteredValue: filteredInfo.transport_type || null,
      },
      {
        title: formatMessage({ id: 'param.volume.id' }),
        dataIndex: 'uuid',
        render: text => (
          <Tooltip placement="top" title={text}>
            <div
              style={{
                width: 220,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                float: 'left',
                marginLeft: 3,
                height: 20,
              }}
            >
              {text}
            </div>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'common.opt.oper' }),
        dataIndex: 'action',
        render: (text, record) => {
          const obj = {
            theme: 'twoTone',
            style: {
              cursor: 'pointer',
            },
          };
          return (
            <span>
              {record.state !== 'pending' && record.state !== 'done' && delBtnDisable ? (
                <React.Fragment>
                  <Tooltip title={formatMessage({ id: 'common.opt.del' })}>
                    <Icon type="delete" {...obj} onClick={() => this.onVolumeDelete(record)} />
                  </Tooltip>
                </React.Fragment>
              ) : null}
              {record.state === 'started' && stopBtnDisable ? (
                <React.Fragment>
                  <Divider type="vertical" />
                  <Tooltip title={formatMessage({ id: 'common.opt.stop' })}>
                    <Icon type="stop" {...obj} onClick={() => this.onVolumeOper('stop', record)} />
                  </Tooltip>
                </React.Fragment>
              ) : null}
              {(record.state === 'stopped' || record.state === 'created') && startBtnDisable ? (
                <React.Fragment>
                  <Tooltip title={formatMessage({ id: 'common.opt.start' })}>
                    <Divider type="vertical" />
                    <Icon
                      type="play-circle"
                      {...obj}
                      onClick={() => this.onVolumeOper('start', record)}
                    />
                  </Tooltip>
                </React.Fragment>
              ) : null}
              {record.state === 'started' && stopBtnDisable ? (
                <React.Fragment>
                  <Tooltip title={formatMessage({ id: 'param.volume.replace' })}>
                    <Divider type="vertical" />
                    <Icon
                      type="api"
                      {...obj}
                      onClick={() => this.handleModalVisible('replace', record)}
                    />
                  </Tooltip>
                </React.Fragment>
              ) : null}
            </span>
          );
        },
      },
    ];
    const btnArr = [];

    if (addBtnDisable) {
      btnArr.push({
        name: formatMessage({ id: 'common.opt.add' }),
        icon: 'plus',
        type: 'primary',
        onClick: () => this.handleModalVisible(),
      });
    }
    return (
      <PageHeaderWrapper>
        <div className="home_background">
          <div className={styles.tableList}>
            <TableSearch btnArr={btnArr} onSearch={this.onSearch} />
            <Table
              loading={loading}
              rowKey="uuid"
              columns={columns}
              dataSource={volumeList}
              onChange={this.onTableChange}
              style={{ whiteSpace: 'pre-line' }}
              pagination={pagination}
              size="small"
            />
          </div>
        </div>
        <ModalForm
          form={form}
          dispatch={dispatch}
          modalVisible={modalVisible}
          selectedRow={selectedRow}
          onCancel={() => this.onCancel()}
          onRefresh={() => this.getVolumeList()}
          height={600}
        />
        <ReplaceForm
          form={form}
          dispatch={dispatch}
          modalVisible={replaceModalVisible}
          selectedRow={replaceselectedRow}
          clusterInfo={clusterInfo}
          onCancel={() => this.onCancel('replace')}
          onRefresh={() => this.getVolumeList()}
          height={600}
        />
        <OperForm
          operModalVisible={operModalVisible}
          operModalFlag={operModalFlag}
          operRow={operRow}
          onCancel={() => this.onCancel()}
          onRefresh={() => this.getVolumeList()}
          height={600}
          {...this.props}
        />
      </PageHeaderWrapper>
    );
  }
}
export default VolumePageIndex;

/**
 * 磁盘卷启动/停止弹窗
 */
class OperForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      force: false, // 是否开启强制
    };
  }

  onOper = () => {
    const { operModalFlag, onCancel, onRefresh, dispatch, operRow } = this.props;
    const { force } = this.state;
    const self = this;
    const params = {};
    params.uuid = operRow.uuid;
    params.cluster = operRow.cluster && operRow.cluster.uuid;
    params.volume_name = operRow.name;
    params.oper = operModalFlag;
    params.force = force;
    dispatch({
      type: 'volume/effects_operVolume',
      payload: params,
    }).then(() => {
      const {
        volume: { successInfo },
      } = self.props;
      message.success(successInfo);
      onCancel();
      onRefresh();
    });
  };

  onChange = checked => {
    this.setState({
      force: checked,
    });
  };

  render() {
    const { operModalVisible, operModalFlag, onCancel, operRow } = this.props;
    return (
      <Modal
        icon="question-circle"
        destroyOnClose
        visible={operModalVisible}
        title={
          operModalFlag === 'start'
            ? `${formatMessage({ id: 'param.volume.start.confirm.title' })}`
            : `${formatMessage({ id: 'param.volume.stop.confirm.title' })}`
        }
        okText={formatMessage({ id: 'common.confirm' })}
        cancelText={formatMessage({ id: 'common.cancel' })}
        maskClosable
        onOk={() => this.onOper()}
        onCancel={onCancel}
      >
        <p>
          {operModalFlag === 'start'
            ? `${formatMessage({ id: 'param.volume.start.confirm' })} : ${operRow.name} ?`
            : `${formatMessage({ id: 'param.volume.stop.confirm' })} : ${operRow.name} ?`}
        </p>
        <p>
          {operModalFlag === 'start'
            ? formatMessage({ id: 'param.volume.start.force' })
            : formatMessage({ id: 'param.volume.stop.force' })}
          <Switch onChange={this.onChange} />
        </p>
      </Modal>
    );
  }
}
