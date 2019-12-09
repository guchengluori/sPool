import React from 'react';
import { formatMessage } from 'umi/locale';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
} from "bizcharts";
import DataSet from "@antv/data-set";
import styles from '../index.less';
import { relative } from 'path';


class VolumeComponent extends React.Component {
  state = {
    // request: false,
  };

  componentDidMount() {
    
  };

  render() {
    const { DataView } = DataSet;
    const {
      data
    } = this.props;
    const chartData = [
      {
        item: formatMessage({ id: 'home.volume.usered' }),
        count: data ?  Number(data.used) : 0
      },
      {
        item: formatMessage({ id: 'home.volume.user' }),
        count: data ? Number(data.unused) : 0
      }
    ]
    const dv = new DataView();
    dv.source(chartData).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          const fomartStr = `${(val * 100).toFixed(2)} %`;
          return fomartStr;
        }
      }
    }
    return (
      <div className={`${styles.dashbox} gutter-box`} style={{height:'260px'}}>
        <h1>{formatMessage({ id: 'home.volume.size' })}</h1>
        <div style={{position:'absolute',top:'-60px'}}>
          <Chart
            height={400}
            data={dv}
            scale={cols}
            padding={[80, 100, 80, 80]}
            forceFit
          >
            <Coord type="theta" radius={0.75} />
            <Axis name="percent" />
            {/* <Legend
              position="right"
              offsetY={-window.innerHeight / 2 + 120}
              offsetX={-100}
            /> */}
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
            />
            {/* <Guide>
              <Html
                position={["50%", "50%"]}
                html="<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>主机<br><span style=&quot;color:#262626;font-size:2.5em&quot;>200</span>台</div>"
                alignX="middle"
                alignY="middle"
              />
            </Guide> */}
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                "item*percent",
                (item, percent) => {
                  const per = `${(percent * 100).toFixed(2)} %`;
                  return {
                    name: item,
                    value: per
                  };
                }
              ]}
              style={{
                lineWidth: 1,
                stroke: "#fff"
              }}
            >
              <Label
                content="percent"
                formatter={(val, item) => {
                  const ret = `${item.point.item}: ${val}`;
                  return ret;
                }}
              />
            </Geom>
          </Chart>
        </div>
        <div style={{position:'absolute',top:'10px',right:'35px'}}>
          <div style={{position:"relative"}}>
            <span className={styles.bxtips}>{formatMessage({ id: 'home.volume.totalsise' })}</span> 
            <span style={{fontWeight:'bold'}}>{data.total}GB</span>
          </div>
          <div style={{position:"relative"}}>
            <span className={styles.bxtips}>{formatMessage({ id: 'home.volume.week.up' })}</span>
            <span style={{fontWeight:'bold'}}>{data.total_week_up}%</span>
            { 
              data.total_week_up > 0 ? <span className={styles.arrup}> </span> : <span className={styles.arrdown}> </span>
            }
          </div>
          <div style={{position:"relative"}}>
            <span className={styles.bxtips}>{formatMessage({ id: 'home.volume.size' })} </span>
            <span style={{fontWeight:'bold'}}>{data.free}GB</span>
          </div>
          <div style={{position:"relative"}}>
            <span className={styles.bxtips}>{formatMessage({ id: 'home.volume.week.up' })}</span>
            <span style={{fontWeight:'bold'}}>{data.free_week_up}%</span>
            { 
              data.free_week_up > 0 ? <span className={styles.arrup}> </span> : <span className={styles.arrdown}> </span>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default VolumeComponent;