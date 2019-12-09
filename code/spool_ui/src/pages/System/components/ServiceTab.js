import React from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';

class ServiceTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  componentDidMount() {
    // 获取命令集列表
    this.getServiceList();
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  // 获取命令集列表
  getServiceList = current => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    // 分页
    const payload = {
      page: current || 1,
      pagesize: pagination.pageSize,
    };
    dispatch({
      type: 'system/getServiceList',
      payload,
    }).then(() => {
      const {
        system: { serviceTotal },
      } = this.props;
      this.setState({
        pagination: {
          ...pagination,
          current: current || 1,
          total: serviceTotal,
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
    this.getServiceList(pagination.current);
  };

  render() {
    const {
      system: { serviceList = [] },
      serviceListLoading,
    } = this.props;
    const { pagination } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'system_service_name' }),
        dataIndex: 'name',
        width: '50%',
      },
      {
        title: formatMessage({ id: 'system_service_status' }),
        dataIndex: 'status',
        width: '50%',
      },
    ];
    return (
      <Table
        rowKey="uuid"
        size="small"
        loading={serviceListLoading}
        columns={columns}
        dataSource={serviceList}
        pagination={pagination}
        onChange={this.handleTableChange}
      />
    );
  }
}

export default ServiceTab;
