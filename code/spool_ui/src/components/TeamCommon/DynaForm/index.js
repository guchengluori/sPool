import React from 'react';
import {
  Modal,
	Form, 
  Input,
  InputNumber,
} from 'antd';
import { formatMessage } from 'umi/locale';

@Form.create()
class DynaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  /**
   * 重置方法
   */
  onrestform = () => {
    const {form} = this.props;
		form.resetFields();
  };
  
  /**
   * 新增提交
   */
  handleOk = (e) => {
		e.preventDefault();
		const { form, operTitle, handleOk} = this.props;
		form.validateFields((err, values) => {
			if (!err) {
        handleOk(values, operTitle, form);
        // form.onrestform();
			}
		});
  };

  getInput = (item) => {
    if (item.type === "password") {
      return <Input.Password placeholder="请输入密码" />
    } if (item.type === "number") {
      return <InputNumber min={1} />
    } if (item.type === "textare") {
      return <InputNumber min={1} size="190px;" />
    }
    return <Input />
  };

  getFieldDecoratorItem = (item) => {
    const { operInfo } = this.props;
    const retu = {
      initialValue: operInfo[item.name] || "",
    };
    if (item.rules) {
      retu.rules = item.rules;
    }
    return retu;
  };

  render() {
    const { operTitle, handleCancel, visible, formItems, form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 15 },
		};
    const maskClosable = false;
    return (
      <Modal
        title={formatMessage({id: `${operTitle}`}) ? formatMessage({id: `${operTitle}`}) : ''}
        visible={visible}
        onOk={this.handleOk}
        maskClosable={maskClosable}
        onCancel={() => { handleCancel(); this.onrestform(); }}
      >
        <Form>
          {
              formItems ? formItems.map(item => (
           
                <Form.Item key={item.name} label={item.filed} {...formItemLayout}>
                  {
                    getFieldDecorator(item.name, this.getFieldDecoratorItem(item))(
                      this.getInput(item)
                    )
                  }
                </Form.Item>
              )) : null
            }
        </Form>
      </Modal>
    );
  }
}
export default DynaForm;
