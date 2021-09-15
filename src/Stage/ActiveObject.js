import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import DragItem, { useDrag } from '../common/DragItem';
import { useGlobal } from '../context';
import classnames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import { Space } from 'antd';
import { DeleteOutlined, EnterOutlined } from '@ant-design/icons';
import isNull from 'lodash/isNull';
import style from './style.module.scss';

const findTarget = (dom, target) => {
  if (dom === document.body || isNull(dom)) {
    return false;
  }
  if (dom === target) {
    return true;
  }
  return findTarget(dom.parentElement, target);
};

const ActiveObject = ({ children }) => {
  const { emitter, active, action } = useGlobal();
  const outerRef = useRef(null);
  const outerLocalRef = useRef({ x: 0, y: 0 });
  const activeDomRef = useRef(null);
  const activeClickHandler = (e) => {
    if (findTarget(e.target, activeDomRef.current)) {
      return;
    }

    const rect = outerRef.current.getBoundingClientRect();
    outerLocalRef.current = {
      x: rect.left + document.documentElement.scrollLeft,
      y: rect.top + document.documentElement.scrollTop
    };
    action.setActive({
      x: e.clientX, y: e.clientY
    });
  };
  const [optionsName, setOptionsName] = useState([]);
  useEffect(() => {
    if (!!active) {
      outerLocalRef.current;
      const rect = outerRef.current.getBoundingClientRect();
      const { width, top, height } = activeDomRef.current.getBoundingClientRect();
      const optionsLeft = active.local.left + active.local.width - width,
        optionsTop = active.local.top + active.local.height;
      const optionsName = [];
      if (optionsLeft < 0) {
        optionsName.push('left');
      }
      if (optionsTop + height + rect.top > rect.height) {
        optionsName.push('top');
      }
      setOptionsName(optionsName.map((name) => style[name]));
    }
  }, [active]);

  const { startDrag, local, onDragStart } = useDrag({
    onDrag: (local) => {
      if (!active) {
        return;
      }
      action.placed({ componentId: active.id, local });
    }
  });

  useEffect(() => {
    const sub = emitter.addListener('drag-down', ({ local, data }) => {
      if (!local) {
        return;
      }
      action.append({ componentName: data.id, local });
    });
    return () => {
      sub.remove();
    };
  }, [emitter, action.append]);

  useEffect(() => {
    const sub = emitter.addListener('component-appended', () => {
      action.relocation();
      action.removeActive();
    });
    const sub2 = emitter.addListener('component-removed', () => {
      action.relocation();
      action.removeActive();
    });
    const sub3 = emitter.addListener('relocation', () => {
      action.relocation();
    });
    return () => {
      sub.remove();
      sub2.remove();
      sub3.remove();
    };
  }, [emitter]);

  return <ResizeObserver onResize={() => {
    action.relocation();
  }}>
    <div className={style['active-outer']} ref={outerRef} onClick={activeClickHandler}>
      {children}
      {active ? <div className={style['active']} style={{
        top: active.local.top - outerLocalRef.current.y,
        left: active.local.left - outerLocalRef.current.x,
        width: active.local.width,
        height: active.local.height
      }} onMouseDown={(e) => {
        if (findTarget(e.target, activeDomRef.current)) {
          return;
        }
        onDragStart(e);
      }}>
        {startDrag && local ?
          <DragItem top={local.y} left={local.x}/> : null}
        <div className={classnames(style['options'], ...optionsName)} ref={activeDomRef}>
          <Space size={4}>
            <div className={style['options-id']}>{active.id}</div>
            <EnterOutlined className={style['options-btn']} onClick={action.selectParent}/>
            <DeleteOutlined className={style['options-btn']} onClick={action.remove}/>
          </Space>
        </div>
      </div> : null}
    </div>
  </ResizeObserver>;
};

export default ActiveObject;