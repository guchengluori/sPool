import React from 'react';
import { Transfer,Radio, Checkbox} from 'antd';
import difference from 'lodash/difference';

class CustomTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
   
  };


  render() {
    const { ...restProps } = this.props;
    return (
      <Transfer {...restProps} showSelectAll={false}>
        {({
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          let cHtml = '';
          if (direction === 'left') {
            cHtml = filteredItems.map(item => (
              <div key='code'>
                <Checkbox>{item.staffCode}: {item.staffName}</Checkbox>
              </div>
            ))
          } else {
            cHtml = filteredItems.map(item => (
              <div key='id'>
                {item.staffCode} : {item.staffName}
                <Radio.Group name="radiogroup" defaultValue={0}>
                  <Radio value={0}>只读</Radio>
                  <Radio value={1}>读写</Radio>
                </Radio.Group>
              </div>
            ))
          }
          return (
            cHtml
          );
        }}
      </Transfer>
    )
  }
}

export default CustomTransfer;