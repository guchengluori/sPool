import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Table, Button, Tooltip, Row, Col, Form, Select } from 'antd';
import styles from '../index.less';
import { withRef } from '@/utils/utils';

const { Option } = Select;

@Form.create()
@connect(({ volume, loading }) => ({
  volume,
  loading: loading.effects['volume/effects_queryDataStatistics'],
}))
@withRef
class DataStatisticsPage extends React.Component {
  constructor(props) {
    super(props);
    const { brickList } = this.props;
    const brickNewList = brickList.filter(item => item.arbiter !== 'true'); // 过滤掉仲裁Brick
    this.state = {
      pagination: {
        page: 1,
        pageSize: 10,
        current: 1,
      },
      brickNewList,
    };
  }

  componentDidMount = () => {
    this.getDataStatistics();
  };

  getDataStatistics = (current, param) => {
    const self = this;
    const { dispatch, clusterUuid, volumeName } = this.props;
    const { pagination, brickNewList } = this.state;
    let params = {};
    if (!param) {
      params.brick_name = brickNewList[0] && brickNewList[0].name;
      params.type = 'read';
      params.list_cnt = '10';
    } else {
      params = { ...param };
    }
    params.cluster = clusterUuid;
    params.volume_name = volumeName;
    let pageNum = 1;
    if (current) {
      pageNum = current;
    } else if (pagination.current) {
      pageNum = pagination.current;
    }
    params.page = pageNum;
    params.pagesize = pagination.pageSize;
    dispatch({
      type: 'volume/effects_queryDataStatistics',
      payload: params,
    }).then(() => {
      const {
        volume: { statisticsTotal, statisticsList },
      } = self.props;
      pagination.total = statisticsTotal;
      if (current) {
        pagination.current = current;
      }
      self.setState({ pagination, statisticsList });
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      that.getDataStatistics(1, { ...fieldsValue });
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { brickNewList } = this.state;
    const hostOption = brickNewList.map(item => (
      <Option value={item.name} key={item.name}>
        {item.name}
      </Option>
    ));
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col span={6}>
            <Form.Item
              {...formItemLayout}
              label={formatMessage({ id: 'param.volume.statistics.brick' })}
            >
              {getFieldDecorator('brick_name', {
                initialValue: brickNewList[0] && brickNewList[0].name,
              })(
                <Select style={{ width: 200 }} dropdownMatchSelectWidth={false}>
                  {hostOption}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...formItemLayout}
              label={formatMessage({ id: 'param.volume.statistics.type' })}
            >
              {getFieldDecorator('type', {
                initialValue: 'read',
              })(
                <Select style={{ width: 200 }} dropdownMatchSelectWidth={false}>
                  <Option value="open">open</Option>
                  <Option value="read">read</Option>
                  <Option value="write">write</Option>
                  <Option value="opendir">opendir</Option>
                  <Option value="readdir ">readdir </Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item {...formItemLayout} label="TOP">
              {getFieldDecorator('list_cnt', {
                initialValue: '10',
              })(
                <Select style={{ width: 200 }} dropdownMatchSelectWidth={false}>
                  <Option value="10">Top10</Option>
                  <Option value="20">Top20</Option>
                  <Option value="50">Top50</Option>
                  <Option value="100">Top100</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'common.opt.query' })}
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  onChange = pagination => {
    const { form } = this.props;
    const that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      that.getDataStatistics(pagination.current, { ...fieldsValue });
    });
  };

  render() {
    const {
      loading,
      volume: { statisticsList },
    } = this.props;
    const { pagination } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'param.volume.statistics.brick' }),
        dataIndex: 'brick_name',
        width: '25%',
        render: text => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: formatMessage({ id: 'param.volume.statistics.type' }),
        dataIndex: 'type',
        width: '15%',
      },
      {
        title: formatMessage({ id: 'param.volume.statistics.count' }),
        dataIndex: 'count',
        width: '15%',
      },
      {
        title: formatMessage({ id: 'param.volume.statistics.filename' }),
        dataIndex: 'filename',
        render: text => <Tooltip title={text}>{text}</Tooltip>,
      },
    ];

    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <Table
          rowKey="uuid"
          loading={loading}
          columns={columns}
          dataSource={statisticsList}
          onChange={this.onChange}
          size="small"
          pagination={pagination}
        />
      </div>
    );
  }
}
export default DataStatisticsPage;
