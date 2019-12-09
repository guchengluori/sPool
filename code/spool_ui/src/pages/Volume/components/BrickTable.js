import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Table, Input, Button, Icon, Tooltip, Drawer, Row, Col, Badge } from 'antd';
import Highlighter from 'react-highlight-words';
import styles from '../index.less';

@connect(({ volume, loading }) => ({
  volume,
  loading: loading.effects['volume/effects_queryBrickList'],
}))
class BrickTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: '', drawerVisible: false, operBrick: {} };
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
          {formatMessage({ id: 'common.opt.query' })}
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          {formatMessage({ id: 'common.opt.reset' })}
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

  onChange = pagination => {
    const { getBrickList } = this.props;
    getBrickList(pagination.current);
  };

  showBrickDetail = record => {
    this.setState({
      drawerVisible: true,
      operBrick: record,
    });
  };

  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  render() {
    const { loading, brickList } = this.props;
    const { drawerVisible, operBrick } = this.state;
    const brickColumns = [
      {
        title: formatMessage({ id: 'param.volume.bricklist.sn' }),
        dataIndex: 'sn',
        width: '7%',
        render: text => (
          <Tooltip title={text} arrowPointAtCenter>
            <div
              style={{
                width: 70,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                float: 'left',
                height: 20,
              }}
            >
              {text}
            </div>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'param.volume.bricklist.name' }),
        dataIndex: 'name',
        width: '15%',
        ...this.getColumnSearchProps('name'),
        render: text => (
          <Tooltip title={text} arrowPointAtCenter>
            <div
              style={{
                width: 150,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                float: 'left',
                height: 20,
              }}
            >
              {text}
            </div>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'param.volume.bricklist.pid' }),
        dataIndex: 'pid',
        ...this.getColumnSearchProps('pid'),
      },
      {
        title: formatMessage({ id: 'param.volume.bricklist.state' }),
        dataIndex: 'state',
        render: text => {
          let stateColor = '';
          if (text === 'online') {
            stateColor = '#58b431';
          } else {
            stateColor = '#d9d9d9';
          }
          return (
            <div>
              <Badge color={stateColor} />
              {text}
            </div>
          );
        },
        filters: [
          {
            text: 'online',
            value: 'online',
          },
          {
            text: 'offline',
            value: 'offline',
          },
        ],
        onFilter: (value, record) => record.state.indexOf(value) === 0,
      },
      {
        title: formatMessage({ id: 'param.volume.bricklist.arbiter' }),
        dataIndex: 'arbiter',
        render: text => {
          if (text === 'true') {
            return formatMessage({ id: 'common.yes' });
          }
          return formatMessage({ id: 'common.no' });
        },
        filters: [
          {
            text: formatMessage({ id: 'param.volume.bricklist.arbiter' }),
            value: 'true',
          },
          {
            text: formatMessage({ id: 'param.volume.bricklist.notarbiter' }),
            value: 'false',
          },
        ],
        onFilter: (value, record) => record.arbiter.indexOf(value) === 0,
      },
      {
        title: formatMessage({ id: 'param.volume.bricklist.tcpport' }),
        dataIndex: 'tcp_port',
        ...this.getColumnSearchProps('tcp_port'),
      },
      {
        title: formatMessage({ id: 'param.volume.bricklist.rdmaport' }),
        dataIndex: 'rdma_port',
        ...this.getColumnSearchProps('rdma_port'),
      },
      {
        title: formatMessage({ id: 'param.volume.bricklist.disk' }),
        dataIndex: 'disk',
        render: (text, record) => `${record.disk_free}/${record.disk_total}`,
      },
      {
        title: formatMessage({ id: 'param.volume.bricklist.inode' }),
        dataIndex: 'inode',
        render: (text, record) => `${record.inode_free}/${record.inode_total}`,
      },
      {
        title: formatMessage({ id: 'common.details' }),
        dataIndex: 'action',
        align: 'center',
        render: (text, record) => (
          <Tooltip title={formatMessage({ id: 'common.more' })}>
            <Icon type="more" onClick={() => this.showBrickDetail(record)} />
          </Tooltip>
        ),
      },
    ];

    return (
      <div>
        <Table
          rowKey="name"
          loading={loading}
          columns={brickColumns}
          dataSource={brickList}
          onChange={this.onChange}
          size="small"
          pagination={false}
        />
        <BrickDrawer
          onDrawerClose={this.onDrawerClose}
          drawerVisible={drawerVisible}
          operBrick={operBrick}
        />
      </div>
    );
  }
}
export default BrickTable;

class BrickDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onDrawerClose, drawerVisible, operBrick } = this.props;
    return (
      <Drawer
        title={`${operBrick.sn} ${formatMessage({ id: 'common.details' })}`}
        placement="right"
        closable={false}
        onClose={onDrawerClose}
        visible={drawerVisible}
        width={600}
      >
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.belong_cluster' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.volume && operBrick.volume.name}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.name' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.name}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.state' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.state === 'online' ? (
              <span className={`${styles.volstatus} ${styles.started}`}>{operBrick.state}</span>
            ) : (
              <span className={`${styles.volstatus} ${styles.stopped}`}>{operBrick.state}</span>
            )}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.pid' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.pid}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.arbiter' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.arbiter === 'true'
              ? formatMessage({ id: 'common.yes' })
              : formatMessage({ id: 'common.no' })}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.tcpport' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.tcp_port}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.rdmaport' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.rdma_port}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.disk' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {`${operBrick.disk_free}/${operBrick.disk_total}`}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.inode' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {`${operBrick.inode_free}/${operBrick.inode_total}`}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.file' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.file_system}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.device' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.device}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.mount_options' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.mount_options}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>{formatMessage({ id: 'param.volume.bricklist.inode_size' })}:</Col>
          <Col span={16} style={{ fontWeight: 700 }}>
            {operBrick.inode_size}
          </Col>
        </Row>
      </Drawer>
    );
  }
}
