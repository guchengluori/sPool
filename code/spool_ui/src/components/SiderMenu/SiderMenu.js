import React, { PureComponent, Suspense } from 'react';
import { Layout, Icon, Button, Empty } from 'antd';
import classNames from 'classnames';
// import Link from 'umi/link';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import MenuAll from './SiderMenuAll';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;

// let firstMount = true;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
      selectedModel: 'migration', // 默认选中的二级模块名
      selectedDesc: '迁移服务', // 默认选中的二级模块描述
      bigModelName: 'recovery', // 二级模块对应的一级模块名（防止二级模块名与其它一级模块对应的子模块名重复）
    };
  }

  componentDidMount() {
    // firstMount = false;
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname, flatMenuKeysLen } = state;
    if (props.location.pathname !== pathname || props.flatMenuKeys.length !== flatMenuKeysLen) {
      return {
        pathname: props.location.pathname,
        flatMenuKeysLen: props.flatMenuKeys.length,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  // 切换菜单收缩的图标
  onOperIcon = () => {
    const { collapsed, onCollapse, menuBar, handleMenuBar } = this.props;
    onCollapse(!collapsed);
    if (menuBar) {
      handleMenuBar(false);
    }
  };

  // 打开产品与服务浮层
  onOpenBar = () => {
    const { collapsed, menuBar, handleMenuBar } = this.props;
    if (!collapsed) {
      handleMenuBar(!menuBar);
    }
  };

  // 切换子模块
  onChangeModel = (bigModelName, child) => {
    const { modelName, modelDesc } = child;
    if (bigModelName && modelName) {
      this.setState({ bigModelName, selectedModel: modelName, selectedDesc: modelDesc });
    }
  };

  render() {
    const {
      hasBar,
      menuIcon,
      collapsed,
      menuBar,
      fixSiderbar,
      theme,
      route: { routes },
      handleMenuBar,
      menuOpenWidth,
      modelJson,
    } = this.props;
    const { openKeys, selectedModel, selectedDesc, bigModelName } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };
    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderBar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });
    // 产品与服务样式
    const proBtnStyle = {
      style: {
        left: !collapsed ? 0 : -menuOpenWidth,
        width: menuOpenWidth,
        visibility: !collapsed ? 'visible' : 'hidden',
      },
    };
    // 菜单样式
    const menuStyle = {
      style: hasBar
        ? {
            paddingTop: !collapsed ? 16 : 0,
            width: '100%',
            position: 'absolute',
            top: !collapsed ? 148 : 64,
          }
        : { width: '100%' },
    };
    const extraStyle = {
      height: '100%',
      background: '#eeeff3',
      margin: 0,
    };
    const emptyStyle = { style: { ...menuStyle.style, ...extraStyle } };
    // menuOpenWidth值为菜单展开时默认宽度168，由于用的地方较多，统一从父组件获取，方便后期维护修改方便
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        width={menuOpenWidth}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.menuIcon} onClick={this.onOperIcon}>
          {menuIcon || <Icon type="menu" />}
        </div>
        {hasBar ? (
          <div className={styles.productService} {...proBtnStyle}>
            <Button onClick={this.onOpenBar}>产品与服务</Button>
            <div className={styles.currentModel}>
              <span>当前模块</span>
              <span>{selectedDesc}</span>
            </div>
          </div>
        ) : null}
        <Suspense fallback={<PageLoading />}>
          {/* 临时锁定迁移服务的菜单 */}
          {selectedModel === 'migration' ? (
            <BaseMenu
              {...this.props}
              mode="inline"
              handleOpenChange={this.handleOpenChange}
              onOpenChange={this.handleOpenChange}
              {...menuStyle}
              {...defaultProps}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无菜单" {...emptyStyle} />
          )}
        </Suspense>
        <MenuAll
          visible={menuBar}
          routes={routes}
          modelJson={modelJson}
          selectedModel={selectedModel}
          bigModelName={bigModelName}
          menuOpenWidth={menuOpenWidth}
          onChangeModel={this.onChangeModel}
          handleMenuBar={handleMenuBar}
        />
      </Sider>
    );
  }
}
