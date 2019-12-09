import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Table, Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';

@connect(({ volume, loading }) => ({
  volume,
  loading: loading.effects['volume/effects_queryParamList'],
}))
class ParamsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render() {
    const { loading, paramList } = this.props;
    const paramsColumns = [
      {
        title: formatMessage({ id: 'param.volume.param.name' }),
        dataIndex: 'name',
        width: '60%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: formatMessage({ id: 'param.volume.param.value' }),
        dataIndex: 'value',
      },
    ];

    return (
      <Table
        rowKey="uuid"
        loading={loading}
        columns={paramsColumns}
        dataSource={paramList}
        onChange={this.onChange}
        size="small"
        pagination={false}
      />
    );
  }
}
export default ParamsTable;
