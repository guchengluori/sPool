import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Button, Modal, Input, message, Switch, } from 'antd';
import BrickItem from './BrickItem';

@connect(({ volume, cluster }) => ({
  volume,
  cluster,
}))
@Form.create()
class ReplacelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '', 
      arbitration: false, 
      arbitrationBrick: [], 
      brick: [],
      brickIndex: '',
      bool: false,
      old_hostname: '', 
      old_directory: '', 
      new_hostname: '', 
      new_directory: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selectedRow } = nextProps;
    const { bool } = this.state;
    if (nextProps.modalVisible && !bool) {
      this.setState({
        name: selectedRow.name,
        arbitration: selectedRow.arbitration,
        brick: selectedRow.brick,
        arbitrationBrick: selectedRow.arbitration_brick,
        bool: true,
      });
    }
  }

  /**
   * 关闭弹窗
   */
  closePop = () => {
    const { onCancel } = this.props;
    this.setState({ arbBrickShow: false, brickList: [], arbBrickList: [], bool: false, brickIndex: "" });
    onCancel();
  };

  /**
   * 校验Brick信息输入
   */
  checkBrickList = (newBrickList, newArbiBrickList, type) => {
    const { brickList, arbBrickList, arbBrickShow } = this.state;
    const brickLen = Array.isArray(newBrickList) && newBrickList.length;
    let arbBrickLen = 0;
    if (arbBrickShow) {
      arbBrickLen = Array.isArray(newArbiBrickList) && newArbiBrickList.length;
    }
    // 校验Brick输入完整性
    if (brickList.length < 1) {
      message.error(formatMessage({ id: 'param.volume.brick.required' }));
      return false;
    }
    // 校验仲裁Brick
    if (arbBrickShow && arbBrickList.length < 1) {
      message.error(formatMessage({ id: 'param.volume.arbbrick.required' }));
      return false;
    }
    // 校验输入必选、必填
    if (brickLen !== brickList.length || (arbBrickShow && arbBrickLen !== arbBrickList.length)) {
      message.error(formatMessage({ id: 'param.volume.brickparam.required' }));
      return false;
    }

    // 校验复制卷输入要求
    if (type === 'Replicate') {
      if (brickLen % 2 !== 0) {
        message.error(formatMessage({ id: 'param.volume.brick.number.validate' }));
        return false;
      }
      if (arbBrickShow && brickLen / 2 !== arbBrickLen) {
        message.error(formatMessage({ id: 'param.volume.arbbrick.number.validate' }));
        return false;
      }
    }
    return true;
  };

  /**
   * Volume 替换 保存方法
   */
  handleModelConfirm = () => {
    const { dispatch, onRefresh, selectedRow } = this.props;
    const { old_hostname, old_directory, new_hostname, new_directory } = this.state;
    if ( new_hostname === "" && new_directory === "" ) {
      message.error(formatMessage({ id: 'param.volume.relpace.noreplace.nocommit' }));
      return
    }
    if ( old_hostname === "" || old_directory === "" || new_hostname === "" || new_directory === "" ) {
       message.error(formatMessage({ id: 'param.volume.relpace.param.notnull' }));
       return
    }
    const self = this;
    const params = {};
    params.cluster = selectedRow.cluster.uuid;
    params.volume_name = selectedRow.name;
    params.old_hostname = old_hostname;
    params.old_directory = old_directory;
    params.new_hostname = new_hostname;
    params.new_directory = new_directory;
    const req = 'volume/effects_replaceBrick';
    dispatch({
      payload: params,
      type: req,
    }).then(() => {
      const {
        volume: { successInfo },
      } = self.props;
      message.success(successInfo);
      this.closePop();
      onRefresh();
      // 重置表单
      self.props.form.resetFields();
      self.setState({
        replaceModalVisible: false, // 关闭弹窗
      });
    });
  };

  // 监控仲裁盘开关
  onSwitchChange = checked => {
    this.setState({
      arbBrickShow: checked,
    });
  };

  // 获取Brick列表数据
  getBrickList = (param) => {
    this.setState({
      'old_hostname': param.old_hostname, 
      'old_directory': param.old_directory, 
      'new_hostname': param.new_hostname, 
      'new_directory': param.new_directory
    });
  };

  /**
   *  设置替换brick
   */
  replaceBrick = (brickIndex) => {
    this.setState({
      brickIndex,
    });
  };

  render() {
    const { modalVisible, form, clusterInfo: {hostlist} } = this.props;
    const { name, arbitration, arbitrationBrick, brick, brickIndex} = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    const brickFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };


    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={formatMessage({ id: 'param.volume.replace.title' })}
        visible={Boolean(modalVisible)}
        onCancel={() => this.closePop()}
        width={800}
        bodyStyle={{ height: 450, overflow: 'auto' }}
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button key="handlemodalVisible" onClick={() => this.closePop()}>
            {' '}
            {formatMessage({ id: 'common.cancel' })}{' '}
          </Button>,
          <Button key="okHandle" onClick={() => this.handleModelConfirm()} type="primary">
            {' '}
            {formatMessage({ id: 'common.confirm' })}{' '}
          </Button>,
        ]}
      >
        <Form layout="horizontal">
          {/* 卷名称 */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'param.volume.name' })}>
            {form.getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'param.volume.name.required.validate' }),
                },
                {
                  pattern: new RegExp(/^[a-zA-Z][^\u4e00-\u9fa5]{1,15}/),
                  message: formatMessage({ id: 'param.volume.name.required.validate' }),
                },
              ],
              initialValue: name,
            })(<Input placeholder={formatMessage({ id: 'param.volume.name.validate' })} disabled />)}
          </Form.Item>
          {/* Brick */}
          <Form.Item
            {...brickFormItemLayout}
            label={formatMessage({
              id: 'param.volume.Brick',
            })}
          >
            {form.getFieldDecorator('brick', {
              rules: [
                {
                  required: false,
                  message: formatMessage({ id: 'param.volume.brick.required' }),
                },
              ],
            })(
              <BrickItem
                brickType="Brick"
                hostlist={hostlist}
                form={form}
                replaceBrick={(brickin) => this.replaceBrick(brickin)}
                getBrickList={(bList, arbBList) => this.getBrickList(bList, arbBList)}
                brickList={brick}
                arbBrickList={arbitrationBrick}
                brickIndex={brickIndex}
              />
            )}
          </Form.Item>

          {/* 仲裁Brick开关 */}
          <Form.Item
            {...brickFormItemLayout}
            label={formatMessage({
              id: 'param.volume.arbBrick',
            })}
          >
            {form.getFieldDecorator('arbSwitch', { rules: [] })(
              <div>
                <Switch defaultChecked={arbitration} onChange={this.onSwitchChange} />
                {
                  arbitration ? (
                    <BrickItem
                      brickType="arbBrick"
                      hostlist={hostlist}
                      form={form}
                      replaceBrick={(brickin) => this.replaceBrick(brickin)}
                      getBrickList={(bList, arbBList) => this.getBrickList(bList, arbBList)}
                      brickList={brick}
                      arbBrickList={arbitrationBrick}
                      brickIndex={brickIndex}
                    />
                ) : null}
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default ReplacelForm;
