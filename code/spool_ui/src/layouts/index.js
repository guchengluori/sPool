import React from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import logo from '../assets/logo.png';
import SiderMenu from '@/components/SiderMenu';
import Header from './Header';
import Context from './MenuContext';
// import Exception404 from '../pages/404';
import UserLayout from './UserLayout';
import { emitter, onChangeLogActiveKey, createWebSocket } from '@/utils/utils';
import modelJson from './menuBar.json';
import styles from './index.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes },
    } = this.props;
    // 获取当前Seesion权限数据
    const userStr = this.getCurrentUser();
    if (!userStr) {
      router.replace('/userLogin');
      return;
    }
    // 取出缓存的用户信息
    const username = JSON.parse(userStr);
    // count：未读消息，avatar：右上角布局中的用户图标
    // const currentUser = { name: username[0], count: 11, avatar: userLogo};
    const currentUser = { name: (username && username[0]) || '' };
    dispatch({
      type: 'user/saveCurrentUser',
      payload: currentUser,
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes },
    });
    this.getOperRead();
    this.getWebSocket();
  }

  componentDidUpdate(preProps) {
    const {
      location: { pathname: oldPath },
    } = preProps;
    const {
      location: { pathname: newPath },
    } = this.props;
    // 获取当前Seesion权限数据，若用户缓存清除则自动跳到登录页重新登录
    const currentUser = this.getCurrentUser();
    if (oldPath !== newPath && !currentUser && newPath.toLowerCase() !== '/userlogin') {
      router.push('/userLogin');
    }
  }

  componentWillUnmount() {
    this.onCloseWS();
  }

  getCurrentUser = () => localStorage.getItem('sPool-authority');

  // 获取操作日志的运行及错误数量
  getOperRead = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getOperRead',
    });
  };

  onCloseWS = () => {
    this.client && this.client.close();
  };

  getWebSocket = () => {
    this.onCloseWS();
    // 开始建立连接
    this.client = createWebSocket();
    console.log('%o', '正在建立连接', this.client.readyState);
    // 开始传参通信
    this.client.onopen = () => {
      const param = {
        monitor: ['operation_log_list'],
      };
      console.log('%o', '已连接，传参通信', this.client.readyState);
      this.client.send(JSON.stringify(param));
    };
    // 接收服务端推送的数据
    this.client.onmessage = evt => {
      const obj = JSON.parse(evt.data) || {};
      // console.log('接收数据', obj);
      const {
        location: { pathname },
      } = this.props;
      if (obj.operation_log_list && pathname.toLowerCase() !== '/userlogin') {
        console.log('刷新');
        this.getOperRead();
        if (pathname.toLowerCase() === '/log') {
          emitter.emit('searchOper');
        }
      }
    };
    // 关闭webSocket连接
    this.client.onclose = error => console.log('断开连接', error && error.code);
  };

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = false;
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && key.toUpperCase().startsWith(route.path.toUpperCase())) {
          routeAuthority = true;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return 'sPool';
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.il8n || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - sPool`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout, menuOpenWidth } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : menuOpenWidth,
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  // 切换菜单吧
  handleMenuBar = bool => {
    const { dispatch, menuBar } = this.props;
    if (menuBar !== bool) {
      dispatch({
        type: 'global/changeMenuBar',
        payload: bool,
      });
      // 展开左侧菜单，展开菜单吧，则手动给body去除滚动条，render中加入遮罩
      // const bodyDom = document.getElementsByTagName('body');
      // if (bodyDom && bodyDom[0]) {
      //   if (!collapsed && bool) {
      //     bodyDom[0].style.setProperty('overflow', 'hidden', 'important');
      //   } else {
      //     bodyDom[0].style.setProperty('overflow', '');
      //   }
      // }
    }
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
      return null;
    }
    return null;
    // return <SettingDrawer />;
  };

  onHideMenu = () => {
    // 隐藏菜单吧
    this.handleMenuBar(false);
    // 收缩
    this.handleMenuCollapse(true);
  };

  // 跳转操作日志
  onRequireLog = () => {
    const {
      location: { pathname },
    } = this.props;
    if (pathname.toLowerCase() === '/log') {
      emitter.emit('oper', 'oper');
    } else {
      onChangeLogActiveKey && onChangeLogActiveKey('oper');
      router.replace('/log');
    }
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      // route: { routes },
      fixedHeader,
      collapsed,
      menuBar,
    } = this.props;
    if (pathname === '/userLogin') {
      return <UserLayout mark={formatMessage({ id: 'common.whale.cloud' })}>{children}</UserLayout>;
    }
    const isTop = PropsLayout === 'topmenu';
    // const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            hasBar={false}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            handleMenuBar={this.handleMenuBar}
            onHideMenu={this.onHideMenu}
            menuData={menuData}
            modelJson={modelJson}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
          onClick={this.onHideMenu}
        >
          <div className={!collapsed && menuBar ? 'custom-mask' : ''} />
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            onRequireLog={this.onRequireLog}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            {/* {routerConfig ? children : <Exception404 />} */}
            {menuData.length ? children : null}
          </Content>
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu }) => ({
  menuOpenWidth: 168,
  collapsed: global.collapsed,
  menuBar: global.menuBar,
  layout: setting.layout,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  pendingNum: menu.pendingNum,
  errorNum: menu.errorNum,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
