import React, { PureComponent } from 'react';
import { Card, List, Badge,Tooltip  } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import Ellipsis from '@/components/Ellipsis';

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      statusMap: {
        normal: '#58b431',
        warning: '#f1a81f', 
        error: '#dd1916', 
        Unknow: '#595959',
        pending: 'processing', 
        done:  'processing'
      },
      status: { 
        'normal': formatMessage({ id: 'common.state.normal'}), 
        'error': formatMessage({ id: 'common.state.error'}), 
        'pending': formatMessage({ id: 'common.state.pending'}), 
        'done': formatMessage({ id: 'common.state.pending'}), 
        'warning': formatMessage({ id: 'common.state.warning'})
      }
    };
    
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  toOpt = (record, opt) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(record, opt);
    }
  };

  render() {
    const { data, loading, } = this.props;
    const {status, statusMap} = this.state;
    return (
      <div className={styles.standardTable}>
        <List
          rowKey="uuid"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={data}
          renderItem={item =>
            (
              <List.Item key={item.id}>
                <Card 
                  hoverable 
                  className={styles.card} 
                  actions={[
                    <a onClick={e => {
                      e.preventDefault();
                      this.toOpt(item, 'modify');
                    }}
                    >{formatMessage({ id: 'common.opt.edit'})}
                    </a>, 
                    <a onClick={e => {
                      e.preventDefault();
                      this.toOpt(item, 'delete');
                    }}
                    >{formatMessage({ id: 'common.opt.del'})}
                    </a>]}
                  onClick={(e) => {
                      e.preventDefault();
                      if ( e.target.tagName !== 'A') {
                        this.toOpt(item, 'detail');
                      }
                    }}
                >
                  <Card.Meta
                    avatar={<div className={styles.clusterava}><svg t="1571290742125" className="icon" style={{marginTop:'8px',marginLeft:'9px'}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2052" width="40" height="40"><path d="M513 564.538c-3.453 0-6.906-0.894-10-2.68L322.545 457.672a19.999 19.999 0 0 1-10-17.32V231.98a19.998 19.998 0 0 1 10-17.32L503 110.475a19.998 19.998 0 0 1 20 0L703.455 214.66a19.999 19.999 0 0 1 10 17.32v208.371a19.998 19.998 0 0 1-10 17.32L523 561.858a19.98 19.98 0 0 1-10 2.68zM352.545 428.805L513 521.444l160.455-92.64V243.527L513 150.889l-160.455 92.638v185.278z" p-id="2053" fill="#14ee93"></path><path d="M511.849 327.408a9.995 9.995 0 0 1-4.925-1.297l-110.393-62.465a9.998 9.998 0 0 1-0.098-17.35l111.561-64.802a10.002 10.002 0 0 1 10.017-0.017l110.395 63.634a10 10 0 0 1-0.04 17.351l-111.563 63.633a9.997 9.997 0 0 1-4.954 1.313z m-90.288-72.578l90.268 51.078 91.479-52.178-90.271-52.035-91.476 53.135zM299.191 927.299c-3.453 0-6.906-0.894-10-2.68L108.736 820.433a19.999 19.999 0 0 1-10-17.32V594.741a19.998 19.998 0 0 1 10-17.32l180.455-104.186a19.998 19.998 0 0 1 20 0l180.456 104.186a19.999 19.999 0 0 1 10 17.32v208.371a19.998 19.998 0 0 1-10 17.32L309.191 924.619a19.991 19.991 0 0 1-10 2.68zM138.736 791.565l160.455 92.64 160.456-92.64V606.288l-160.456-92.639-160.455 92.639v185.277z" p-id="2054" fill="#14ee93"></path><path d="M298.039 690.169a9.995 9.995 0 0 1-4.925-1.297l-110.393-62.465a9.998 9.998 0 0 1-0.098-17.35l111.562-64.803a10.002 10.002 0 0 1 10.017-0.017l110.394 63.635a10.003 10.003 0 0 1-0.039 17.351l-111.563 63.633a10.014 10.014 0 0 1-4.955 1.313z m-90.288-72.578l90.268 51.077 91.479-52.178-90.271-52.035-91.476 53.136zM726.018 690.169a9.995 9.995 0 0 1-4.925-1.297L610.7 626.407a10 10 0 0 1-0.098-17.35l111.563-64.803a10.002 10.002 0 0 1 10.017-0.017l110.394 63.635a10.003 10.003 0 0 1-0.039 17.351l-111.563 63.633a10.02 10.02 0 0 1-4.956 1.313z m-90.288-72.578l90.268 51.077 91.479-52.178-90.271-52.035-91.476 53.136z" p-id="2055" fill="#14ee93"></path><path d="M725.408 927.299c-3.453 0-6.906-0.894-10-2.68L534.953 820.433a19.999 19.999 0 0 1-10-17.32V594.741a19.998 19.998 0 0 1 10-17.32l180.455-104.186a19.998 19.998 0 0 1 20 0l180.455 104.186a19.999 19.999 0 0 1 10 17.32v208.371a19.998 19.998 0 0 1-10 17.32L735.408 924.619a19.991 19.991 0 0 1-10 2.68zM564.953 791.565l160.455 92.64 160.455-92.64V606.288l-160.455-92.639-160.455 92.639v185.277z" p-id="2056" fill="#14ee93"></path></svg></div>}
                    description={
                      <Ellipsis className={styles.item} lines={3}>
                        <p>
                          <span style={{color:'#333333',display:'inline-block',width:'60px'}}>
                            {formatMessage({ id: 'cluster.form.name'})}:
                          </span>
                          <Tooltip title={item.name}><span style={{height:'18px',whiteSpace:'nowrap',width:'60%',textOverflow:'ellipsis',overflow:'hidden',display:'inline-block'}}>{ item.name ? item.name : formatMessage({ id: 'cluster.form.noname'})}</span></Tooltip>
                        </p>
                        <p>
                          <span style={{color:'#333333',display:'inline-block',width:'60px'}}>
                            {formatMessage({ id: 'cluster.form.state'})}:
                          </span>
                          <Badge status={statusMap[item.state]} text={status[item.state]} />
                        </p>
                        <p>
                          <span style={{color:'#333333',width:'60px',float:'left'}}>
                            uuid:
                          </span>
                          <Tooltip title={item.uuid}> <span style={{height:'18px',whiteSpace:'nowrap',width:'60%',float:'left',textOverflow:'ellipsis',overflow:'hidden',float:'left'}}>{item.uuid}</span></Tooltip>
                        </p>
                        <p>
                          <span style={{color:'#333333',display:'inline-block',width:'60px',float:'left'}}>
                            {formatMessage({ id: 'cluster.form.desc'})}:
                          </span>
                          <Tooltip title={item.desc}><span style={{height:'18px',whiteSpace:'nowrap',width:'60%',float:'left',textOverflow:'ellipsis',overflow:'hidden'}}>{item.desc}</span></Tooltip>
                        </p>
                      </Ellipsis>
                    }
                  />
                </Card>
              </List.Item>
            )
          }
        />
      </div>
    );
  }
}

export default StandardTable;
