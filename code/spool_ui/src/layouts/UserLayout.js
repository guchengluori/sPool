import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from '@/layouts/UserLayout.less';
import logo from '@/assets/logo.png';

// const links = [
//   {
//     key: 'help',
//     title: formatMessage({ id: 'layout.user.link.help' }),
//     href: '',
//   },
//   {
//     key: 'privacy',
//     title: formatMessage({ id: 'layout.user.link.privacy' }),
//     href: '',
//   },
//   {
//     key: 'terms',
//     title: formatMessage({ id: 'layout.user.link.terms' }),
//     href: '',
//   },
// ];

const copyright = mark => (
  <Fragment>
    <div className="footerinfo">
    Copyright <Icon type="copyright" /> {`2019 ${mark}`}
    </div>
  </Fragment>
);

const UserLayout = ({ children, mark }) => (
  // @TODO <DocumentTitle title={this.getPageTitle()}>
  <div className={styles.container}>
    <div className={styles.lang}>
      <SelectLang />
    </div>
    <div className={styles.content}>
      <div className={styles.top}>
        <div className={styles.header}>
          <Link to="/user">
            <img alt="logo" className={styles.logo} src={logo} style={{height:120,position:'absolute',left:'14%',top:'77px'}} />
            {/* <span className={styles.title}>Dubhe</span> */}
          </Link>
        </div>
        {/* <div className={styles.desc}>Dubhe V1.0产品主要基于用户在web页的手动选择及信息录入，自动汇总并导出具体项目的Iaas平台部署规划数据。</div> */}
      </div>
      {children}
    </div>
    {/* links={links}  */}
    <GlobalFooter copyright={copyright(mark)} /> 
  </div>
);

export default UserLayout;
