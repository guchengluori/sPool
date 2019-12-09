/**
 * name: menu.home
 * icon: home
 * order: 1
 */
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Alarm from './components/alarm';
import BaseInfo from './components/baseInfo';
import Volume from './components/volume';

@connect(({ homemodel, log, loading }) => ({
  homemodel,
  log,
  loading: loading.models.rule,
}))
class HomeComponent extends PureComponent {
  state = {
   
  };

  componentDidMount() {
    this.getBaseData();
    this.getAlarmData();
    this.getVloumeData();
  }

  getBaseData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homemodel/effects_queryBaseInfo',
      payload: {}
    }).then(() => {
     
    });
  };

  getAlarmData = () => {
    const { dispatch } = this.props;
    const param = {
      page: 1,
      pagesize: 5,
    };
    dispatch({
      type: 'log/getAlarmLogList',
      payload: param
    }).then(() => {
     
    });
  };

  getVloumeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homemodel/effects_queryVolumeOverview',
      payload: {}
    }).then(() => {
     
    });
  };

  render() {
    const {
      homemodel: { baseInfo, volumeInfo },
      log: { alarmLogList },
    } = this.props;
    console.log(`${window.location.origin}/d/FovebS1Zk/grafana-metrics?orgId=1&fullscreen&panelId=15`);
    return (
      <PageHeaderWrapper>
        <Row gutter={16}>
          <BaseInfo data={baseInfo} />
        </Row>
        <Row gutter={16} style={{marginTop:'20px'}}>
          <Col className="gutter-row" span={12}>
            <Volume data={volumeInfo} />
          </Col>
          <Col className="gutter-row" span={12}>
            <Alarm data={alarmLogList} />
          </Col>
        </Row>
        

      </PageHeaderWrapper>
    );
  }
}

export default HomeComponent;
