import React from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { formatMessage } from 'umi/locale';
import { Form, Button, Modal, Input, message, Select, Switch, Row, Col, Icon } from 'antd';

const { Option } = Select;

@connect(({ volume, loading }) => ({
  volume,
  loading: loading.effects['volume/effects_queryClusterList'],
}))
@Form.create()
class ModalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      request: false,
      volumeStrList: '', // 精简volume卷信息，获取卷名+归属集群JSON字符串
      optionalClusters: [], // 可选择集群列表
      optionalBricks: [], // 已选择集群下可选择有效brick列表
      arbBrickShow: false, // 是否开启仲裁Brick开关
      brickList: [], // Brick列表
      arbBrickList: [], // 仲裁Brick列表
      nameValidFlag: '', // 卷名校验状态
      nameValidInfo: '', // 卷名称校验提示信息
      clusterValidFlag: '', // 集群校验状态
      clusterValidInfo: '', // 集群校验提示信息
    };
  }

  componentDidUpdate = () => {
    const { request } = this.state;
    const { modalVisible } = this.props;
    if (modalVisible && !request) {
      this.setState({ request: true }, () => {
        this.getVolumeList();
        this.getClusterList();
      });
    }
  };

  /**
   * 获取卷列表
   */
  getVolumeList = () => {
    const self = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'volume/effects_queryVolumeList',
      payload: {},
    }).then(() => {
      const {
        volume: { volumeList },
      } = self.props;
      // 精简volume卷信息，获取卷名+归属集群JSON字符串
      const volumeStrList = volumeList
        .filter(item => item.state !== 'error' && item.state !== 'pending' && item.state !== 'done')
        .map(item => stringify({ name: item.name, cluster: item.cluster && item.cluster.uuid }));
      console.log('volumeStrList:', volumeStrList);
      self.setState({ volumeStrList });
    });
  };

  // 获取集群数据
  getClusterList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'volume/effects_queryClusterList',
      payload: {},
    }).then(() => {
      const {
        volume: { clusterList },
      } = this.props;
      this.setState({
        optionalClusters: clusterList,
      });
    });
  };

  /**
   * 关闭弹窗
   */
  closePop = () => {
    const { onCancel } = this.props;
    onCancel();
    this.setState({
      request: false,
      arbBrickShow: false,
      brickList: [],
      arbBrickList: [],
      nameValidFlag: '',
      nameValidInfo: '',
      clusterValidFlag: '',
      clusterValidInfo: '',
    });
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
   * 新增/修改弹窗
   */
  handleModalConfirm = () => {
    const { dispatch, onRefresh, form } = this.props;
    const { brickList, arbBrickList, arbBrickShow, clusterValidFlag, nameValidFlag } = this.state;
    form.validateFields((err, values) => {
      if (!err && clusterValidFlag !== 'error' && nameValidFlag !== 'error') {
        const self = this;
        const value = { ...values };
        // 过滤掉form中多余参数
        const params = {};
        params.name = value.name;
        params.type = value.type;
        params.transport_type = value.transport_type;
        params.cluster = value.cluster;
        const req = 'volume/effects_addVolume';
        const newBrickList =
          brickList &&
          brickList
            .filter(item => item.host !== '' && item.directory !== '')
            .map(item => ({ host: item.host, directory: item.directory }));
        params.brick = newBrickList; // Brick列表

        params.arbitration = arbBrickShow; // 是否开启仲裁盘
        let newArbiBrickList = [];
        if (arbBrickShow) {
          newArbiBrickList =
            arbBrickList &&
            arbBrickList
              .filter(item => item.host !== '' && item.directory !== '')
              .map(item => ({ host: item.host, directory: item.directory }));
          params.arbitration_brick = newArbiBrickList; // 仲裁Brick列表
        }

        // 校验Brick信息输入
        const checkResult = this.checkBrickList(newBrickList, newArbiBrickList, value.type);
        if (!checkResult) {
          return;
        }

        console.log('handleModalConfirm---params:', params);
        dispatch({ payload: params, type: req }).then(() => {
          const {
            volume: { successInfo },
          } = self.props;
          message.success(successInfo);
          this.closePop();
          onRefresh();
          // 重置表单
          self.props.form.resetFields();
          self.setState({ visible: false });
        });
      }
    });
  };

  // 监控集群选择变化
  onClusterChange = value => {
    const { optionalClusters } = this.state;
    const currentCluster = optionalClusters.filter(item => item.uuid === value);
    const result = this.checkClusterValid(value);
    if (result) {
      this.setValidator('cluster');
    }
    this.setState({
      optionalBricks: currentCluster && currentCluster[0].hostlist,
    });
  };

  // 监控仲裁盘开关
  onSwitchChange = checked => {
    this.setState({
      arbBrickShow: checked,
    });
  };

  // 获取Brick列表数据
  getBrickList = (brickList, arbBrickList) => {
    this.setState({
      brickList,
      arbBrickList,
    });
  };

  // 校验名称+归属集群的唯一性
  setValidator = flag => {
    const {
      form: { getFieldValue },
    } = this.props;
    const { volumeStrList } = this.state;
    console.log('volumeStrList:', volumeStrList);
    const validatorValue = stringify({
      name: getFieldValue('name'),
      cluster: getFieldValue('cluster'),
    });
    let info = '';
    if (volumeStrList.indexOf(validatorValue) !== -1) {
      info = `${formatMessage({ id: 'param.volume.current.cluster' })},${getFieldValue(
        'name'
      )} ${formatMessage({ id: 'param.volume.volumename.already.exist' })}`;
      this.setState({
        nameValidFlag: flag === 'name' ? 'error' : '',
        clusterValidFlag: flag === 'cluster' ? 'error' : '',
        nameValidInfo: flag === 'name' ? info : '',
        clusterValidInfo: flag === 'cluster' ? info : '',
      });
    } else {
      this.setState({
        nameValidFlag: 'success',
        clusterValidFlag: 'success',
        nameValidInfo: '',
        clusterValidInfo: '',
      });
    }
  };

  // 校验name有效性
  checkNameValid = nameValue => {
    const {
      form: { getFieldValue },
    } = this.props;
    let info = '';
    const reg = /^[a-zA-Z][^\u4e00-\u9fa5]{5,15}$/;
    if (!nameValue || nameValue === '') {
      info = formatMessage({ id: 'param.volume.name.required.validate' });
      this.setState({
        nameValidFlag: 'error',
        nameValidInfo: info,
        clusterValidFlag: 'success',
        clusterValidInfo: '',
      });
      return false;
    }
    if (!reg.test(nameValue)) {
      info = formatMessage({ id: 'param.volume.volumename.validate' });
      this.setState({
        nameValidFlag: 'error',
        nameValidInfo: info,
        clusterValidFlag: 'success',
        clusterValidInfo: '',
      });
      return false;
    }
    const clusterValue = getFieldValue('cluster');
    if (!clusterValue || clusterValue === '') {
      info = formatMessage({ id: 'param.volume.cluster.required.validate' });
      this.setState({
        nameValidFlag: 'success',
        nameValidInfo: '',
        clusterValidFlag: 'error',
        clusterValidInfo: info,
      });
      return false;
    }
    return true;
  };

  // 监控校验name的input输入
  onChange = e => {
    const nameValue = e.target.value;
    const result = this.checkNameValid(nameValue);
    if (result) {
      this.setValidator('name');
    }
  };

  // form自定义校验集群下是否已存在卷name
  nameValidator = (rule, value, callback) => {
    const result = this.checkNameValid(value);
    if (result) {
      this.setValidator('name');
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  };

  // 校验集群下是否已存在卷name
  clusterValidator = (rule, value, callback) => {
    const result = this.checkClusterValid(value);
    if (result) {
      this.setValidator('cluster');
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  };

  checkClusterValid = value => {
    const {
      form: { getFieldValue },
    } = this.props;
    let info = '';
    if (!value || value === '') {
      info = formatMessage({ id: 'param.volume.cluster.required.validate' });
      this.setState({
        clusterValidFlag: 'error',
        clusterValidInfo: info,
      });
      return false;
    }
    const nameValue = getFieldValue('name');
    if (!nameValue || nameValue === '') {
      info = formatMessage({ id: 'param.volume.name.required.validate' });
      this.setState({
        nameValidFlag: 'error',
        nameValidInfo: info,
        clusterValidFlag: 'success',
        clusterValidInfo: '',
      });
      return false;
    }
    const reg = /^[a-zA-Z][^\u4e00-\u9fa5]{5,15}$/;
    if (!reg.test(nameValue)) {
      info = formatMessage({ id: 'param.volume.volumename.validate' });
      this.setState({
        nameValidFlag: 'error',
        nameValidInfo: info,
        clusterValidFlag: 'success',
        clusterValidInfo: '',
      });
      return false;
    }
    
    return true;
  };

  render() {
    const { modalVisible, form, loading } = this.props;
    const {
      optionalClusters,
      optionalBricks,
      arbBrickShow,
      brickList,
      arbBrickList,
      nameValidFlag,
      nameValidInfo,
      clusterValidFlag,
      clusterValidInfo,
    } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    const brickFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };

    // 获取集群列表数据，非正常状态的集群不可选
    const clusterOptions = [];
    optionalClusters.map(item => {
      if (item.state === 'error' || item.state === 'pending' || item.state === 'done') {
        clusterOptions.push(
          <Option key={item.uuid} value={item.uuid} disabled>
            {item.name}
          </Option>
        );
      } else {
        clusterOptions.push(
          <Option key={item.uuid} value={item.uuid}>
            {item.name}
          </Option>
        );
      }
      return clusterOptions;
    });

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={formatMessage({ id: 'param.volume.add.title' })}
        visible={Boolean(modalVisible)}
        onCancel={() => this.closePop()}
        width={800}
        bodyStyle={{ height: 450, overflow: 'auto' }}
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button key="handleModalVisible" onClick={() => this.closePop()}>
            {' '}
            {formatMessage({ id: 'common.cancel' })}{' '}
          </Button>,
          <Button key="okHandle" onClick={() => this.handleModalConfirm()} type="primary">
            {' '}
            {formatMessage({ id: 'common.confirm' })}{' '}
          </Button>,
        ]}
      >
        <Form layout="horizontal">
          {/* 卷名称 */}
          <Form.Item
            {...formItemLayout}
            label={formatMessage({
              id: 'param.volume.name',
            })}
            help={nameValidInfo}
            hasFeedback
            validateStatus={nameValidFlag}
          >
            {form.getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'param.volume.name.required.validate' }),
                },
                {
                  validator: this.nameValidator,
                },
              ],
            })(
              <Input
                placeholder={formatMessage({ id: 'param.volume.name.validate' })}
                onBlur={this.onChange}
                onPressEnter={this.onChange}
              />
            )}
          </Form.Item>

          {/* 卷类型 */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'param.volume.type' })}>
            {form.getFieldDecorator('type', {
              initialValue: 'Replicate',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'param.volume.type.required.validate' }),
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                placeholder={formatMessage({
                  id: 'param.volume.type.validate',
                })}
                onChange={this.onTransportChange}
              >
                <Option value="Replicate">Replicate</Option>
                {/* 目前仅支持复制卷类型 */}
                {/* <Option value="Distributed">Distributed</Option> */}
              </Select>
            )}
          </Form.Item>

          {/* 传输类型 */}
          <Form.Item
            {...formItemLayout}
            label={formatMessage({
              id: 'param.volume.transport',
            })}
          >
            {form.getFieldDecorator('transport_type', {
              initialValue: 'tcp',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'param.volume.transport.required.validate' }),
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                placeholder={formatMessage({
                  id: 'param.volume.transport.validate',
                })}
                onChange={this.onTransportChange}
              >
                <Option value="tcp">TCP</Option>
                {/* 目前仅支持TCP类型 */}
                {/* <Option value="rdma" disabled>RDMA</Option>
                <Option value="tcp,rdma" disabled>TCP,RDMA</Option> */}
              </Select>
            )}
          </Form.Item>

          {/* 集群 */}
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'param.volume.cluster' })}
            help={clusterValidInfo}
            validateStatus={clusterValidFlag}
          >
            {form.getFieldDecorator('cluster', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'param.volume.cluster.required.validate' }),
                },
                {
                  validator: this.clusterValidator,
                },
              ],
            })(
              <Select
                loading={loading}
                style={{ width: '100%' }}
                placeholder={formatMessage({
                  id: 'param.volume.cluster.validate',
                })}
                onChange={this.onClusterChange}
              >
                {clusterOptions}
              </Select>
            )}
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
              <BrickDiv
                brickType="Brick"
                optionalBricks={optionalBricks}
                form={form}
                getBrickList={(bList, arbBList) => this.getBrickList(bList, arbBList)}
                brickList={brickList}
                arbBrickList={arbBrickList}
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
                <Switch defaultChecked={false} onChange={this.onSwitchChange} />
                {arbBrickShow ? (
                  <BrickDiv
                    brickType="arbBrick"
                    optionalBricks={optionalBricks}
                    form={form}
                    getBrickList={(bList, arbBList) => this.getBrickList(bList, arbBList)}
                    brickList={brickList}
                    arbBrickList={arbBrickList}
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

export default ModalForm;

class BrickDiv extends React.Component {
  constructor(props) {
    super(props);
    const { brickType } = this.props;
    this.state = {
      bindex: 0,
      baseList: [{ host: '', directory: '', key: `${brickType}-0` }],
    };
  }

  // add
  brickAdd = () => {
    const { brickType, getBrickList, brickList, arbBrickList } = this.props;
    const { bindex, baseList } = this.state;
    const newBaseList = baseList;
    const newBrick = { host: '', directory: '', key: `${brickType}-${bindex + 1}` };
    newBaseList.push(newBrick);
    this.setState({
      bindex: bindex + 1,
      baseList: newBaseList,
    });
    if (brickType === 'Brick') {
      getBrickList(newBaseList, arbBrickList);
    } else {
      getBrickList(brickList, newBaseList);
    }
  };

  // del
  brickDel = key => {
    const { brickType, getBrickList, brickList, arbBrickList } = this.props;
    const { baseList } = this.state;
    // 删除对应记录
    const newBaseList = baseList.filter(item => item.key !== key);
    this.setState({
      baseList: newBaseList,
    });
    if (brickType === 'Brick') {
      getBrickList(newBaseList, arbBrickList);
    } else {
      getBrickList(brickList, newBaseList);
    }
  };

  // 更新brick列表数据
  setBrickList = (brickKey, brickInfo) => {
    const { brickType, getBrickList, brickList, arbBrickList } = this.props;
    const { baseList } = this.state;
    const list = baseList.filter(item => item.key === brickKey);
    if (list) {
      Object.assign(list[0], brickInfo);
    } else {
      baseList.push(brickInfo);
    }
    this.setState({
      baseList,
    });
    if (brickType === 'Brick') {
      getBrickList(baseList, arbBrickList);
    } else if (brickType === 'arbBrick') {
      getBrickList(brickList, baseList);
    }
  };

  render() {
    const { optionalBricks, brickType } = this.props;
    const { baseList } = this.state;
    return (
      <Row>
        {baseList.length <= 1 ? (
          <Col span={22}>
            <BrickLabel
              brickKey={`${brickType}-0`}
              optionalBricks={optionalBricks}
              brickType={brickType}
              bindex={1}
              setBrickList={this.setBrickList}
              brickInfo={baseList[0]}
            />
          </Col>
        ) : (
          baseList.map((brick, index) => (
            <div key={brick.key}>
              <Col span={22}>
                <BrickLabel
                  brickKey={brick.key}
                  optionalBricks={optionalBricks}
                  brickType={brickType}
                  bindex={index + 1}
                  setBrickList={this.setBrickList}
                  brickInfo={brick}
                />
              </Col>
              <Col span={1}>
                <Icon
                  type="minus-circle"
                  theme="twoTone"
                  onClick={() => this.brickDel(brick.key)}
                />
              </Col>
            </div>
          ))
        )}
        <Col span={1}>
          <Icon type="plus-circle" theme="twoTone" onClick={() => this.brickAdd()} />
        </Col>
      </Row>
    );
  }
}

class BrickLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 监控Brick选择变化
  onBrickChange = value => {
    const { brickKey, setBrickList } = this.props;
    const brickInfo = {
      key: brickKey,
      host: value,
    };
    setBrickList(brickKey, brickInfo);
  };

  // 监控目录文本框输入变化
  onDirInput = e => {
    const { brickKey, setBrickList } = this.props;
    const { value } = e.target;
    const reg = new RegExp(/^\/.*/);
    if (value.trim() !== '' && reg.test(value)) {
      const brickInfo = {
        key: brickKey,
        directory: value,
      };
      setBrickList(brickKey, brickInfo);
    } else {
      message.warning(formatMessage({ id: 'param.volume.brickdir.required' }));
    }
  };

  render() {
    const { optionalBricks, brickType, bindex, brickInfo } = this.props;
    // 获取集群下所有状态为正常的节点，非正常状态不可选
    const brickOptions = [];
    optionalBricks.map(item => {
      if (item.state === 'connected') {
        brickOptions.push(
          <Option key={item.sn} value={item.hostname}>
            {item.hostname}({item.ip})
          </Option>
        );
      } else {
        brickOptions.push(
          <Option key={item.sn} value={item.hostname} disabled>
            {item.hostname}({item.ip})
          </Option>
        );
      }
      return brickOptions;
    });

    return (
      <div>
        <Col span={4}>{`${brickType}${bindex}`}</Col>
        <Col span={2}>{formatMessage({ id: 'param.volume.brick' })}:</Col>
        <Col span={8}>
          <Select
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'param.volume.brick.select' })}
            onChange={this.onBrickChange}
            defaultValue={brickInfo.host}
            dropdownMatchSelectWidth={false}
          >
            {brickOptions}
          </Select>
        </Col>
        <Col span={2} style={{ paddingLeft: 3 }}>
          {formatMessage({ id: 'param.volume.brickdir' })}:
        </Col>
        <Col span={7}>
          <Input
            onChange={this.onDirInput}
            onPressEnter={this.onDirInput}
            defaultValue={brickInfo.directory}
          />
        </Col>
      </div>
    );
  }
}
