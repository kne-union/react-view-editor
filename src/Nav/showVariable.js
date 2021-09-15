import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { withLayer } from '@kne/antd-enhance';
import { Modal, message } from 'antd';

const showVariable = withLayer(({ code, onChange, options, close, ...props }) => {
  const [value, setValue] = useState(JSON.stringify(code, null, 2));
  return <Modal {...props} title="变量定义" width={848} onOk={() => {
    try {
      onChange(JSON.parse(value));
      close();
    } catch (e) {
      message.error('JSON转换错误');
    }
  }}>
    <MonacoEditor
      width="800"
      height="400"
      language="json"
      value={value}
      options={options}
      onChange={setValue}
    />
  </Modal>;
});

export default showVariable;