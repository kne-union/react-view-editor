import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import get from 'lodash/get';
import style from './style.module.scss';

export const useDrag = ({ onDrag }) => {
  const [startDrag, setStartDrag] = useState(false);
  const [local, setLocal] = useState(null);
  const localRef = useRef(local);
  const startLocalRef = useRef(null);
  localRef.current = local;
  const startDragRef = useRef(startDrag);
  startDragRef.current = startDrag;
  const onDragRef = useRef(onDrag);
  onDragRef.current = onDrag;
  useEffect(() => {
    const mouseUpHandler = () => {
      if (!startDragRef.current) {
        return;
      }

      const getDistance = (a, b) => {
        return Math.abs(get(a, 'y', 0) - get(b, 'y', 0)) + Math.abs(get(a, 'x', 0) - get(b, 'x', 0));
      };

      if (getDistance(localRef.current, startLocalRef.current) < 10) {
        setStartDrag(false);
        return;
      }

      if (localRef.current) {
        onDragRef.current && onDragRef.current(localRef.current);
      }
      setStartDrag(false);
      setLocal(null);
    };

    const mouseMoveHandler = (e) => {
      if (!startDragRef.current) {
        return;
      }
      setLocal({
        x: e.clientX + document.documentElement.scrollLeft,
        y: e.clientY + document.documentElement.scrollTop
      });
    };

    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    return () => {
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);
  return {
    local,
    startDrag,
    onDragStart: (e) => {
      startLocalRef.current = {
        x: e.clientX + document.documentElement.scrollLeft,
        y: e.clientY + document.documentElement.scrollTop
      };
      setStartDrag(true);
    }
  };
};

const DragItem = ({ top, left }) => {
  return createPortal(<div className={style['active-mirror']}
                           style={{ top, left }}>
    <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20"
         height="20" style={{ background: '#FFF' }}>
      <path
        d="M940.8 242.688L530.56 4.8c-11.2-6.4-25.6-6.4-36.736 0L83.584 242.688c-11.2 6.4-19.2 19.136-19.2 31.872V748.8c0 12.8 6.4 25.536 19.2 31.936l410.24 236.288c11.2 6.4 25.6 6.4 36.736 0L940.8 780.736c11.2-6.4 19.2-19.2 19.2-32V274.56c0-14.336-8-25.536-19.2-31.872z m-44.672 490.048L513.024 953.088 129.856 732.736V288.96L513.024 68.672 896.128 290.56V732.8z"
        fill="#1890FF"/>
      <path
        d="M279.936 340.032a30.976 30.976 0 0 0-43.136 11.2c-7.936 14.336-3.2 35.136 11.2 43.072l233.088 135.68v268.224a32 32 0 0 0 31.936 31.936 32 32 0 0 0 31.872-31.936v-269.76l233.088-134.144c16-9.6 20.8-28.736 11.2-43.072-9.6-16-28.736-20.8-43.136-11.2l-233.024 134.08-233.088-134.08z"
        fill="#1890FF"/>
    </svg>
  </div>, document.body);
};

export default DragItem;