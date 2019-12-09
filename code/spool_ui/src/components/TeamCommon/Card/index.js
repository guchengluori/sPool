import React from 'react';
import { List, Button, Card, Icon, Row, Col, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import styles from './index.less';

class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderCentext = (item) => {
    const { renderCentext } = this.props;
    if(renderCentext) {
      return renderCentext(item);
    }
    return (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span className={styles.usertag1}>普通用户</span>
          <span className={styles.usertag2}>项目经理</span>
          <span className={styles.usertag3}>部门经理</span>
        </div>
        <div className={styles.listContentItem}>
          <span>描述：shssiishdididjdjjdjd</span>
        </div>
      </div>
    );
  }

  renderDetail = (item) => {
    const { detailLayout = 'list', rendDetail } = this.props;
    if (rendDetail) {
      return rendDetail(item);
    } 
    if (detailLayout === 'list') {
      return (
        <div className={styles.listdetail} style={{ display: 'none' }}>
          <p style={{ paddingTop: 10 }}>
            详细信息
          </p>
          {item.product.map((somItem) => (
            <Row
              key={somItem.code}
              justify="space-between"
              className={styles.baseinfo}
              style={{ marginBottom: 10 }}
            >
              <Col span={6}>
                <span>产品名称</span>
                <span>{somItem.name}</span>
              </Col>
              <Col span={6}>
                <span>产品类型</span>
                <span>{somItem.type}</span>
              </Col>
              <Col span={6}>
                <span>描述</span>
                <span>{somItem.desc}</span>
              </Col>
            </Row>
          ))}
        </div>
      );
    } 
    return '';
  };

  /** 下拉菜单事件 */
  onOpendetail = (e) => {
    e.stopPropagation();
    const self = e.target;
    const parentli = e.target.parentNode.parentNode.parentNode.nextElementSibling;
    const currentdisplay = parentli.style.display;
    if (currentdisplay === 'none') {
      parentli.style.display = 'block';
      self.style.transform = 'rotate(90deg)';
    } else {
      parentli.style.display = 'none';
      self.style.transform = 'rotate(-90deg)';
    }
  };

  renderOper = (p_object) => {
    const { oper, operFunc } = this.props;
    const opetLists = [];
    oper.forEach((item) => {
      
      const operBtn = (
        <Tooltip key="name" title={formatMessage({ id: item.name })}>
          <Icon
            type={item.icon_type}
            theme="twoTone"
            onClick={() => {
              const param = {};
              param.func = item;
              param.param = p_object;
              operFunc(param);
            }}
          />
        </Tooltip>
      );
      // 当权限控制字段oper_type 存在时，并且oper_type部位rendonly时 按钮操作存在
      if ( item.oper_type && item.oper_type !== 'readonly' ) {
        opetLists.push(operBtn);
      } else {
        opetLists.push(operBtn);
      }
    });

    const MoreBtn = (
      <a onClick={this.onOpendetail} className={styles.arrordown}>&lt;</a>
    );

    opetLists.push(MoreBtn);
    return opetLists;
  };

  render() {
    // list card 列表数据
    // detail boolean 是否有请求
    // detaillayout 详情布局 list 方式， table方式
    // pagination 分页信息 默认不忍也
    // addVisible 是否显示新增
    const { dataSource, detail, content, pagination, addVisible = false } = this.props;
    return (
      <Card
        className={styles.listCard}
        bordered={false}
        style={{ marginTop: 10 }}
        bodyStyle={{ padding: '0 32px 40px 32px' }}
      >
        {addVisible === 'true' ? (
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={this.showModal}
            ref={(component) => {
              /* eslint-disable */
              this.addBtn = findDOMNode(component);
            }}
          >
            添加
					</Button>
        ) : (
            ''
          )}
        <List
          size="large"
          rowKey="code"
          pagination={pagination}
          pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 10,
            }}
          dataSource={dataSource}
          renderItem={(item) => (
            <span>
              <List.Item actions={this.renderOper(item)}>
                <List.Item.Meta
                  // avatar={<Avatar src={item.logo} shape="square" size="large" />}
                  title={<a href={item.href}>{item.name}</a>}
                 // description={item.desc}
                />
                {content === 'true' ? this.renderCentext(item) :<div className={styles.listContent}>{item.desc}</div>}
                {/* { item.content ? <ListContent data={item} /> : '' } */}
              </List.Item>
              {detail === 'true' ? this.renderDetail(item) : ''}
            </span>
          )}
        />
      </Card>
    );
  }
}
export default CardList;
