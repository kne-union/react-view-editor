import React from 'react';
import { Button, Space, Select, Switch } from 'antd';
import { useGlobal } from '../context';
import showVariable from './showVariable';
import showFunctions from './showFunctions';
import style from './style.module.scss';

export default () => {
  const { stageSize, setStageSize, content, action, codeMode, setCodeMode } = useGlobal();
  return <div className={style.nav}>
    <Space>
      <span>页面类型:</span>
      <Select value={stageSize} onChange={setStageSize} placeholder="请选择类型">
        <Select.Option value='100%'>自适应</Select.Option>
        <Select.Option value='1366px'>PC端</Select.Option>
        <Select.Option value='375px'>iPhone 6/7/8</Select.Option>
        <Select.Option value='414px'>iPhone 6/7/8 Plus</Select.Option>
        <Select.Option value='768px'>iPad</Select.Option>
        <Select.Option value='1024px'>iPad Pro</Select.Option>
      </Select>
      <Button type="link" onClick={() => {
        showFunctions({
          code: content.functions,
          onChange: (variable) => {
            action.setFunctions(variable);
          }
        });
      }}>函数</Button>
      <Button type="link" onClick={() => {
        showVariable({
          code: content.variable,
          onChange: (variable) => {
            action.setVariable(variable);
          }
        });
      }}>变量</Button>
      <Switch checked={codeMode} onChange={setCodeMode} checkedChildren="代码模式" unCheckedChildren="可视化模式"/>
    </Space>
  </div>;
};
