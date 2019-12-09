import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

class MenuAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, selectedModel, bigModelName, onChangeModel, handleMenuBar, menuOpenWidth, modelJson = [] } = this.props;
    return (
      <div className={styles.sidebarwarp} style={{ left: visible ? menuOpenWidth : -860, zIndex: -1 }}>
        <h2>产品与服务</h2>
        <div className={styles.sidebar_productList}>
          <Icon type="close" className={styles.menuBarClose} onClick={() => handleMenuBar(false)} />
          {modelJson.map(item => (
            <div key={item.modelName} className={styles.pic}>
              <div className={styles['sidebar-product-category-group-item']}>
                {/* 一级模块名 */}
                <h5>{item.modelDesc}</h5>
                <ul>
                  {item.modelChildren.map(child => (
                    <li key={child.modelName} className="is-active">
                      {/* 二级模块名 */}
                      <a
                        title={`${child.modelDesc}`}
                        onClick={() => onChangeModel(item.modelName, child)}
                      >
                        {child.modelDesc}
                        {/* 当前模块 */}
                        {item.modelName === bigModelName && child.modelName === selectedModel ? (
                          <span className={styles.selectnav}>当前模块</span>
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* <div className="fastnav">
          <h1>快捷导航</h1>
          <ul>
            {modelJson.map(item => (
              <li
                key={item.modelName}
                name={item.modelName}
                onClick={(e) => this.onChangeModel(e.target.name)}
                className={item.modelName === selectedModel ? 'selected' : ''}
              >
                {item.modelDesc}
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    );
  }
}

export default MenuAll;
