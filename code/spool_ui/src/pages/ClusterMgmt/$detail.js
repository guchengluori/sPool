/**
 * name: menu.cluster.detail
 * hideInMenu: true
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Row, Col, Badge, Tooltip, Empty,Icon} from 'antd';
import { stringify, parse } from 'qs';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less'

const vloumeState = { 
  'started': styles.online,  
  'started_bg': styles.online_bg,  
  'stopped': styles.offline, 
  'stopped_bg': styles.offline_bg, 
  'created': styles.created,
  'created_bg': styles.created_bg,
  'error': styles.error,
  'error_bg': styles.error_bg
};

const nodeState = { 
  'connected': styles.online, 
  'connected_bg': styles.online_bg, 
  'disconnected': styles.offline,
  'disconnected_bg': styles.offline_bg, 
  'error': styles.error
};


/* eslint react/no-multi-comp:0 */
@connect(({ clusterMgmt,volume, loading }) => ({
  clusterMgmt,
  volume,
  loading: loading.models.rule,
}))
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    const urlInfo = props.match.params.detail ? parse(props.match.params.detail) : {};
    this.state = {
      urlInfo
    };
  }
  
  componentDidMount() {
    this.getVolumeList();
    this.getClusterClient();
  }

  getVolumeList = () => {
    const { dispatch } = this.props;
    const { urlInfo } = this.state;
    const params = {
      cluster: urlInfo.uuid
    };
    dispatch({
      type: 'volume/effects_queryVolumeList',
      payload: params,
    });
  };

  getClusterClient = () => {
    const { dispatch } = this.props;
    const { urlInfo } = this.state;
    const params = {
      uuid: urlInfo.uuid
    };
    dispatch({
      type: 'clusterMgmt/effects_queryClusterClient',
      payload: params,
    });
  };

  /**
   * 渲染客户端端口内容展示
   */
  getClientPort = (port) => {
   
    //  const re = (
    //   // port.split(",").map(item => (
        
    //   //   <span>{item}</span>
    //   // ))
    
    //  // console.log(port.length)
    
    // )
    const postTotal =  <span style={{position:'absolute',left:'-11px',top:'40px'}}>{port.port_num}{formatMessage({ id: 'cluster.detail.client.port' })}</span>;
    return  postTotal;
  };


  /**
   * 获取col 列数
   */
  getColNun = (item) => {
    const sumCount = item.split(',').length;
    let ruturnNum = 1;
    if (sumCount / 3 <= 2) {
      ruturnNum = 4;
    }  else if (sumCount / 3 > 2 && sumCount / 3 <= 4 ) {
      ruturnNum = 7;
    } else if (sumCount / 3 > 4) {
      ruturnNum = 10;
    }
    return ruturnNum;
  };

  render() {
    const { 
      urlInfo
    } = this.state;
    const {
      volume: { volumeList },
      clusterMgmt: { clientList }
    } = this.props;
    const hostlists = urlInfo.hostlist;
    return (
      <PageHeaderWrapper>
        <div>
          <h1 className={styles.home_title}>{formatMessage({ id: 'cluster.detail.title' })}</h1>
          <h2 className={styles.home_tips}>{formatMessage({ id: 'cluster.detail.title.desc' })}</h2>

          <div style={{borderBottom:'1px solid #ecedef',paddingBottom:'10px'}}>
            <h1 className={styles.title}>{formatMessage({ id: 'cluster.detail.host.title' })}
              <span>
                <i className={styles.statueline} />{formatMessage({ id: 'cluster.detail.host.clusterstate' })}
              </span>
              <span>
                <i className={styles.statuedote} />{formatMessage({ id: 'cluster.detail.host.servicestate' })}
              </span>
            </h1>
            <Row gutter={16}>
              { 
                hostlists ? (
                  hostlists.map(item => (
                    <Col span={2}>
                      <div className={styles.nodewarp}>
                        <i className={`${styles.serverstatus} ${nodeState[`${item.state}_bg`]}`} />
                        <span className={`${styles.type} ${nodeState[item.state]}`}>node </span>
                        <p className={styles.name}>
                          <Tooltip title={item.hostname}>
                            {item.hostname} 
                          </Tooltip> 
                        </p>
                        <p className={styles.ip}>{item.ip}</p>
                        <span className={`${styles.status} ${nodeState[`${item.state}_bg`]}`} />
                      </div>
                    </Col>
                  ))
              ) : <Empty />}
            </Row>
          </div>

          <div style={{borderBottom:'1px solid #ecedef',paddingBottom:'10px',marginTop:'10px'}}>
            <h1 className={styles.title}>{formatMessage({ id: 'cluster.detail.volume.title' })}</h1>
            <Row gutter={16}>
              { 
                volumeList ? (
                  volumeList.map(item => (
                    <Col span={2}>
                      <div className={styles.nodewarp}>
                        {
                          item.state !== 'pending' ? 
                          (
                            <i className={`${styles.serverstatus} ${vloumeState[`${item.state}_bg`]}`} />
                          ) : 
                          (
                            <i className={`${styles.serverstatus}`}> 
                              <Badge status="processing" style={{position:'absolute',top:'-9px'}} />
                            </i>
                          )
                        }
                        <span className={`${styles.type} ${vloumeState[item.state]}`}>vol</span>
                        <p className={styles.name}>{item.type !== '' ? item.type : formatMessage({ id: 'cluster.detail.vloume.state.unknow' })}</p>
                        <p className={styles.ip}>
                          <Tooltip title={item.name}>
                            {item.name}
                          </Tooltip> 
                        </p>
                      </div>
                    </Col>
                  ))
                ) : <Empty />}
            </Row>
          </div>

          <div style={{borderBottom:'1px solid #ecedef',paddingBottom:'10px',marginTop:'10px'}}>
            <h1 className={styles.title}>{formatMessage({ id: 'cluster.detail.client.title' })}</h1>
            <Row gutter={16}>
              { 
                clientList ? (
                  clientList.map((item, index) => (
                  //  <Col span={this.getColNun(item.port)}>
                    <Col span={2}>
                      <div className={styles.portwarp}>
                      
                        <span style={{fontSize:'12px',color:'#aeaeae',paddingLeft:'5px'}}>{index + 1}</span>
                        <p>{item.ip}</p>
                        <div className={styles.port}>
                          { 
                            this.getClientPort(item)
                          }
                         
                          {/* <span style={{position:'absolute',left:'-11px',top:'40px'}}> {this.getClientPort(item.port)}</span> */}
                        </div>
                      </div>
                    </Col>
                  ))
              ) : <Empty />}
            </Row>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
