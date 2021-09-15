import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ExpandOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useGlobal } from '../context';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import Page from './Page';
import ActiveObject from './ActiveObject';
import style from './style.module.scss';

const getNodeOffset = (el) => {
  let x = 0, y = 0;
  do {
    x += el.offsetLeft;
    y += el.offsetTop;
  }
  while (el = el.offsetParent);

  return { 'left': x, 'top': y };
};

const Background = ({ scale, width: originWidth, height: originHeight }) => {
  const canvasRef = useRef(null);
  const { width, height } = useMemo(() => {
    return {
      width: originWidth * 100 / scale,
      height: originHeight * 100 / scale
    };
  }, [originWidth, originHeight, scale]);
  useEffect(() => {
    const w = width * 2, h = height * 2;
    const canvas = canvasRef.current,
      context = canvas.getContext('2d');
    context.clearRect(0, 0, w, h);
    (() => {
      context.fillStyle = '#ececec';
      let x = 0;
      while (x <= w) {
        let y = 0;
        while (y <= h) {
          if ((x % 40 === 0 && y % 40 === 0) || (x % 40 !== 0 && y % 40 !== 0)) {
            context.fillRect(x, y, 20, 20);
          }
          y += 20;
        }
        x += 20;
      }
    })();
  }, [width, height]);
  return <canvas className={classnames(style.axis, style.background)} ref={canvasRef} width={width * 2}
                 height={height * 2}
                 style={{ width, height }}/>;
};

const Axis = ({ scale, width: originWidth, height: originHeight }) => {
  const canvasRef = useRef(null);
  const { width, height } = useMemo(() => {
    return {
      width: originWidth * 100 / scale,
      height: originHeight * 100 / scale
    };
  }, [originWidth, originHeight, scale]);
  useEffect(() => {
    const w = width * 2, h = height * 2;
    const canvas = canvasRef.current,
      context = canvas.getContext('2d');
    context.clearRect(0, 0, w, h);
    (() => {
      context.lineWidth = 1;
      context.strokeStyle = '#314659';
      context.fillStyle = '#314659';
      context.font = '24px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.beginPath();
      let x = 0, y = 0;
      while (x <= w) {
        x += 10;
        context.moveTo(x, 0);
        context.lineTo(x, x % 200 === 0 ? 10 * 2 : 10);
        if (x % 200 === 0) {
          context.fillText(x / 2, x, 40);
        }
      }
      while (y <= h) {
        y += 10;
        context.moveTo(0, y);
        context.lineTo(y % 200 === 0 ? 10 * 2 : 10, y);
        if (y % 200 === 0) {
          context.fillText(y / 2, 45, y);
        }
      }
      context.stroke();
    })();
  }, [width, height]);
  return <canvas className={style.axis} ref={canvasRef} width={width * 2} height={height * 2}
                 style={{ width, height }}/>;
};

