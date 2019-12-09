import React from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';
import TableSearch from '@/components/TeamCommon/TableSearch';

class CommandPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      key: '', // 模糊搜索值
    };
  }

  componentDidMount() {
    // 获取命令集列表
    this.getCommandList();
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  // 获取命令集列表
  getCommandList = current => {
    const { dispatch } = this.props;
    const { pagination, key } = this.state;
    // 分页
    const payload = {
      page: current || 1,
      pagesize: pagination.pageSize,
    };
    if (key) {
      payload.key = key;
    }
    dispatch({
      type: 'system/getCommandList',
      payload,
    }).then(() => {
      const {
        system: { commandTotal },
      } = this.props;
      this.setState({
        pagination: {
          ...pagination,
          current: current || 1,
          total: commandTotal,
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
    this.getCommandList(pagination.current);
  };

  // 搜索
  onSearch = key => {
    this.setState({ key }, () => {
      this.getCommandList();
    });
  };

  render() {
    const {
      system: { commandList = [] },
      commandListLoading,
    } = this.props;
    const { pagination } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'system_command_name' }),
        dataIndex: 'key',
        width: '50%',
      },
      {
        title: formatMessage({ id: 'system_command_cmd' }),
        dataIndex: 'command',
        width: '50%',
      },
    ];
    return (
      <React.Fragment>
        <TableSearch onSearch={this.onSearch} />
        <Table
          rowKey="key"
          size="small"
          loading={commandListLoading}
          columns={columns}
          dataSource={commandList}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </React.Fragment>
    );
  }
}

export default CommandPage;
