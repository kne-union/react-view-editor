import React, { useMemo, useRef, useEffect } from 'react';
import { useGlobal } from '../context';
import { profileMap } from '@kne/react-view-render';
import profilePropertyRender from './profilePropertyRender';
import Form from '@kne/react-form-antd';
import get from 'lodash/get';


const Props = () => {
  const { active, componentList, action } = useGlobal();
  const formRef = useRef(null);
  const componentListRef = useRef(componentList);
  componentListRef.current = componentList;
  useEffect(() => {
    const initProps = get(componentListRef.current.find((item) => item.id === active.id), 'props', {});
    formRef.current.emitter.emit('form-data-reset');
    formRef.current.emitter.emit('form-data-set', {
      data: initProps,
      runValidate: false
    });
  }, [active.id]);
  const actionRef = useRef(action);
  actionRef.current = action;
  const activeIdRef = useRef(null);
  activeIdRef.current = active.id;
  const { property } = profileMap[active.component];

  const fields = useMemo(() => {
    return profilePropertyRender(property);
  }, [property]);

  useEffect(() => {
    const sub = formRef.current.emitter.addListener('form-field-data-change', () => {
      setTimeout(() => {
        const formData = formRef.current.data;
        activeIdRef.current && actionRef.current.setProps(activeIdRef.current, formData);
      });
    });
    return () => {
      sub.remove();
    };
  }, []);
  return (
    <Form ref={formRef} type="inner">
      {fields}
    </Form>
  );
};

export default Props;