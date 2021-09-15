import React, { useState, useRef, useEffect } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import ComponentList from './ComponentList';
import style from './style.module.scss';

const MenuList = () => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const outerDom = useRef(null);

  useEffect(() => {
    const handlerMouseOver = () => {
      clearTimeout(timerRef.current);
      setVisible(true);
    };
    const handlerOut = () => {
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 300);
    };

    outerDom.current.addEventListener('mouseover', handlerMouseOver);
    outerDom.current.addEventListener('mouseout', handlerOut);
    return () => {
      outerDom.current && outerDom.current.removeEventListener('mouseover', handlerMouseOver);
      outerDom.current && outerDom.current.removeEventListener('mouseout', handlerOut);
    };
  }, []);

  return <div className={style['menu-list']} ref={outerDom}>
    <div className={classnames(style['menu'], {
      [style['active']]: visible
    })}>
      <ComponentList/>
    </div>
    <div className={style['list-inner']}>
      <div className={style['add']}>
        <PlusCircleOutlined className={style['anticon']}/> 添加内容
      </div>
    </div>
  </div>;
};

export default MenuList;