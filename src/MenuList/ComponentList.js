import React, { useRef } from 'react';
import MirrorDragItem, { useDrag } from '../common/DragItem';
import { Tabs, Space } from 'antd';
import { profile } from '@kne/react-view-render';
import style from './style.module.scss';
import { useGlobal } from '../context';

const TabPane = Tabs.TabPane;

const DragItem = ({ className, data, children }) => {
  const { emitter } = useGlobal();
  const { startDrag, local, onDragStart } = useDrag({
    onDrag: (local) => {
      emitter.emit('drag-down', { local, data });
    }
  });
  return <div className={className} onMouseDown={onDragStart}>
    {children}
    {startDrag && local ? <MirrorDragItem left={local.x} top={local.y}/> : null}
  </div>;
};

const ComponentList = () => {
  return (
    <Tabs className={style['component-list']} defaultActiveKey="1" tabPosition="left" type="card">
      {Object.values(profile).map(({ id, label, components }) => {
        return <TabPane tab={label} key={id}>
          <Space className={style['component-container']}>
            {components.map((item) => {
              const { name, id } = item;
              return <DragItem key={id} className={style['component-item']} data={item}>{name}</DragItem>;
            })}
          </Space>
        </TabPane>;
      })}
    </Tabs>
  );
};

export default ComponentList;