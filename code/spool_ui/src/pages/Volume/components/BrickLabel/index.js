import React, { PureComponent } from 'react';
import { 
  Input,
  message,
  Select,
  Col,
} from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const { Option } = Select;

class BrickItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  // 监控Brick选择变化
  onBrickChange = value => {
    const { setNewBrick } = this.props;
    setNewBrick({
      new_hostname: value,
    });
  };

  // 监控目录文本框输入变化
  onDirInput = e => {
    const { setNewBrick } = this.props;
    const { value } = e.target;
    const reg = new RegExp(/^\/.*/);
    if (value.trim() !== '' && reg.test(value)) {
      const brickInfo = {
        new_directory: value,
      };
      setNewBrick(brickInfo);
    } else {
      message.warning(formatMessage({ id: 'param.volume.brickdir.required' }));
    }
  };

  getItem = () => {
    const { brickType, bindex, brickInfo = {} } = this.props;
    return (
      <React.Fragment>
        <span style={{display:'inline-block',
          width: '30px',
          height: '30px',
          background: '#bfbfbf',
          borderRadius: '50%',
          lineHeight: '30px',
          textAlign: 'center',
          color:'#000000',marginLeft:'10px'}}>
          旧
        </span>
        <span style={{marginLeft:'10px'}}>{`${brickType}${bindex}`}</span>
        <span style={{margin:'0 10px 0 10px',color:'#bfbfbf'}}>节点</span>
        <span>{brickInfo.hostname}</span>
        <span style={{margin:'0 10px 0 10px',color:'#bfbfbf'}}>目录</span>
        <span>{brickInfo.directory}</span>
      </React.Fragment>);
  };

  getEditItem = () => {
    const { hostlist, brickInfo = {}, afterEdit} = this.props;
    // 获取集群下所有状态为正常的节点
    const hostOptions = [];
    hostlist &&
      hostlist.map(item => {
        if (item.state === 'connected') {
          hostOptions.push(
            <Option key={item.sn} value={item.hostname}>
              {item.hostname}({item.ip})
            </Option>
          );
        }
        return hostOptions;
      });
    return (
      <React.Fragment>
        <Col span={3}>
          <span style={{
            display:'inline-block',
            width: '30px',
            height: '30px',
            background: '#1890ff',
            borderRadius: '50%',
            lineHeight: '30px',
            textAlign: 'center', 
            color:'#ffffff',
            marginLeft:'10px'}}>替</span>
        </Col>
        <Col span={2}>节点:</Col>
        <Col span={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="请选择节点"
            onChange={this.onBrickChange}
            defaultValue={brickInfo.hostname}
            disabled={afterEdit}
          >
            {hostOptions}
          </Select>
        </Col>
        <Col span={2} style={{ paddingLeft: 3 }}>
          目录:
        </Col>
        <Col span={7}>
          <Input
            onChange={this.onDirInput}
            onPressEnter={this.onDirInput}
            defaultValue={brickInfo.directory}
            disabled={afterEdit}
          />
        </Col>
      </React.Fragment>);
  };

  render() {
    const { brickType } = this.props;
    return (
      <React.Fragment>
        {
          brickType !== 'replaceBrick' ? (
            this.getItem()
          ) : ( 
            this.getEditItem()
          )
        }
      </React.Fragment>
    );
  }
}
export default BrickItem;
