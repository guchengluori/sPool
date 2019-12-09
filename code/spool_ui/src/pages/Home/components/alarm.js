import React from 'react';
import { Tooltip } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import { onChangeLogActiveKey } from '@/utils/utils';
import { getAlarmContent } from '../../Log/components/AlarmTab';
import styles from '../index.less';

const alarmLevel = {
  warning: styles.log_warning,
  critical: styles.log_critical,
};
class AlarmComponent extends React.Component {
  state = {};

  render() {
    const { data = [] } = this.props;
    return (
      <div
        className={`${styles.dashbox} gutter-box`}
        style={{ height: '260px', overflowY: 'auto' }}
      >
        <h1>{formatMessage({ id: 'home.alarm.list' })}</h1>
        <ul className={`${styles.loglist} loglist`}>
          {data.map(item => (
            <li key={item.index} className={alarmLevel[item.level]}>
              <span style={{ color: '#000000', marginRight: '10px' }}>{item.alert_item}</span>
              <span className={styles.logtxt}>
                <Tooltip title={getAlarmContent(item)}>{getAlarmContent(item)}</Tooltip>
              </span>
              <span style={{ color: '#aeaeae', marginLeft: '30px', paddingRight: '5px' }}>
                {item.time}
              </span>
            </li>
          ))}
          {/* <li className={styles.log_warning}><span style={{color:'#000000',marginRight:'10px'}}>集群状态</span><span className={styles.logtxt}>gluster01/gfs02volume01集群cluster01中节点gfs02的集群状态为离线</span><span style={{color:'#aeaeae',marginLeft:'30px',paddingRight:'5px'}}>2019-08-08 01:44:02</span></li>
          <li className={styles.log_critical}><span style={{color:'#000000',marginRight:'10px'}}>集群状态</span><span className={styles.logtxt}>gluster01/gfs02volume01集群cluster01中节点gfs02的集群状态为离线</span><span style={{color:'#aeaeae',marginLeft:'30px',paddingRight:'5px'}}>2019-08-08 01:44:02</span></li>
          <li className={styles.log_warning}><span style={{color:'#000000',marginRight:'10px'}}>集群状态</span><span className={styles.logtxt}>gluster01/gfs02volume01集群cluster01中节点gfs02的集群状态为离线</span><span style={{color:'#aeaeae',marginLeft:'30px',paddingRight:'5px'}}>2019-08-08 01:44:02</span></li>
          <li className={styles.log_critical}><span style={{color:'#000000',marginRight:'10px'}}>集群状态</span><span className={styles.logtxt}>gluster01/gfs02volume01集群cluster01中节点gfs02的集群状态为离线</span><span style={{color:'#aeaeae',marginLeft:'30px',paddingRight:'5px'}}>2019-08-08 01:44:02</span></li>
          <li className={styles.log_warning}><span style={{color:'#000000',marginRight:'10px'}}>集群状态</span><span className={styles.logtxt}>gluster01/gfs02volume01集群cluster01中节点gfs02的集群状态为离线</span><span style={{color:'#aeaeae',marginLeft:'30px',paddingRight:'5px'}}>2019-08-08 01:44:02</span></li>
          <li className={styles.log_critical}><span style={{color:'#000000',marginRight:'10px'}}>集群状态</span><span className={styles.logtxt}>gluster01/gfs02volume01集群cluster01中节点gfs02的集群状态为离线</span><span style={{color:'#aeaeae',marginLeft:'30px',paddingRight:'5px'}}>2019-08-08 01:44:02</span></li>
          <li className={styles.log_warning}><span style={{color:'#000000',marginRight:'10px'}}>集群状态</span><span className={styles.logtxt}>gluster01/gfs02volume01集群cluster01中节点gfs02的集群状态为离线</span><span style={{color:'#aeaeae',marginLeft:'30px',paddingRight:'5px'}}>2019-08-08 01:44:02</span></li> */}
          <a
            className={styles.morebtn}
            onClick={() => {
              onChangeLogActiveKey && onChangeLogActiveKey('alarm');
              router.push('/Log');
            }}
          >
            {formatMessage({ id: 'home.alarm.more' })}
          </a>
        </ul>
      </div>
    );
  }
}
export default AlarmComponent;
