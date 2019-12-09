import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Tooltip, Modal, Table, Input, Form, message } from 'antd';
import styles from '../index.less';

const { Search } = Input;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const { editing } = this.state;
    const editable = !editing;
    this.setState({ editing: editable }, () => {
      if (editable) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave({ ...record, ...values }, () => {
        this.toggleEdit();
      });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(
          <Input
            ref={node => {
              this.input = node;
            }}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

@connect(({ volume, loading }) => ({
  volume,
  paramLoading: loading.effects['volume/effects_queryParamList'],
}))
class AllParamsModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      request: false,
      searchValue: '',
    };
  }

  componentDidUpdate = () => {
    const { request } = this.state;
    const { paramModalVisible, getParamsList } = this.props;
    if (paramModalVisible && !request) {
      this.setState({ request: true }, () => {
        getParamsList({
          status: 'all',
        });
      });
    }
  };

  onChange = e => {
    const { value } = e.target;
    this.setState({
      searchValue: value,
    });
  };

  paramSearch = value => {
    const { getParamsList } = this.props;
    getParamsList({
      status: 'all',
      key: value,
    });
  };

  onCancel = () => {
    const { onParamModalCancel } = this.props;
    this.setState({
      searchValue: '',
    });
    onParamModalCancel();
  };

  handleSave = (row, func) => {
    const self = this;
    const { dispatch, clusterUuid, volumeName, volumeUuid, getParamsList } = this.props;
    const params = { ...row };
    params.uuid = volumeUuid;
    params.cluster = clusterUuid;
    params.volume_name = volumeName;
    dispatch({
      type: 'volume/effects_modifyParam',
      payload: params,
    }).then(() => {
      const {
        volume: { successInfo, successCode },
      } = self.props;
      if (successCode === 'volume_param_modify_success') {
        message.success(successInfo);
        func();
        getParamsList({ status: 'all' });
      }
    });
  };

  render = () => {
    const { paramModalVisible, paramLoading, allParamList } = this.props;
    const { searchValue } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = [
      {
        title: formatMessage({ id: 'param.volume.param.name' }),
        dataIndex: 'name',
        width: '60%',
        render: text => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: formatMessage({ id: 'param.volume.param.value' }),
        dataIndex: 'value',
        editable: true,
      },
    ];

    const tableColumns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <Modal
        title={formatMessage({ id: 'param.volume.param.valueset' })}
        visible={paramModalVisible}
        onCancel={this.onCancel}
        width={600}
        footer={false}
      >
        <div>
          <span style={{ color: '#aeaeae' }}>
            {formatMessage({ id: 'param.volume.param.valueset.desc' })}
          </span>
          <Search
            allowClear
            placeholder={formatMessage({ id: 'common.opt.query.tips' })}
            enterButton={formatMessage({ id: 'common.opt.query' })}
            size="small"
            value={searchValue}
            onChange={this.onChange}
            onSearch={value => this.paramSearch(value)}
            style={{ marginBottom: '10px' }}
          />
          <Table
            rowKey="name"
            components={components}
            rowClassName={styles.editableRow}
            loading={paramLoading}
            columns={tableColumns}
            dataSource={allParamList}
            onChange={this.onTabChange}
            size="small"
            pagination={{ defaultPageSize: 8 }}
            bodyStyle={{ width: 550 }}
          />
        </div>
      </Modal>
    );
  };
}
export default AllParamsModel;
