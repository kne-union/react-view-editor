import React, { Fragment } from 'react';
import { useGlobal } from '../context';
import { Collapse, Space, Tabs } from 'antd';
import { profileMap } from '@kne/react-view-render';
import Props from './Props';
import style from './style.module.scss';

const { Panel } = Collapse;
const { TabPane } = Tabs;

const ActiveComponent = () => {
  const { active } = useGlobal();
  if (!active) {
    return '请选择左侧进行编辑...';
  }
  return <>
    <Space className={style['title']}>
      <div>ID:{active.id}</div>
      <div>组件:{profileMap[active.component].name}({active.component})</div>
    </Space>
    <Collapse defaultActiveKey='1' ghost className={style['collapse']}>
      <Panel header="属性" key="1">
        <Props/>
      </Panel>
      <Panel header="样式" key="2">
        <p>xxxxx</p>
      </Panel>
    </Collapse>
  </>;
};

const NodeTree = () => {
  return <div>
    xxxxxx
  </div>;
};

const Toolbar = () => {
  return <Tabs className={style['toolbar']} defaultActiveKey="1">
    <TabPane tab="当前节点" key="1">
      <ActiveComponent/>
    </TabPane>
    <TabPane tab="节点树" key="2">
      <NodeTree/>
    </TabPane>
  </Tabs>;
};

export default Toolbar;