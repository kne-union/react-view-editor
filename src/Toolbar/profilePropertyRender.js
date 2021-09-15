import React, { useRef } from 'react';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
  GroupList,
  Input,
  Avatar,
  InputNumber,
  RadioGroup,
  Select,
  Switch,
  useFormContext
} from '@kne/react-form-antd';
import get from 'lodash/get';
import { Button, Space } from 'antd';
import { useGlobal } from '../context';
import style from './style.module.scss';

const ArrayInput = ({ name, label, children }) => {
  const groupListRef = useRef(null);
  return (
    <Space direction="vertical">
      <Space>
        <div className={style['array-input-label']}>{label}</div>
        <Button className={style['array-input-btn']} type="text" onClick={() => {
          groupListRef.current.onAdd();
        }}><PlusCircleOutlined/></Button>
      </Space>
      <GroupList ref={groupListRef} name={name}>{(index, { onRemove }) => {
        return <Space align="start">
          {children}
          <Button className={style['array-input-btn']} type="text" onClick={() => {
            onRemove(index);
          }}><MinusCircleOutlined/></Button>
        </Space>;
      }}</GroupList>
    </Space>
  );
};

const ObjectInput = ({ label, children }) => {
  return <div>
    <div>{label}</div>
    <div>
      {children}
    </div>
  </div>;
};

const VariableSelect = (props) => {
  const { content } = useGlobal();
  return <Select {...props} options={Object.keys(get(content, 'variable', {})).map((value) => {
    return {
      label: value,
      value: value
    };
  })}/>;
};

const $FunctionsSelect = (props) => {
  const { content } = useGlobal();
  return <Select {...props} options={Object.keys(get(content, 'functions', {})).map((value) => {
    return {
      label: value,
      value: value
    };
  })}/>;
};

const fieldMap = {
  $input: Input,
  $switch: Switch,
  $select: Select,
  $radio: RadioGroup,
  $number: InputNumber,
  $array: ArrayInput,
  $object: ObjectInput,
  $avatar: Avatar,
  $variable: VariableSelect,
  $functions: $FunctionsSelect
};

const render = (property) => {
  return Object.keys(property).map((key) => {
    const props = property[key];
    const Field = fieldMap[props['input-type']];
    const others = Object.assign({}, get(props, 'input-options'));
    if (props['input-type'] === '$array') {
      others.children = render({ [key]: get(others, 'children', {}) });
    }
    if (props['input-type'] === '$object') {
      const output = {};
      Object.keys(others).forEach((skey) => {
        output[`${key}.${skey}`] = others[skey];
      });
      others.children = render(output);
    }
    if (props['input-type'] === '$multiple') {
      others.options = get(others, 'options', {}).map((item) => {
        return {
          children: render({
            [key]: Object.assign({}, item, {
              label: props.label,
              labelHidden: true
            })
          }),
          label: item.label
        };
      });
    }
    if (!Field) {
      return null;
    }
    return <Field key={key} name={key} label={props.label} {...others}/>;
  });
};

export default render;