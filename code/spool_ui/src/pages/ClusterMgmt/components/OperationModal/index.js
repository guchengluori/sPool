import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {
    Modal,
    Form,
    Input,
    message,
    Transfer,
} from 'antd';

const { TextArea } = Input;

@Form.create()
@connect(({ hostMgmt, clusterMgmt }) => ({
  hostMgmt,
  clusterMgmt,
}))
class OperationModal extends React.Component {
  state = {
    request: false,
    selectedKeys: [],  // 已打勾的值的集合
    dataSource: [],    // 数据源，左侧展示
    targetKeys: [],    // 显示在右侧框的数据
  };

  componentWillReceiveProps(nextProps) {
    const { request } = this.state;
    if (nextProps.visible && !request) {
      this.setState({ request: true }, () => {
        this.getDataSource();
        this.getTargetSorce();
      });
    }
  };

  /**
   * 获全部数据
   */
  getDataSource = () => {
    const { dispatch, operInfo } = this.props;
    const self = this;
    const params = {
      // state: 'unused'
    };
    dispatch({
      type: 'hostMgmt/fetch',
      payload: params
    })
      .then(() => {
        const { hostMgmt: { dataList } } = self.props;
        const array = [];
        dataList.filter(item => item.state === 'connected')
          .forEach((item) => {
            if (!item.cluster_name || item.cluster_name === "" || item.cluster_name === operInfo.name) {
              array.push(item);
            }
          });
        self.setState({
          dataSource: array,
        }, () => {
        }
        );
    })
  };

  /**
   * 获取已选择的数据 取选中数据 已选数据 targetKeys 待选数据 dataSource
   */
  getTargetSorce  = () => {
    const { operInfo } = this.props;
    const self = this;
    if ( !operInfo.hostlist ) {
      return;
    }
    const sns = [];
    operInfo.hostlist.forEach(item => {
      sns.push(item.sn);
    });
    self.setState({
      targetKeys: sns,
    });
  };


  handleSubmit = e => {
    e.preventDefault();
    const { form, operInfo } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const handleValues = {...values};
        const { dispatch, operTitle } = this.props;
        const self = this;
        if (operTitle !== "common.opt.add") {
          handleValues.uuid = operInfo.uuid;
        }
        dispatch({
          type: operTitle === 'common.opt.add' ? 'clusterMgmt/add' : 'clusterMgmt/update',
          payload: handleValues,
        }).then(() => {
          const {
            clusterMgmt: { successInfo },
            onRefresh,
          } = self.props;
          message.success(successInfo);
          self.onCancel();
          onRefresh();
        });
      }
    });
  };

  onCancel = () => {
    const { onCancel, form } = this.props;
    onCancel();
    this.setState({ request: false });
    form.resetFields();
  };

  renderItem = (item) => {
    const customLabel = (
      <span className="custom-item">
        {item.hostname}
      </span>
    );
    return {
      label: customLabel, // for displayed item
      value: item.sn, // for title and filter matching
    };
  };
  
  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys});
  };

  render() {
    const {
      visible,
      operTitle,
      form: { getFieldDecorator },
      operInfo,
    } = this.props;
    const { selectedKeys, targetKeys, dataSource } = this.state;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };

    return (
      <Modal
        title={formatMessage({ id: operTitle })}
        visible={visible}
        maskClosable={false}
        onOk={this.handleSubmit}
        onCancel={this.onCancel}
      >
        <Form>
          <Form.Item label={formatMessage({ id: 'cluster.form.name'})} {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: formatMessage({ id: 'cluster.form.name.required' }) }
              ],
              initialValue: operTitle === 'common.opt.add' ? '' : operInfo.name,
            })(
              <Input
                placeholder={formatMessage({ id: 'cluster.form.name.required' })}
                autoComplete="new-password"
              />
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'cluster.form.desc'})} {...formItemLayout}>
            {getFieldDecorator('desc', {
              rules: [
                { required: false },
              ],
              initialValue: operTitle === 'add' ? '' : operInfo.desc,
            })(
              <TextArea
                placeholder={formatMessage({ id: 'cluster.form.desc.required' })}
                rows={4} 
              />
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'cluster.form.node' })} {...formItemLayout}>
            {getFieldDecorator('hostlist', {
              rules: [{ required: false }],
              initialValue: targetKeys,
            })(
              <Transfer
                rowKey={record => record.sn}
                listStyle={{
                  width: '44%',
                  height: 200,
                }}
                dataSource={dataSource}
                titles={[formatMessage({ id: 'cluster.form.host.select' }), formatMessage({ id: 'cluster.form.host.selected' })]}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={this.handleChange}
                onSelectChange={this.handleSelectChange}
                render={this.renderItem}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default OperationModal;