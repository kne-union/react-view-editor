import './preset';
import React from 'react';
import { Provider } from './context';
import Stage from './Stage';
import CodeMode from './CodeMode';
import useStageParam from './hooks/useStageParam';
import useComponentState from './hooks/useComponentState';
import Nav from './Nav';
import MenuList from './MenuList';
import Toolbar from './Toolbar';
import { Col, Row } from 'antd';
import useEvent from './hooks/useEvent';
import style from './style.module.scss';
import 'antd/dist/antd.css';

const ViewEditor = () => {
  const { setStageScale, stageScale, stageSize, setStageSize, codeMode, setCodeMode } = useStageParam();
  const { active, content, componentList, action } = useComponentState();
  const emitter = useEvent();
  return (
    <Provider value={{
      componentList,
      content,
      emitter,
      active,
      action,
      stageScale,
      setStageScale,
      codeMode,
      setCodeMode,
      stageSize,
      setStageSize
    }}>
      <Row wrap={false} className={style.body}>
        <Col flex="auto" className={style.column}>
          <Nav/>
          <Row wrap={false} className={style.main}>
            {codeMode ? null : <Col flex="40px" className={style.menu}><MenuList/></Col>}
            <Col flex="auto">
              {codeMode ? <CodeMode className={style.stage}/> : <Stage className={style.stage}/>}
            </Col>
          </Row>
        </Col>
        {codeMode ? null : <Col flex="280px">
          <Toolbar/>
        </Col>}
      </Row>
    </Provider>
  );
};

export default ViewEditor;