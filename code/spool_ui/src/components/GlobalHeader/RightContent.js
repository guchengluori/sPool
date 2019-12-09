import React, { PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Spin, Menu, Icon, Avatar, Badge, Tooltip } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import SelectLang from '../SelectLang';
import logo from '@/assets/user.png';
import runPng from '@/pages/assets/runlog.png';
import errPng from '@/pages/assets/errorlog.png';

export default class GlobalHeaderRight extends PureComponent {
  render() {
    const { currentUser, onMenuClick, theme, pendingNum, errorNum, onRequireLog } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
       
        {/* 运行 */}
        <Tooltip title={formatMessage({ id: 'common.pending' })}>
          <Badge
            className={ `${styles.run_error_log} ${styles.run_log}`}
            count={pendingNum}
            showZero
            onClick={onRequireLog}
          >
            <Avatar size="small" src={runPng} />
          </Badge>
        </Tooltip>
        {/* 错误 */}
        <Tooltip title={formatMessage({ id: 'common.error' })}>
          <Badge className={styles.run_error_log} count={errorNum} showZero onClick={onRequireLog}>
            <Avatar size="small" src={errPng} />
          </Badge>
        </Tooltip>
        {currentUser.name ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={logo} alt="avatar" />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className={styles.action} />
      </div>
    );
  }
}
