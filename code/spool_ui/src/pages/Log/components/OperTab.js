import React from 'react';
import { Table, Badge, DatePicker, Button, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../index.less';

const { RangePicker } = DatePicker;

export default class OperTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      filter: {
        state: '', // 状态
        dates: [], // 日期moment
        dateStrings: [], // 日期范围
      },
      timeBool: false, // true时确认筛选，用于高亮图标
    };
  }

  componentDidMount() {
    // 查询操作日志列表
    this.getOperList();
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  getCurrentPageList = (logFilter, type) => {
    const {
      pagination: { current },
    } = this.state;
    this.getOperList(current, logFilter, type);
  };

  // 全部已读
  onReadAll = () => {
    const { pagination, filter } = this.state;
    this.getOperList(pagination.current, filter, '', 'all');
  };

  // 操作日志列表
  getOperList = (current, logFilter, type, read) => {
    const { dispatch } = this.props;
    const { pagination, filter: filterOld } = this.state;
    // 分页
    const payload = {
      page: current || 1,
      pagesize: pagination.pageSize,
    };
    // 状态搜索
    let obj = '';
    if (type === 'changeTab') {
      obj = filterOld;
    } else {
      obj = logFilter;
    }
    if (obj && obj.state) {
      payload.state = obj.state;
    }
    if (obj && obj.dateStrings && obj.dateStrings.length) {
      const [starttime, endtime] = obj.dateStrings;
      payload.starttime = starttime;
      payload.endtime = endtime;
    }
    // 全部已读时多带一个参数
    if (read === 'all') {
      payload.read = read;
    }
    dispatch({
      type: 'log/getOperList',
      payload,
    }).then(() => {
      const {
        log: { operTotal },
      } = this.props;
      this.setState({
        pagination: {
          ...pagination,
          current: current || 1,
          total: operTotal,
        },
        filter: {
          ...obj,
          ...logFilter,
        },
      });
    });
  };

  // 分页
  handleTableChange = (pagination, filters) => {
    const { pagination: pager, filter } = this.state;
    this.setState({
      pagination: {
        ...pager,
        current: pagination.current,
      },
    });
    const params = { ...filter };
    if (filters.state && filters.state.length) {
      const [state] = filters.state;
      params.state = state;
    } else {
      params.state = '';
    }
    this.getOperList(pagination.current, params);
  };

  // 切换日期
  onChangeTime = (dates, dateStrings) => {
    const { filter } = this.state;
    this.setState({
      filter: {
        ...filter,
        dates,
        dateStrings,
      },
    });
  };

  // 重置时间
  onResetTime = () => {
    const { filter } = this.state;
    const params = {
      ...filter,
      dates: [],
      dateStrings: [],
    };
    this.getOperList(1, params);
  };

  

  render() {
    const {
      log: { operList },
      operListLoading,
    } = this.props;
    const {
      pagination,
      filter,
      filter: { dates },
      timeBool,
    } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'oper_table_user' }),
        dataIndex: 'user',
        width: '10%',
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'log_time' }),
        dataIndex: 'oper_time',
        width: '15%',
        filterDropdown: ({ confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <RangePicker
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              showTime
              value={dates}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this.onChangeTime}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                type="primary"
                onClick={() => {
                  confirm();
                  this.setState({ timeBool: dates.length && true });
                  this.getOperList(1, filter);
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
                  this.setState({ timeBool: false });
                  this.onResetTime();
                }}
                size="small"
                style={{ width: 90 }}
              >
                {formatMessage({ id: 'common.opt.reset' })}
              </Button>
            </div>
          </div>
        ),
        filterIcon: () => (
          <Icon type="search" style={{ color: timeBool ? '#1890ff' : undefined }} />
        ),
      },
      {
        title: formatMessage({ id: 'common.opt.status' }),
        dataIndex: 'state',
        width: '15%',
        filters: [
          { text: formatMessage({ id: 'oper_table_success' }), value: 'succeed' },
          { text: formatMessage({ id: 'oper_table_fail' }), value: 'failed' },
        ],
        filterMultiple: false,
        render: (text, record) => {
          const status =
            text === 'succeed'
              ? 'success'
              : text === 'failed'
              ? 'error'
              : text === 'pending'
              ? 'processing'
              : text;
          const read =
            record.read === 'true'
              ? `(${formatMessage({ id: 'oper_table_read_true' })})`
              : `(${formatMessage({ id: 'oper_table_read_false' })})`;
          return <Badge status={status} text={`${text}${read}`} />;
        },
      },
      {
        title: formatMessage({ id: 'oper_table_logcontent' }),
        dataIndex: 'results',
        width: '50%',
      },
    ];
    return (
      <React.Fragment>
        <Button type="primary" onClick={this.onReadAll} style={{ marginBottom: 16 }}>
          {formatMessage({ id: 'oper_table_read_all' })}
        </Button>
        <Table
          rowKey="uuid"
          size="small"
          className={styles.rowStyle}
          rowClassName={record => `read_${record.read || false}`}
          loading={operListLoading}
          columns={columns}
          dataSource={operList}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </React.Fragment>
    );
  }
}
