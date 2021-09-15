import React, { useRef, useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import classnames from 'classnames';
import { useGlobal } from '../context';
import ResizeObserver from 'rc-resize-observer';

const CodeMode = ({ className }) => {
  const { content, action } = useGlobal();
  const [code, setCode] = useState(JSON.stringify(content, null, 2));
  const [size, setSize] = useState({ width: 400, height: 400 });
  const ref = useRef(null);

  const setContentRef = useRef(null);
  setContentRef.current = () => {
    action.setContent(JSON.parse(code));
  };

  useEffect(() => {
    setSize({
      width: ref.current.clientWidth,
      height: ref.current.clientHeight
    });
  }, []);

  useEffect(() => {
    return () => {
      setContentRef.current();
    };
  }, []);

  return <ResizeObserver onResize={() => {
    setSize({
      width: ref.current.clientWidth,
      height: ref.current.clientHeight
    });
  }}>
    <div className={classnames(className)} ref={ref}>
      <MonacoEditor
        width={size.width}
        height={size.height}
        language="javascript"
        value={code}
        onChange={(value) => {
          setCode(value);
        }}
      />
    </div>
  </ResizeObserver>;
};

export default CodeMode;