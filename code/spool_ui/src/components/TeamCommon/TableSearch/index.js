import React from 'react';
import { formatMessage } from 'umi/locale';
import { Input, Icon, Button } from 'antd';
import styles from './index.less';

const { Search } = Input;

export default class TableSearch extends React.Component {
  state = {
    value: '',
  };

  onReset = () => {
    const { onSearch } = this.props;
    onSearch && onSearch('');
    this.setState({ value: '' });
  };

  onChange = e => {
    this.setState({ value: e.target.value });
  };

  onSearch = () => {
    const { value } = this.state;
    const text = value.trim();
    const { onSearch } = this.props;
    onSearch && onSearch(text);
  };

  render() {
    const { btnArr = [] } = this.props;
    const { value } = this.state;
    return (
      <div className={styles.div_flex}>
        <div>
          {btnArr.map(item => (
            <Button
              key={item.name}
              {...item}
              style={{ marginRight: 8 }}
            >
              {item.name}
            </Button>
          ))}
        </div>
        <Search
          placeholder={formatMessage({ id: 'common.opt.query.tips' })}
          value={value}
          onChange={this.onChange}
          onSearch={this.onSearch}
          suffix={
            value ? (
              <Icon
                type="close-circle"
                theme="filled"
                onClick={this.onReset}
                style={{ fontSize: 12 }}
              />
            ) : (
              <span />
            )
          }
          enterButton={<Icon type="search" />}
          style={{ width: '20%' }}
        />
      </div>
    );
  }
}
