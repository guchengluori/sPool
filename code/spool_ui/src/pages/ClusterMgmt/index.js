/**
 * name: menu.cluster
 * icon: cluster
 * order: 2
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Button, Modal, message } from 'antd';
import router from 'umi/router';
import { stringify } from 'qs';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardCard from './components/StandardCard';
import OperationModal from './components/OperationModal';
import { createWebSocket } from '@/utils/utils';
import styles from './style.less';

const { confirm } = Modal;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ clusterMgmt, loading }) => ({
  clusterMgmt,
  loading: loading.effects['clusterMgmt/fetch'],
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    operTitle: "common.opt.add", // 新增窗口提示
    operInfo: {}, // 修改时记录数据
    selectedRows: [],
    formValues: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },	// 分页信息
  };

  componentDidMount() {
    this.getLoadData();
    this.getWebSocket();
  }

  componentWillUnmount() {
    this.onCloseWS();
    this.setState = () => {};
  }

  handleStandardCardChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'clusterMgmt/fetch',
      payload: params,
    });
  };

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
        monitor: ['cluster_list'],
      };
      console.log('%o', '已连接，传参通信', this.client.readyState);
      this.client.send(JSON.stringify(param));
    };
    // 接收服务端推送的数据
    this.client.onmessage = evt => {
      const obj = JSON.parse(evt.data) || {};
      console.log('接收数据', obj);
      if (obj.cluster_list) {
        this.getLoadData();
      }
    };
    // 关闭webSocket连接
    this.client.onclose = error => console.log('断开连接', error && error.code);
  };

  getLoadData = (current) => {
    const self = this;
    const { dispatch } = this.props;
    const { pagination } = this.state;
    const params = {
      page: current || (pagination.current ? pagination.current : 1),
      pagesize: pagination.pageSize
    };
    dispatch({
      type: 'clusterMgmt/fetch',
      payload: params
    }).then(() => {
      const { clusterMgmt: { dataListTotal } } = self.props;
      pagination.total = dataListTotal;
      if (current) {
        pagination.current = current;
      }
      self.setState({
        pagination,
        selectedRowKeys: []
      });
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'clusterMgmt/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleSelectRows = (rows, opt) => {
    if (opt === 'detail') {
      // router.push(`/ClusterMgmt/${rows.uuid}`);
      router.push(`/ClusterMgmt/${stringify({ uuid: rows.uuid, hostlist: rows.hostlist })}`);
    } else if (opt === 'modify') {
      this.handleUpdateModalVisible(rows);
    } else if (opt === 'delete') {
      this.handleDelete(rows);
    }
  };

  handleUpdateModalVisible = (record) => {
    this.setState({ modalVisible: true, operTitle: 'common.opt.edit', operInfo: record });
  };

  handleDelete = ( record ) => {
    const self = this;
    const { dispatch } = this.props;
    confirm({
      title: formatMessage({ id: 'common.opt.del' }),
      content: `${formatMessage({ id: 'common.opt.del.confirm'})}: ${record.name}?`,
      okText: formatMessage({ id: 'common.yes' }),
      cancelText: formatMessage({ id: 'common.no' }),
      maskClosable: true,
      onOk() {
        dispatch({
          type: 'clusterMgmt/remove',
          payload: { uuid: record.uuid },
        }).then(() => {
          const {
            clusterMgmt: { successInfo },
          } = self.props;
          message.success(successInfo);
          self.getLoadData(self.getCurrent(record.code));
        });
      },
    });
  };

   /**
   * 删除时 重新计算当前页数
   * 获取当前表格页数 
   * 
   * */
  getCurrent = (deleteRecord) => {
    const { pagination } = this.state;
    // 判断当前也是否时最后一页
    const totalPage = Math.floor(pagination.total / pagination.pageSize + pagination.total % pagination.pageSize);
    const afterPageSize = pagination.total % pagination.pageSize;
    if ( pagination.current === 1 ) {
      return pagination.current;
    }
    if( pagination.current === totalPage)  {
      if (  deleteRecord.length >= afterPageSize ){
        return pagination.current - 1;
      }
      return pagination.current;
    }
    return pagination.current;
  };

  render() {
    const {
      clusterMgmt: { dataList, },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, operTitle, operInfo, } = this.state;
    return (
      <PageHeaderWrapper>
        <div className="home_background">
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                {formatMessage({ id: 'common.opt.create' })}
              </Button>
            </div>
            <StandardCard
              selectedRows={selectedRows}
              loading={loading}
              data={dataList}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardCardChange}
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
              operTitle: "common.opt.add",
              operInfo: {}
            })
          }
          }
          onRefresh={this.getLoadData}
          handleCancel={() => {
            this.setState({
              modalVisible: false,
            })
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
