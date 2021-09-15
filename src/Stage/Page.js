import React from 'react';
import Render from '@kne/react-view-render';
import { useGlobal } from '../context';
import style from './style.module.scss';

const Page = () => {
  const { content, emitter } = useGlobal();
  return <div className={style['page']}>
    <Render content={content} emitter={emitter}/>
  </div>;
};

export default Page;