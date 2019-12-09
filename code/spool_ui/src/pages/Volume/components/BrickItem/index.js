import React, { PureComponent } from 'react';
import { 
  Row,
  Col,
  Icon,
  Tooltip,
} from 'antd';
import { formatMessage } from 'umi/locale';
import BrickLabel from '../BrickLabel';
import styles from './index.less';

class BrickItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      'old_hostname': '', 
      'old_directory': '', 
      'new_hostname': '', 
      'new_directory': '', 
      'afterEdit': false,
    };
  }

  /**
   * 保存
   */
  brickSave = (brick, brickIndex) => {
    const { brickType, replaceBrick, getBrickList } = this.props;
    replaceBrick && replaceBrick(`${brickType}_${brickIndex}`);
    const { old_hostname, old_directory, new_hostname, new_directory } = this.state;
    const param = {
      'old_hostname': old_hostname, 
      'old_directory': old_directory, 
      'new_hostname': new_hostname, 
      'new_directory': new_directory, 
    };
    getBrickList(param);
    this.setState({afterEdit: true});
  };

  /**
   * 取消替换 
   * */
  brickClose =  () => {
    const { getBrickList, replaceBrick } = this.props;
    replaceBrick('');
    this.setState({
      afterEdit: false,
      old_hostname: '',
      old_directory: '',
      new_hostname: '',
      new_directory: '',
    });
    getBrickList({
      old_hostname: '',
      old_directory: '',
      new_hostname: '',
      new_directory: '',
    });
  };

  /**
   * 替换
   */
  replaceBrick = (brick, brickIndex) => {
    const { brickType, replaceBrick } = this.props;
    replaceBrick && replaceBrick(`${brickType}_${brickIndex}`);
    this.setState({
      old_hostname: brick.hostname,
      old_directory: brick.directory
    });
  };

  // 更新brick列表数据
  setNewBrick = (brickInfo) => {
    if ( brickInfo && brickInfo.new_hostname) {
      this.setState({
        'new_hostname': brickInfo.new_hostname, 
      });
    }
    if ( brickInfo && brickInfo.new_directory) {
      this.setState({
        'new_directory': brickInfo.new_directory, 
      });
    }
  };

    /**
   * 没有操作 返回的
   */
  getNoOper = (brick, index) => {
    const { hostlist, brickType } = this.props;
    return (
      <div key={`${brick.host}_${brick.directory}`}>
        <Col span={22} className={styles.brickold}>
          <BrickLabel
            brickKey={`${brick.host}_${brick.directory}`}
            hostlist={hostlist}
            brickType={brickType}
            bindex={index + 1}
            setNewBrick={this.setNewBrick}
            brickInfo={brick}
          />
        </Col>
      </div>
    )
  };

  /**
   * 替换操作
   */
  getReplaceOper = (brick, index) => {
    const { hostlist, brickType } = this.props;
    return (
      <div key={`${brick.host}_${brick.directory}`}>
        <Col span={20}>
          <BrickLabel
            brickKey={`${brick.host}_${brick.directory}`}
            hostlist={hostlist}
            brickType={brickType}
            bindex={index + 1}
            setNewBrick={this.setNewBrick}
            brickInfo={brick}
          />
        </Col>
        <Col span={4}>
          <Tooltip title={formatMessage({ id: 'common.opt.replace' })}>
            <Icon
              type="api"
              theme="twoTone"
              onClick={() => this.replaceBrick(brick, index + 1)}
            />
          </Tooltip>
        </Col>
      </div>
    )
  };

  /**
   * 保存返回操作
   */
  getSaveOper = (brick, index) => {
    const { hostlist, brickType } = this.props;
    const { afterEdit } = this.state;
    return (
      <React.Fragment>
        <div key={`${brick.host}_${brick.directory}`}>
          <Col span={22} className={styles.brickold}>
            <BrickLabel
              brickKey={`${brick.host}_${brick.directory}`}
              hostlist={hostlist}
              brickType={brickType}
              bindex={index + 1}
              setNewBrick={this.setNewBrick}
              brickInfo={brick}
            />
          </Col>
        </div>
        <div key={`${brick.host}_${brick.directory}'_replace'`}>
          <Col span={22} className={styles.bricknew}>
            <BrickLabel
              brickKey={`${brick.host}_${brick.directory}`}
              hostlist={hostlist}
              brickType='replaceBrick'
              afterEdit={afterEdit}
              bindex={index + 1}
              setNewBrick={this.setNewBrick}
            />
            {
              afterEdit ? 
                (
                  <React.Fragment>
                    <Tooltip title={formatMessage({ id: 'common.cancel' })}>
                      <Icon type="stop" theme="twoTone" onClick={() => this.brickClose()} />
                    </Tooltip>
                  </React.Fragment> 
                ): ( 
                  <React.Fragment>
                    <Tooltip title={formatMessage({ id: 'common.save' })}>
                      <Icon type="save" theme="twoTone" onClick={() => this.brickSave(brick, index + 1)} />
                    </Tooltip>
                    <Tooltip title={formatMessage({ id: 'common.cancel' })}>
                      <Icon type="stop" theme="twoTone" onClick={() => this.brickClose()} />
                    </Tooltip>
                  </React.Fragment> 
                )
            }
          </Col>
        </div>
      </React.Fragment>
    )
  };

  getItem = (brick, index) => {
    const { brickIndex, brickType } = this.props;
    if ( brickIndex !== "" ) {
      if ( brickIndex === `${brickType}_${index + 1}`) {
        return this.getSaveOper(brick, index);
      } 
        return this.getNoOper(brick, index);
    } 
      return this.getReplaceOper(brick, index);
  };

  render() {
    const { brickList, arbBrickList, brickType } = this.props;
    const itemlist = brickType === 'Brick' ? brickList : arbBrickList;
    return (
      <Row>
        {itemlist
          ? itemlist.map((brick, index) => (
            <React.Fragment key={index}>
              { 
                this.getItem(brick, index)
              }
            </React.Fragment>
            ))
          : null}
      </Row>
    );
  }
}

export default BrickItem;
