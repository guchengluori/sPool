/**
 * name: menu.volume.detail
 * hideInMenu: true
 */
import React from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { formatMessage } from 'umi/locale';
import { Row, Col, Tabs, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../index.less';
import BrickTable from '../components/BrickTable';
import ParamTable from '../components/ParamTable';
import ClientTable from '../components/ClientTable';
import DataStatistics from '../components/DataStatistics';
import AllParamsModal from '../components/AllParamsModal';

const { TabPane } = Tabs;

@connect(({ volume, loading }) => ({
  volume,
  loading: loading.effects['volume/effects_queryBrickList'],
  paramLoading: loading.effects['volume/effects_queryParamList'],
}))
class VolumeDetailPage extends React.Component {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { index },
      },
    } = this.props;
    this.state = {
      volumeInfo: parse(index), // 磁盘卷详细信息
      brickList: [],
      paramList: [],
      allParamList: [],
      paramModalVisible: false,
    };
  }

  componentDidMount = () => {
    this.getBrickList();
    this.getParamsList({ status: 'changed', key: '' });
  };

  /**
   * 获取Brick列表
   */
  getBrickList = () => {
    const self = this;
    const { dispatch } = this.props;
    const {
      volumeInfo: { uuid, cluster, name },
    } = this.state;
    const params = {};
    params.uuid = uuid;
    params.cluster = cluster && cluster.uuid;
    params.volume_name = name;
    dispatch({
      type: 'volume/effects_queryBrickList',
      payload: params,
    }).then(() => {
      const {
        volume: { brickList },
      } = self.props;
      self.setState({ brickList });
    });
  };

  /**
   * 获取参数列表
   */
  getParamsList = param => {
    const self = this;
    const { dispatch } = this.props;
    const {
      volumeInfo: { uuid, cluster, name },
    } = this.state;
    const params = { ...param };
    params.uuid = uuid;
    params.cluster = cluster && cluster.uuid;
    params.volume_name = name;
    dispatch({
      type: 'volume/effects_queryParamList',
      payload: params,
    }).then(() => {
      const {
        volume: { paramList },
      } = self.props;
      if (param.status === 'all') {
        self.setState({ allParamList: paramList, paramModalVisible: true });
      } else {
        self.setState({ paramList });
      }
    });
  };

  // 监控Tab页切换，实时刷新
  onTabChange = checked => {
    if (checked === '1') {
      this.getBrickList();
      this.getParamsList({ status: 'changed', key: '' });
    } else if (checked === '2') {
      if (this.statisticsRef) {
        this.statisticsRef.getDataStatistics();
      }
    }
  };

  // 查看所有参数 || 根据名称筛选
  onShowAllParams = () => {
    this.getParamsList({ status: 'all' });
  };

  // 监控所有参数弹窗关闭，同时更新当前卷信息（主要是NFS禁用参数值更新）
  onParamModalCancel = () => {
    const self = this;
    const { dispatch } = this.props;
    const { volumeInfo } = this.state;
    const params = {};
    params.key = volumeInfo.uuid;
    dispatch({
      type: 'volume/effects_queryVolumeList',
      payload: params,
    }).then(() => {
      const {
        volume: { volumeList = [] },
      } = self.props;
      this.setState({
        paramModalVisible: false,
        allParamList: [],
        volumeInfo: volumeList ? volumeList[0] : volumeInfo,
      });
      this.getParamsList({ status: 'changed' });
    });
  };

  render() {
    const {
      volumeInfo,
      volumeInfo: { uuid, name, cluster },
      brickList,
      paramList,
      allParamList,
      paramModalVisible,
    } = this.state;
    return (
      <PageHeaderWrapper>
        <div className="home_background">
          <h1 className={styles.home_title}>
            {name} {formatMessage({ id: 'param.volume.detail' })}
            {volumeInfo.state === 'started' ? (
              <span className={`${styles.volstatus} ${styles.started}`}>{volumeInfo.state}</span>
            ) : volumeInfo.state === 'stopped' ? (
              <span className={`${styles.volstatus} ${styles.stopped}`}>{volumeInfo.state}</span>
            ) : (
              <span className={`${styles.volstatus} ${styles.created}`}>{volumeInfo.state}</span>
            )}
          </h1>
          <h2 className={styles.home_tips}>
            {formatMessage({ id: 'param.volume.detail.id' })}:{uuid}
          </h2>
          <div style={{ position: 'absolute', width: '56%', top: '170px', left: '40%' }}>
            <Row gutter={16}>
              <Col span={6}>
                {formatMessage({ id: 'param.volume.detail.type' })} : <span>{volumeInfo.type}</span>
              </Col>
              <Col span={6}>
                {formatMessage({ id: 'param.volume.detail.transport' })} :{' '}
                <span>{volumeInfo.transport_type}</span>
              </Col>
              <Col span={6}>
                {formatMessage({ id: 'param.volume.detail.nfs' })} :{' '}
                <span>{volumeInfo.nfs_disabled}</span>
              </Col>
              <Col span={6}>
                {formatMessage({ id: 'param.volume.detail.splitbrain' })} :{' '}
                <span>{volumeInfo.split_brain}</span>
              </Col>
            </Row>
          </div>
          <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
            <TabPane tab={formatMessage({ id: 'param.volume.detail.tab.info' })} key="1">
              <p>{formatMessage({ id: 'param.volume.detail.bricklist' })}</p>
              <BrickTable
                onChange={this.onChange}
                brickList={brickList}
                getBrickList={this.getBrickList}
              />
              <Row gutter={16} style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <p>
                    {formatMessage({ id: 'param.volume.detail.param' })}
                    <span style={{ color: '#aeaeae', marginLeft: '10px' }}>
                      {formatMessage({ id: 'param.volume.detail.param.desc' })}
                      <Button onClick={this.onShowAllParams}>
                        {formatMessage({ id: 'param.volume.detail.param.showall' })}
                      </Button>
                    </span>
                  </p>
                  <ParamTable
                    onChange={this.onChange}
                    paramList={paramList}
                    getParamsList={this.getParamsList}
                  />
                </Col>
                <Col span={12} style={{ marginTop: '12px' }}>
                  <p>{formatMessage({ id: 'param.volume.detail.client' })}</p>
                  <ClientTable
                    brickList={brickList}
                    onChange={this.onChange}
                    clusterUuid={cluster && cluster.uuid}
                    volumeName={name}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={formatMessage({ id: 'param.volume.detail.tab.statistics' })} key="2">
              <DataStatistics
                clusterUuid={cluster && cluster.uuid}
                volumeName={name}
                brickList={brickList}
                getInstance={ref => {
                  this.statisticsRef = ref;
                }}
              />
            </TabPane>
          </Tabs>
          <AllParamsModal
            paramModalVisible={paramModalVisible}
            onParamModalCancel={this.onParamModalCancel}
            allParamList={allParamList}
            getBrickList={this.getBrickList}
            getParamsList={this.getParamsList}
            clusterUuid={cluster && cluster.uuid}
            volumeName={name}
            volumeUuid={uuid}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default VolumeDetailPage;
