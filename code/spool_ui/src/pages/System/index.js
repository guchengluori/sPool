/**
 * name: menu.system
 * icon: setting
 * order: 6
 */
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AlarmTab from './components/AlarmTab';
import ParamsTab from './components/ParamsTab';
// import ServiceTab from './components/ServiceTab';
import CommandTab from './components/CommandTab';

const { TabPane } = Tabs;

@connect(({ system, loading }) => ({
  system,
  thresholdListLoading: loading.effects['system/getThresholdList'],
  paramsListLoading: loading.effects['system/getParamsList'],
  serviceListLoading: loading.effects['system/getServiceList'],
  commandListLoading: loading.effects['system/getCommandList'],
}))
class SystemPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'alarm',
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/clear',
    });
  }

  // 切换tab页
  onChangeTab = activeKey => {
    if (activeKey === 'alarm') {
      this.alarmRef && this.alarmRef.getThresholdList();
    } else if (activeKey === 'params') {
      this.paramsRef && this.paramsRef.getParamsList();
    } else if (activeKey === 'service') {
      this.serviceRef && this.serviceRef.getServiceList();
    } else if (activeKey === 'command') {
      this.commandRef && this.commandRef.getCommandList();
    }
    this.setState({ activeKey });
  };

  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderWrapper>
        <div className="home_background">
          <Tabs activeKey={activeKey} onChange={this.onChangeTab}>
            <TabPane tab={formatMessage({ id: 'system_alarm_tab' })} key="alarm">
              <AlarmTab
                ref={ref => {
                  this.alarmRef = ref;
                }}
                {...this.props}
              />
            </TabPane>
            <TabPane tab={formatMessage({ id: 'system_params_tab' })} key="params">
              <ParamsTab
                ref={ref => {
                  this.paramsRef = ref;
                }}
                activeKey={activeKey}
                {...this.props}
              />
            </TabPane>
            {/* <TabPane tab={formatMessage({ id: 'system_service_tab' })} key="service">
              <ServiceTab
                ref={ref => {
                  this.serviceRef = ref;
                }}
                {...this.props}
              />
            </TabPane> */}
            <TabPane tab={formatMessage({ id: 'system_command_tab' })} key="command">
              <CommandTab
                ref={ref => {
                  this.commandRef = ref;
                }}
                {...this.props}
              />
            </TabPane>
          </Tabs>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default SystemPage;