const Guideline = ({ scale, width: originWidth, height: originHeight }) => {
  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  const [lines, setLines] = useState([]);
  const canvasRef = useRef(null);
  const { width, height } = useMemo(() => {
    return {
      width: originWidth * 100 / scale,
      height: originHeight * 100 / scale
    };
  }, [originWidth, originHeight, scale]);
  useEffect(() => {
    let startX = false, startY = false;
    const { left, top } = getNodeOffset(canvasRef.current);
    const handlerMouseDown = (e) => {
      const x = e.clientX - left + document.documentElement.scrollLeft,
        y = e.clientY - top + document.documentElement.scrollTop;
      if (y < 10) {
        startX = true;
        setLines((lines) => {
          const newLines = lines.filter(({ active }) => !active).slice(0);
          newLines.push({
            position: y * 100 / scaleRef.current,
            direction: 'horizontal',
            active: true
          });
          return newLines;
        });
        return;
      }
      if (x < 10) {
        startY = true;
        setLines((lines) => {
          const newLines = lines.filter(({ active }) => !active).slice(0);
          newLines.push({
            position: x * 100 / scaleRef.current,
            direction: 'vertical',
            active: true
          });
          return newLines;
        });
        return;
      }

      setLines((lines) => {
        const active = lines.find((line) => {
          return line.direction === 'horizontal' && Math.abs(y * 100 / scaleRef.current - line.position) < 2 || line.direction === 'vertical' && Math.abs(x * 100 / scaleRef.current - line.position) < 2;
        });
        if (active) {
          const newLines = lines.slice(0);
          if (active.direction === 'horizontal') {
            startX = true;
          }
          if (active.direction === 'vertical') {
            startY = true;
          }
          const index = lines.indexOf(active);
          newLines[index] = Object.assign({}, active, { active: true });
          return newLines;
        }
        return lines;
      });
    };

    const handlerMouseMove = (e) => {
      const x = e.clientX - left + document.documentElement.scrollLeft,
        y = e.clientY - top + document.documentElement.scrollTop;
      if (startX) {
        setLines((lines) => {
          const newLines = lines.slice(0);
          const activeLine = lines.find(({ active, direction }) => active && direction === 'horizontal');
          if (activeLine) {
            const index = newLines.indexOf(activeLine);
            newLines[index] = Object.assign({}, activeLine, { position: y * 100 / scaleRef.current });
          }
          return newLines;
        });
        return;
      }
      if (startY) {
        setLines((lines) => {
          const newLines = lines.slice(0);
          const activeLine = lines.find(({ active, direction }) => active && direction === 'vertical');
          if (activeLine) {
            const index = newLines.indexOf(activeLine);
            newLines[index] = Object.assign({}, activeLine, { position: x * 100 / scaleRef.current });
          }
          return newLines;
        });
      }
    };

    const handlerMouseUp = (e) => {
      startX = false;
      startY = false;
      setLines((lines) => {
        const newLines = lines.filter(({ position }) => position > 10).map((item) => {
          return Object.assign({}, item, { active: false });
        });
        return newLines;
      });
    };
    document.body.addEventListener('mousedown', handlerMouseDown, true);
    document.body.addEventListener('mousemove', handlerMouseMove, true);
    document.body.addEventListener('mouseup', handlerMouseUp, true);
    document.body.addEventListener('mouseleave', handlerMouseUp, false);
    return () => {
      document.body.removeEventListener('mousedown', handlerMouseDown, true);
      document.body.removeEventListener('mousemove', handlerMouseMove, true);
      document.body.removeEventListener('mouseup', handlerMouseUp, true);
      document.body.addEventListener('mouseleave', handlerMouseUp, false);
    };
  }, []);
  useEffect(() => {
    const w = width * 2, h = height * 2;
    const canvas = canvasRef.current,
      context = canvas.getContext('2d');
    context.clearRect(0, 0, w, h);
    context.lineWidth = 1;
    context.strokeStyle = 'cyan';
    context.beginPath();
    lines.forEach((line) => {
      if (line.direction === 'horizontal') {
        context.moveTo(0, line.position * 2);
        context.lineTo(w, line.position * 2);
      }
      if (line.direction === 'vertical') {
        context.moveTo(line.position * 2, 0);
        context.lineTo(line.position * 2, h);
      }
    });
    context.stroke();
  }, [width, height, lines]);
  return <canvas className={style.axis} ref={canvasRef} width={width * 2} height={height * 2}
                 style={{ width, height }}/>;
};

const Scaler = () => {
  const { setStageScale: setScale, stageScale: scale } = useGlobal();
  return <div className={style['scaler']}>
    <div className={style.btn} onClick={() => {
      setScale((scale) => {
        return scale - 10;
      });
    }}><MinusOutlined/>
    </div>
    <div className={style['scale-value']}>{scale}%</div>
    <div className={style.btn} onClick={() => {
      setScale((scale) => {
        return scale + 10;
      });
    }}><PlusOutlined/>
    </div>
    <div className={style.btn} onClick={() => {
      setScale(() => {
        return 100;
      });
    }}><ExpandOutlined/>
    </div>
  </div>;
};

const Stage = ({ className }) => {
  const { stageScale: scale, stageSize } = useGlobal();
  const [size, setSize] = useState({ width: 500, height: 500 });
  const [pagePosition, setPagePosition] = useState(0);
  useEffect(() => {
    const left = (size.width - pageRef.current.clientWidth) / 2;
    setPagePosition(left);
  }, [size, stageSize]);
  const containerRef = useRef(null);
  const pageRef = useRef(null);
  useEffect(() => {
    const resize = () => {
      setSize({
        width: containerRef.current.scrollWidth,
        height: containerRef.current.scrollHeight
      });
    };
    resize();
    const resizeHandler = debounce(resize, 300);
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);
  return <div ref={containerRef} className={classnames(style.stage, className)}>
    <div style={{ width: size.width, height: size.height, overflow: 'hidden' }}>
      <div className={style.content} style={{ transform: `scale(${scale / 100})` }}>
        <Background width={size.width} scale={scale} height={size.height}/>
      </div>
      <div className={style.content} style={{ transform: `scale(${scale / 100})`, transformOrigin: '50% 50%' }}>
        <div ref={pageRef} className={style['page-position']} style={{
          width: stageSize,
          top: 0,
          left: pagePosition
        }}>
          <ActiveObject>
            <Page/>
          </ActiveObject>
        </div>
      </div>
      <div className={style.content} style={{ transform: `scale(${scale / 100})` }}>
        <Axis width={size.width} scale={scale} height={size.height}/>
        <Guideline width={size.width} scale={scale} height={size.height}/>
      </div>
    </div>
    <Scaler/>
  </div>;
};

export default Stage;