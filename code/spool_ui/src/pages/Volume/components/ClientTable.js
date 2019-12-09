import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Table, Input, Button, Icon, Tooltip, Modal } from 'antd';
import Highlighter from 'react-highlight-words';

const { Search } = Input;

@connect(({ volume, loading }) => ({
  volume,
  loading: loading.effects['volume/effects_queryBrickList'],
  detailLoading: loading.effects['volume/effects_queryClientDetailList'],
}))
class ClientTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      showVisible: false,
      operClient: {},
    };
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        // eslint-disable-next-line react/destructuring-assignment
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={`${text}`}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  // 展示客户端详情弹窗
  showClientDetail = record => {
    const { clusterUuid, volumeName } = this.props;
    const currentClient = {};
    currentClient.brick_name = record.name;
    currentClient.cluster = clusterUuid;
    currentClient.volume_name = volumeName;
    this.setState({
      showVisible: true,
      operClient: currentClient,
    });
  };

  // 关闭客户端详情弹窗
  onDetailClose = () => {
    this.setState({
      showVisible: false,
      operClient: {},
    });
  };

  render() {
    const { loading, brickList } = this.props;
    const { showVisible, operClient } = this.state;
    const clientColumns = [
      {
        title: formatMessage({ id: 'param.volume.client.brick' }),
        dataIndex: 'name',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: formatMessage({ id: 'param.volume.client.connect' }),
        dataIndex: 'connect',
      },
      {
        title: formatMessage({ id: 'common.details' }),
        dataIndex: 'action',
        align: 'center',
        render: (text, record) => (
          <Tooltip title={formatMessage({ id: 'common.more' })}>
            <Icon type="more" onClick={() => this.showClientDetail(record)} />
          </Tooltip>
        ),
      },
    ];

    return (
      <div>
        <Table
          rowKey="name"
          loading={loading}
          columns={clientColumns}
          dataSource={brickList}
          onChange={this.onChange}
          size="small"
          pagination={false}
        />
        <ClientDetail
          onDetailClose={this.onDetailClose}
          showVisible={showVisible}
          operClient={operClient}
        />
      </div>
    );
  }
}
export default ClientTable;

@connect(({ volume }) => ({
  volume,
}))
class ClientDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      request: false,
      pagination: {
        page: 1,
        pageSize: 8,
        current: 1,
      },
      clientDetailList: [],
    };
  }

  componentDidUpdate = () => {
    const { request } = this.state;
    const { showVisible } = this.props;
    if (showVisible && !request) {
      this.setState({ request: true }, () => {
        this.getClientDetail();
      });
    }
  };

  // 获取客户端详情信息
  getClientDetail = (current, searchText) => {
    const self = this;
    const { dispatch, operClient } = this.props;
    const { pagination } = this.state;
    const params = { ...operClient };
    let pageNum = 1;
    if (current) {
      pageNum = current;
    } else if (pagination.current) {
      pageNum = pagination.current;
    }
    params.page = pageNum;
    params.pagesize = pagination.pageSize;
    params.key = searchText || '';
    dispatch({
      type: 'volume/effects_queryClientDetailList',
      payload: params,
    }).then(() => {
      const {
        volume: { clientDetailTotal, clientDetailList },
      } = self.props;
      pagination.total = clientDetailTotal;
      if (current) {
        pagination.current = current;
      }
      self.setState({ pagination, clientDetailList });
    });
  };

  // 关键字查询
  clientSearch = value => {
    console.log('search value:', value);
    this.getClientDetail(1, value);
  };

  // 监控表格数据变化
  onTabChange = pagination => {
    this.getClientDetail(pagination.current);
  };

  onCancel = () => {
    const { onDetailClose } = this.props;
    this.setState({
      request: false,
    });
    onDetailClose();
  };

  render() {
    const { detailLoading, showVisible } = this.props;
    const { clientDetailList, pagination } = this.state;
    const detailColumns = [
      {
        title: formatMessage({ id: 'param.volume.client.host' }),
        dataIndex: 'host_port',
        width: '45%',
      },
      {
        title: 'BytesRead',
        dataIndex: 'bytesread',
        width: '30%',
      },
      {
        title: 'BytesWritten',
        dataIndex: 'byteswritten',
        width: '30%',
      },
      {
        title: 'OpVersion',
        dataIndex: 'opversion',
      },
    ];
    return (
      <Modal
        title={formatMessage({ id: 'param.volume.client.detail' })}
        visible={showVisible}
        onCancel={this.onCancel}
        destroyOnClose
        footer={false}
        width={600}
      >
        <Search
          allowClear
          placeholder={formatMessage({ id: 'common.opt.query.tips' })}
          enterButton={formatMessage({ id: 'common.opt.query' })}
          size="small"
          onSearch={value => this.clientSearch(value)}
          style={{ marginBottom: '10px' }}
        />
        <Table
          rowKey="host_port"
          loading={detailLoading}
          columns={detailColumns}
          dataSource={clientDetailList}
          onChange={this.onTabChange}
          size="small"
          pagination={pagination}
        />
      </Modal>
    );
  }
}
