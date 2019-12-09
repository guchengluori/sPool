/**
 * name: menu.host
 * icon: desktop
 * order: 3
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Tooltip, Modal, message, Badge, Divider, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableSearch from '@/components/TeamCommon/TableSearch';
import StandardTable from './components/StandardTable';
import OperationModal from './components/OperationModal';
import { createWebSocket } from '@/utils/utils';
import styles from './style.less';

const { confirm } = Modal;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ hostMgmt, loading }) => ({
  hostMgmt,
  loading: loading.effects['hostMgmt/fetch'],
}))
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // Form窗口控制
      operTitle: 'common.opt.add', // 新增窗口提示
      operInfo: {}, // 修改时记录数据
      selectedRows: [],
      pagination: {
        current: 1,
        pageSize: 10,
      }, // 分页信息
      key: '', // 模糊搜索值
      statusMap: { 
        connected: '#58b431', 
        disconnected: '#d9d9d9', 
        pending: 'processing', 
        error: '#dd1916', 
        Unknow: '#595959',
        done:  'processing'
      },
      status: { 
        connected: formatMessage({ id: 'common.state.connected'}), 
        disconnected: formatMessage({ id: 'common.state.disconnected'}), 
        pending: formatMessage({ id: 'common.state.pending'}), 
        error: formatMessage({ id: 'common.state.error'}),
        done:  formatMessage({ id: 'common.state.pending'}), 
        Unknow:  formatMessage({ id: 'common.state.Unknow'}), 
      }
    };
  }

  componentDidMount() {
    this.getLoadData(1);
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
        monitor: ['node_list'],
      };
      console.log('%o', '已连接，传参通信', this.client.readyState);
      this.client.send(JSON.stringify(param));
    };
    // 接收服务端推送的数据
    this.client.onmessage = evt => {
      const obj = JSON.parse(evt.data) || {};
      console.log('接收数据', obj);
      if (obj.node_list) {
        this.getLoadData();
      }
    };
    // 关闭webSocket连接
    this.client.onclose = error => console.log('断开连接', error && error.code);
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.getLoadData(pagination.current, filtersArg, sorter);
  };

  getLoadData = (current, filtersArg, sorter) => {
    const self = this;
    const { dispatch } = this.props;
    const { pagination, key } = this.state;
    const paramsVal = {};
    if (key) {
      paramsVal.key = key;
    }
    let params = {
      page: current || (pagination.current ? pagination.current : 1),
      pagesize: pagination.pageSize,
      ...paramsVal,
    };
    if (filtersArg) {
      const filters = Object.keys(filtersArg).reduce((obj, i) => {
        const newObj = { ...obj };
        newObj[i] = getValue(filtersArg[i]);
        return newObj;
      }, {});
      params = { ...params, ...filters };
    }
    if (sorter && sorter.field) {
      params[sorter.field] = sorter.order;
    }
    dispatch({
      type: 'hostMgmt/fetch',
      payload: params,
    }).then(() => {
      const {
        hostMgmt: { dataListTotal },
      } = self.props;
      pagination.total = dataListTotal;
      if (current) {
        pagination.current = current;
      }
      self.setState({
        pagination,
        selectedRowKeys: [],
      });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({ modalVisible: true, operTitle: 'common.opt.edit', operInfo: record });
  };

  /**
   * 删除时 重新计算当前页数
   * 获取当前表格页数
   *
   * */
  getCurrent = deleteRecord => {
    const { pagination } = this.state;
    // 判断当前也是否时最后一页
    const totalPage = Math.floor(
      pagination.total / pagination.pageSize + (pagination.total % pagination.pageSize)
    );
    const afterPageSize = pagination.total % pagination.pageSize;
    if (pagination.current === 1) {
      return pagination.current;
    }
    if (pagination.current === totalPage) {
      if (deleteRecord.length >= afterPageSize) {
        return pagination.current - 1;
      }
      return pagination.current;
    }
    return pagination.current;
  };

  handleDelete = record => {
    const self = this;
    const { dispatch } = this.props;
    confirm({
      title: formatMessage({ id: 'common.opt.del' }),
      content: `${formatMessage({ id: 'common.opt.del.confirm' })}: ${record.hostname}?`,
      okText: formatMessage({ id: 'common.yes' }),
      cancelText: formatMessage({ id: 'common.no' }),
      maskClosable: true,
      onOk() {
        dispatch({
          type: 'hostMgmt/remove',
          payload: { sn: record.sn },
        }).then(() => {
          const {
            hostMgmt: { successInfo },
          } = self.props;
          message.success(successInfo);
          self.getLoadData(self.getCurrent(record.code));
        });
      },
    });
  };

  /**
   * 查询
   */
  onSearch = key => {
    this.setState({ key }, () => {
      this.getLoadData(1);
    });
  };

  render() {
    const {
      hostMgmt: { dataList },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, operTitle, operInfo, status, statusMap, pagination } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'host.table.name' }),
        dataIndex: 'hostname',
        // sorter: true,
        width: '10%',
      },
      {
        title: formatMessage({ id: 'host.form.ip' }),
        dataIndex: 'ip',
      },
      {
        title: formatMessage({ id: 'host.table.hoststate' }),
        dataIndex: 'state',
        filters: [
          {
            text: status.connected,
            value: 'connected',
          },
          {
            text: status.disconnected,
            value: 'disconnected',
          },
          {
            text: status.pending,
            value: 'pending',
          },
          {
            text: status.pending,
            value: 'Unknow',
          },
        ],
        render(val) {
          if ( val.indexOf('#') > -1 ) {
            return <Badge color={statusMap[val]} text={status[val]} />
          } 
          return <Badge color={statusMap[val]} text={status[val]} />
        },
      },
      {
        title: formatMessage({ id: 'host.table.clusterstate' }),
        dataIndex: 'cluster_state',
        filters: [
          {
            text: status.connected,
            value: 'connected',
          },
          {
            text: status.disconnected,
            value: 'disconnected',
          },
          {
            text: status.pending,
            value: 'pending',
          },
          {
            text: status.pending,
            value: 'Unknow',
          },
        ],
        render(val) {
          if ( val.indexOf('#') > -1 ) {
            return <Badge color={statusMap[val]} text={status[val]} />
          } 
          return <Badge color={statusMap[val]} text={status[val]} />
        },
      },
      {
        title: formatMessage({ id: 'host.table.cluster' }),
        dataIndex: 'cluster_name',
      },
      {
        title: formatMessage({ id: 'host.table.os' }),
        dataIndex: 'os',
        width: '10%',
        render(val) {
          return (
            <Tooltip title={val}>
              <span
                style={{
                  display: 'inline-block',
                  width: '64px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  height: '16px',
                  whiteSpace: 'nowrap',
                }}
              >
                {val}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: formatMessage({ id: 'host.table.sn' }),
        dataIndex: 'sn',
        render(val) {
          return <Tooltip title={val}>{val}</Tooltip>;
        },
      },
      {
        title: formatMessage({ id: 'common.opt.oper' }),
        render: (text, record) => (
          <Fragment>
            <Tooltip title={formatMessage({ id: 'common.opt.edit' })}>
              <Icon
                type="edit"
                theme="twoTone"
                onClick={() => this.handleUpdateModalVisible(true, record)}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title={formatMessage({ id: 'common.opt.del' })}>
              <Icon type="delete" theme="twoTone" onClick={() => this.handleDelete(record)} />
            </Tooltip>
          </Fragment>
        ),
      },
    ];
    const btnArr = [
      { name: formatMessage({ id: 'common.opt.add' }), icon: 'plus', type: 'primary', onClick: () => this.handleModalVisible(true) },
    ];
    return (
      <PageHeaderWrapper>
        <div className="home_background">
          <div className={styles.tableList}>
            <TableSearch btnArr={btnArr} onSearch={this.onSearch} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={dataList}
              columns={columns}
              pagination={pagination}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </div>
        <OperationModal
          visible={modalVisible}
          operTitle={operTitle}
          operInfo={operInfo}
          onCancel={() => {
            this.setState({
              modalVisible: false,
              operTitle: 'common.opt.add',
              operInfo: {},
            });
          }}
          onRefresh={this.getLoadData}
          handleCancel={() => {
            this.setState({
              modalVisible: false,
            });
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
