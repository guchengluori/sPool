import React from 'react';
import { formatMessage } from 'umi/locale';
import {
    Col,
} from 'antd';
import router from 'umi/router';
import styles from '../index.less';

class BaseComponent extends React.Component {
  state = {
    // request: false,
  };

  componentDidMount() {
    
  };

  render() {
    const {
      data: {cluster, host, disk}
    } = this.props;
    return (
      <React.Fragment>
        <Col className="gutter-row" span={8}>
          <div className={`${styles.dashbox} gutter-box`} 
            onClick={() => { 
              router.push('/ClusterMgmt');
            }}
          >
            <h1>{formatMessage({ id: 'home.baseinfo.cluster' })}</h1>
            <ul className={styles.total}>
              <li><span>{formatMessage({ id: 'common.state.normal' })}</span><span style={{fontSize:'26px',marginLeft:'10px'}}>{cluster ? cluster.online : '' }</span></li>
              <li><span>{formatMessage({ id: 'common.state.warning' })}</span><span style={{fontSize:'26px',marginLeft:'10px'}}>{cluster ? cluster.alarm : ''}</span></li>
            </ul>
            <div className={styles.box1}><svg t="1570688379956" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2696" width="46" height="46"><path d="M0 614.4v273.066667l236.202667 136.533333 236.202666-136.533333V614.4L236.202667 477.866667z m404.821333 233.472l-168.618666 97.621333L68.266667 847.872V653.994667l167.936-97.621334 168.618666 97.621334zM750.933333 136.533333L512 0 273.066667 136.533333v273.066667l238.933333 136.533333L750.933333 409.6z m-68.266666 233.472L512 467.626667 341.333333 370.005333V176.128l170.666667-97.621333L682.666667 176.128z" fill="#ffffff" p-id="2697"></path><path d="M409.6 213.674667v118.784l102.4 58.709333L614.4 332.458667V213.674667l-102.4-58.709334-102.4 58.709334zM136.533333 810.325333l102.4 58.709334 102.4-58.709334v-118.784l-102.4-58.709333-102.4 58.709333v118.784zM682.666667 691.541333v118.784l102.4 58.709334 102.4-58.709334v-118.784l-102.4-58.709333-102.4 58.709333z" fill="#ffffff" p-id="2698"></path><path d="M787.797333 477.866667L550.912 614.4v273.066667l236.202667 136.533333L1024 887.466667V614.4zM955.733333 847.872l-167.936 96.938667-168.618666-96.938667V653.994667l167.936-96.938667L955.733333 653.994667z" fill="#ffffff" p-id="2699"></path></svg></div>
          </div>
        </Col>
        <Col className="gutter-row" span={8}>
          <div className={`${styles.dashbox} gutter-box`} 
            onClick={() => { 
              router.push('/HostMgmt');
            }}
          >
            <h1>{formatMessage({ id: 'home.baseinfo.host' })}</h1>
            <ul className={styles.total}>
              <li><span>{formatMessage({ id: 'common.state.normal' })}</span><span style={{fontSize:'26px',marginLeft:'10px'}}>{host ? host.online : ''}</span></li>
              <li><span>{formatMessage({ id: 'common.state.warning' })}</span><span style={{fontSize:'26px',marginLeft:'10px'}}>{host ? host.offline : ''}</span></li>
            </ul>
            <div className={styles.box2}><svg t="1570688850017" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3590"  width="46" height="46"><path d="M848 73.6L775.04 64h-512l-72.96 9.6a32 32 0 0 0-28.16 32v202.88a32 32 0 0 0 28.16 32l76.8 9.6h512l72.96-9.6a32 32 0 0 0 28.16-32V105.6a32 32 0 0 0-32-32z m-35.84 206.72l-44.16 5.76H269.44l-44.8-5.76V133.76L264.96 128H768l42.88 5.76z" fill="#ffffff" p-id="3591"></path><path d="M599.04 156.16a16 16 0 0 0-16 16v74.24a16 16 0 0 0 32 0V172.16a16 16 0 0 0-16-16zM704 156.16a16 16 0 0 0-16 16v74.24a16 16 0 0 0 32 0V172.16a16 16 0 0 0-16-16zM848 388.48l-72.96-9.6h-512l-72.96 9.6a32 32 0 0 0-28.16 32v202.88a32 32 0 0 0 28.16 32l76.8 9.6h512l72.96-9.6a32 32 0 0 0 28.16-32V420.48a32 32 0 0 0-32-32z m-35.84 206.72l-44.16 5.76H269.44L224 595.2V448l40.96-5.76H768l42.88 5.76z" fill="#ffffff" p-id="3592"></path><path d="M599.04 471.04a16 16 0 0 0-16 16v74.24a16 16 0 0 0 32 0V487.04a16 16 0 0 0-16-16zM704 471.04a16 16 0 0 0-16 16v74.24a16 16 0 0 0 32 0V487.04a16 16 0 0 0-16-16zM848 704l-72.96-9.6h-512L188.16 704a32 32 0 0 0-28.16 32v203.52a32 32 0 0 0 28.16 32l76.8 9.6h512l72.96-9.6a32 32 0 0 0 28.16-32v-204.16a32 32 0 0 0-30.08-31.36z m-35.84 206.72l-40.96 5.76H269.44l-44.8-5.76v-147.2l40.96-5.76H768l42.88 5.76z" fill="#ffffff" p-id="3593"></path><path d="M599.04 785.92a16 16 0 0 0-16 16v74.24a16 16 0 0 0 32 0v-74.24a16 16 0 0 0-16-16zM704 785.92a16 16 0 0 0-16 16v74.24a16 16 0 0 0 32 0v-74.24a16 16 0 0 0-16-16zM128 206.72a16 16 0 0 0 12.8-18.56 16 16 0 0 0-18.56-12.8l-48 9.6a16 16 0 0 0-12.8 16v272a16 16 0 0 0 12.8 16l48 9.6a16 16 0 0 0 0-32l-32.64-7.04V213.12zM970.88 184.32l-48-9.6a16 16 0 1 0-6.4 31.36l35.2 7.04v246.4l-35.2 7.04a16 16 0 0 0 0 32l48-9.6a16 16 0 0 0 12.8-16V200.32a16 16 0 0 0-6.4-16zM128 576a16 16 0 0 0 12.8-18.56 16 16 0 0 0-18.56-12.8l-48 9.6a16 16 0 0 0-12.8 16v272.64a16 16 0 0 0 12.8 16l48 9.6a16 16 0 0 0 0-32L89.6 832V584.32zM970.88 555.52l-48-9.6a16 16 0 1 0-6.4 31.36l35.2 7.04V832l-35.2 7.04a16 16 0 0 0 0 32l48-9.6a16 16 0 0 0 12.8-16V570.88a16 16 0 0 0-6.4-15.36z" fill="#ffffff" p-id="3594"></path></svg></div>
          </div>
        </Col>
        <Col className="gutter-row" span={8}>
          <div className={`${styles.dashbox} gutter-box`} 
            onClick={() => { 
              router.push('/Volume');
            }}
          >
            <h1>{formatMessage({ id: 'home.baseinfo.disk' })}</h1>
            <ul className={styles.total}>
              <li><span>{formatMessage({ id: 'common.state.normal' })}</span><span style={{fontSize:'26px',marginLeft:'10px'}}>{disk ? disk.online : ''}</span></li>
              <li><span>{formatMessage({ id: 'common.state.warning' })}</span><span style={{fontSize:'26px',marginLeft:'10px'}}>{disk ? disk.offline : ''}</span></li>
            </ul>
            <div className={styles.box3}><svg t="1570688933926" viewBox="0 0 1099 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3932" width="46" height="46"><path d="M451.06 686.1 533.16 686.1c9.8 0 16.9-5.7 16.9-15.3 0-8 0-26.3 0-36.5 0-8.8-6.3-13.8-17.6-13.8l-82 0c-10.7 0-16.1 7.6-16.1 15.8 0 6.8 0 28.1 0 33.8C434.26 677.8 442.66 686.1 451.06 686.1zM612.36 686.1l116.6 0c10.5 0 17.3-5.8 17.3-14.2 0-8.2 0-28.2 0-36.5 0-8.7-6-14.9-17.6-14.9L611.76 620.5c-10.4 0-17 6-17 14.8 0 5.6 0 24.7 0 32.1C594.76 677.6 600.86 686.1 612.36 686.1zM364.56 145.7 179.86 485.4l0 285c0 27.5 16.4 42.3 45.6 42.3l626.3 0c25.4 0 40.8-15.4 40.8-40.5L892.56 481.8 707.26 145.7 364.56 145.7zM671.66 201.6 827.16 479.8 250.06 479.8 402.86 201.6 671.66 201.6zM832.56 756.3 238.26 756.3 238.26 542.5l594.3 0L832.56 756.3z" p-id="3933" fill="#ffffff"></path></svg></div>
          </div>
        </Col>
      </React.Fragment>
    );
  }
}
export default BaseComponent;