/**
 * name: menu.log
 * icon: profile
 * order: 5
 */
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { emitter, logActive, onChangeLogActiveKey } from '@/utils/utils';
import ClusterTab from './components/ClusterTab';
import AlarmTab from './components/AlarmTab';
import OperTab from './components/OperTab';

const { TabPane } = Tabs;

@connect(({ log, loading }) => ({
  log,
  clusterListLoading: loading.effects['log/getClusterList'],
  nodeListLoading: loading.effects['log/getNodeList'],
  volumeListLoading: loading.effects['log/getVolumeList'],
  brickListLoading: loading.effects['log/getBrickList'],
  clusterLogListLoading: loading.effects['log/getClusterLogList'],
  thresholdListLoading: loading.effects['log/getThresholdList'],
  alarmListLoading: loading.effects['log/getAlarmLogList'],
  operListLoading: loading.effects['log/getOperList'],
}))
class LogPage extends React.Component {
  constructor(props) {
    super(props);
    const activeKey = (logActive && logActive.key) || 'cluster';
    if (logActive && logActive.key) {
      // 从首页跳过来后，重置一下
      onChangeLogActiveKey && onChangeLogActiveKey();
    }
    this.state = {
      activeKey,
    };
  }

  componentDidMount() {
    emitter.addListener('oper', this.onChangeTab);
    emitter.addListener('searchOper', this.onSearchOper);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'log/clear',
    });
    emitter.removeListener('oper', this.onChangeTab);
    emitter.removeListener('searchOper', this.onSearchOper);
  }

  // 切换tab页
  onChangeTab = activeKey => {
    if (activeKey === 'cluster') {
      this.clusterRef && this.clusterRef.getClusterLogList();
    } else if (activeKey === 'alarm') {
      this.alarmRef && this.alarmRef.getAlarmLogList(1, '', 'changeTab');
    } else if (activeKey === 'oper') {
      this.operRef && this.operRef.getOperList(1, '', 'changeTab');
    }
    this.setState({ activeKey });
  };

  // 查询日志页
  onSearchOper = () => {
    const { activeKey } = this.state;
    if (activeKey === 'oper') {
      this.operRef && this.operRef.getCurrentPageList('', 'changeTab');
    }
  };

  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderWrapper>
        <div className="home_background">
          <Tabs activeKey={activeKey} onChange={this.onChangeTab}>
            <TabPane tab={formatMessage({ id: 'log_cluster_tab' })} key="cluster">
              <ClusterTab
                getRef={ref => {
                  this.clusterRef = ref;
                }}
                {...this.props}
              />
            </TabPane>
            <TabPane tab={formatMessage({ id: 'log_alarm_tab' })} key="alarm">
              <AlarmTab
                ref={ref => {
                  this.alarmRef = ref;
                }}
                {...this.props}
              />
            </TabPane>
            <TabPane tab={formatMessage({ id: 'log_oper_tab' })} key="oper">
              <OperTab
                ref={ref => {
                  this.operRef = ref;
                }}
                activeKey={activeKey}
                {...this.props}
              />
            </TabPane>
          </Tabs>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default LogPage;
