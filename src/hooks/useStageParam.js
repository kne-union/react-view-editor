import { useState } from 'react';

const useStateParam = () => {
  const [scale, setScale] = useState(100);
  const [size, setSize] = useState('100%');
  const [codeMode, setCodeMode] = useState(false);
  return {
    stageScale: scale, stageSize: size, setStageSize: setSize, setStageScale: (callback) => {
      return setScale((scale) => {
        const value = callback(scale);
        if (value < 20) {
          return 20;
        }
        if (value > 200) {
          return 200;
        }
        return value;
      });
    }, codeMode, setCodeMode
  };
};

export default useStateParam;