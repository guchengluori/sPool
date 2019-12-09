import React from 'react';
import { Row, Col, Form, Select, Button, Icon, Tooltip, Popover, DatePicker, Tag } from 'antd';
import moment from 'moment';
import { handleChartStep } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;
@Form.create()
class ChartRange extends React.Component {
  constructor(props) {
    super(props);
    const currentTime = new Date().getTime();
    this.state = {
      visible: false,
      contentType: "small",
      btnInfo: "Last 12 hours",
      refreshInfo: "Refresh every 30s",
      fromTime: currentTime - 12*60*60*1000,  // 初始时默认展示最近12小时
      toTime: currentTime,
      every: "30000"
    };
    const { fromTime, toTime, every } = this.state;
    this.onTrigger(Math.floor(fromTime/1000), Math.floor(toTime/1000), every);

    this.onSelectRange = this.onSelectRange.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
  };

  onVisibleChange = (visible) => {
    const { contentType } = this.state;
    if (contentType === "small") {
      this.setState({ visible });
    }
  };

  onSelectRange = (type) => {
    const { contentType } = this.state;
    this.setState({
      visible: !typeof(type) === "string",
      contentType: typeof(type) === "string" ? type : contentType === "small" ? "big" : "small"
    });
  };

  onQuickRange = (e) => {
    // 选中快速范围的选项时，获取相应时间戳
    if (e.target.nodeName.toLowerCase() === "a") {
      const _text = e.target.innerHTML;
      const value = e.target.id;
      const toTime = new Date().getTime();
      let fromTime;
      if (value) {
        fromTime = toTime - parseInt(value, 10)*60*1000;
      }
      const { form } = this.props;
      const every = form.getFieldValue("every");
      this.onCallBack("quick", { fromTime, toTime, every }, _text);
    }
  };

  onCustomRange = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        // 获取时间戳参数
        const fromTime = values.fromTime._d.getTime();
        const toTime = values.toTime._d.getTime();
        const { every } = values;
        const front = new Date(fromTime).toLocaleString('chinese',{hour12:false});
        const back = new Date(toTime).toLocaleString('chinese',{hour12:false})
        this.onCallBack("custom", { fromTime, toTime, every }, front, back);
      }
    });
  };

  onCallBack = (type, timeData, front, back) => {
    const start = Math.floor(timeData.fromTime/1000);
    const end = Math.floor(timeData.toTime/1000);
    this.onTrigger(start, end, timeData.every); // 向父组件传递时间参数
    // 获取自动刷新时间
    const everyNum = timeData.every === "off" ? false : parseInt(timeData.every, 10);
    const refreshInfo = !everyNum ? "" : everyNum >= 60000 ? `Refreshing every ${everyNum/1000/60}m` : `Refreshing every ${everyNum/1000}s`;
    // 获取Button文案
    const btnInfo = type === "quick" ? `${front}` : `${front} to ${back}`;
    this.setState({
      fromTime: timeData.fromTime,
      toTime: timeData.toTime,
      every: timeData.every,
      visible: false,
      contentType: "small",
      btnInfo,
      refreshInfo
    });
  };

  onCloseTag = () => {
    const { form } = this.props;
    const formData = form.getFieldsValue();
    const fromTime = formData.fromTime._d.getTime();
    const toTime = formData.toTime._d.getTime();
    const start = Math.floor(fromTime/1000);
    const end = Math.floor(toTime/1000);
    this.onTrigger(start, end, "off");  // 向父组件传递时间参数
    this.setState({ every: "off", refreshInfo: "" });
  };

  onTrigger = (start, end, every) => {
    // 向父组件传递时间参数
    const step = handleChartStep(start, end);
    const data = { start, end, every, step };
    const { getTimeData } = this.props;
    if (getTimeData) {
      getTimeData(data);
    }
  };

  // onRefresh = () => {
  //   const { fromTime, toTime, every } = this.state;
  //   const start = Math.floor(fromTime/1000);
  //   const end = Math.floor(toTime/1000);
  //   this.onTrigger(start, end, every);
  // };

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { visible, contentType, btnInfo, refreshInfo, fromTime, toTime, every } = this.state;
    const content = (
      <Row gutter={16}>
        <Col span={16}>
          <h3>Custom range</h3>
          <Form onSubmit={this.onCustomRange}>
            <Form.Item label="From" className={styles.mb0}>
              {getFieldDecorator('fromTime', {
                rules: [{ required: true, message: 'Please select time!' }],
                initialValue: moment(fromTime)
              })(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
              )}
            </Form.Item>
            <Form.Item label="To" className={styles.mb0}>
              {getFieldDecorator('toTime', {
                rules: [{ required: true, message: 'Please select time!' }],
                initialValue: moment(toTime)
              })(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
              )}
            </Form.Item>
            <Form.Item label="Refreshing every" className={styles.mb0}>
              {getFieldDecorator('every', {
                rules: [{ required: false, message: 'Please select time!' }],
                initialValue: every
              })(
                <Select style={{width: 110}}>
                  <Option value="off">off</Option>
                  <Option value="5000">5s</Option>
                  <Option value="10000">10s</Option>
                  <Option value="30000">30s</Option>
                  <Option value="60000">1m</Option>
                  <Option value="300000">5m</Option>
                </Select>,
              )}
              <Button type="primary" htmlType="submit" className={styles.ml16}>Apply</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <h3 style={{whiteSpace: "nowrap"}}>Quick ranges</h3>
          <ul className={styles.quick_ul} onClick={this.onQuickRange}>
            <li><a id="5">Last 5 minutes</a></li>
            <li><a id="15">Last 15 minutes</a></li>
            <li><a id="30">Last 30 minutes</a></li>
            <li><a id="60">Last 1 hour</a></li>
            <li><a id="180">Last 3 hours</a></li>
            <li><a id="360">Last 6 hours</a></li>
            <li><a id="720">Last 12 hours</a></li>
            <li><a id="1440">Last 24 hours</a></li>
            <li><a id="2880">Last 2 days</a></li>
            <li><a id="10080">Last 7 days</a></li>
          </ul>
        </Col>
      </Row>
    );
    let TempName;
    let title;
    let placement;
    if (contentType === "small") {
      TempName = Tooltip;
      placement = "bottom";
      title = (
        <React.Fragment>
          <div>{new Date(fromTime).toLocaleString('chinese',{hour12:false})}</div>
          <div style={{textAlign: "center"}}>to</div>
          <div>{new Date(toTime).toLocaleString('chinese',{hour12:false})}</div>
        </React.Fragment>
      );
    } else {
      TempName = Popover;
      placement = "bottomRight";
      title = "Time"
    }
    return (
      <React.Fragment>
        {/* <Button shape="circle" className={styles.refresh_tag} onClick={this.onRefresh}><Icon type="sync" /></Button> */}
        <TempName visible={visible} placement={placement} content={content} title={title} onVisibleChange={this.onVisibleChange}>
          <Button type="primary" onClick={this.onSelectRange} className={styles.ml8}><Icon type="clock-circle" />{btnInfo}</Button>
        </TempName>
        {
          refreshInfo ? <Tag closable onClose={this.onCloseTag} color="purple" className={styles.refresh_tag}>{refreshInfo}</Tag> : null
        }
      </React.Fragment>
    )
  }
}

export default ChartRange;