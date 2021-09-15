import React, { useState, useRef, useMemo } from 'react';
import get from 'lodash/get';
import { profileMap } from '@kne/react-view-render';
import uniqueId from 'lodash/uniqueId';
import { message, Modal } from 'antd';
import findIndex from 'lodash/findIndex';
import isPlainObject from 'lodash/isPlainObject';
import Ajv from 'ajv';


const ajv = new Ajv();

const computedActiveComponent = ({ list, state, local }) => {
  const { x, y } = local;
  const clickLeft = x + document.documentElement.scrollLeft,
    clickTop = y + document.documentElement.scrollTop;
  return list.find(({ id }) => {
    if (!state[id]) {
      return false;
    }
    const local = state[id].local;
    return clickLeft > local.x && clickLeft < local.x + local.w && clickTop > local.y && clickTop < local.y + local.h;
  });
};

const computedComponentAddress = ({ list, state, componentName, local }) => {
  // 先寻找最小父级
  const parent = (() => {
    const localParent = computedActiveComponent({ list, state, local });

    const findParent = (parentId) => {
      if (!parentId) {
        return null;
      }
      const parent = list.find(({ id }) => id === parentId);
      if (!parent) {
        return null;
      }
      const allow = get(profileMap[parent.component], 'children.allow');

      if (allow && allow.indexOf(componentName) === -1) {
        return findParent(parent.parentId);
      }
      return parent;
    };

    const parent = findParent(get(localParent, 'id', null));
    if (!parent) {
      return null;
    }
    return parent;
  })();

  // 查找所有子节点,计算index
  const index = (() => {
    const children = list.filter(({ parentId }) => parentId === get(parent, 'id', null));
    if (children.length === 0) {
      return list.length;
    }
    const computedDistance = (x, y) => {
      return Math.sqrt(x * x + y * y);
    };
    const item = children.find(({ id }) => {
      if (!state[id]) {
        return false;
      }
      const childLocal = state[id].local;
      return computedDistance(childLocal.x, childLocal.y) - computedDistance(local.x, local.y) > 0;
    });
    if (item) {
      return children.indexOf(item) + list.indexOf(children[0]);
    }
    return list.length;
  })();

  return { parent, index };
};

const verifyComponent = ({ componentData, list }) => {
  const dependence = get(profileMap[componentData.component], 'children.dependence');
  const forbid = get(profileMap[componentData.component], 'children.forbid');

  const findTree = (id, dependence) => {
    if (!id) {
      return false;
    }
    const item = [componentData, ...list].find((item) => {
      return id === item.id;
    });
    if (!item) {
      return false;
    }

    const parent = list.find((node) => {
      return item.parentId === node.id && dependence.indexOf(node.component) > -1;
    });

    if (parent) {
      return true;
    }
    return findTree(item.parentId, dependence);
  };

  return dependence && dependence.length > 0 && findTree(componentData.id, dependence) === false || forbid && forbid.length > 0 && findTree(componentData.id, forbid);
};

const decorateComponent = ({ componentData, local, list, state }) => {
  componentData = Object.assign({}, componentData);
  const { parent, index } = computedComponentAddress({ list, state, componentName: componentData.component, local });

  if (parent) {
    componentData.parentId = parent.id;
    componentData.depth = parent.depth + 1;
  } else {
    componentData.parentId = null;
    componentData.depth = 0;
  }

  return { componentData, index };
};

const generateTreeData = ({ list }) => {
  const newData = list.slice(0);
  const makeTree = (nodes, output = []) => {
    nodes.forEach((node) => {
      const { depth, parentId, ...item } = node;
      const children = newData.filter(({ parentId }) => parentId === node['id']).sort((a, b) => a.index - b.index);
      if (children && children.length > 0) {
        item.children = makeTree(children);
      }
      output.push(item);
    });
    return output;
  };
  const roots = newData.filter(({ parentId }) => !(parentId && newData.find(({ id }) => id === parentId)));
  return makeTree(roots);
};

const parseTreeData = (treeData) => {
  const output = [];
  const core = (list, parentId, depth = 0) => {
    list.forEach((node) => {
      output.push({
        component: node.component,
        depth,
        id: node.id,
        parentId: parentId,
        props: Object.assign({}, node.props, typeof node.children === 'string' ? { children: node.children } : {})
      });
      if (Array.isArray(node.children)) {
        core(node.children, node.id, depth + 1);
      }
    });
  };
  core(treeData);
  return generateListData({list:output});
};

const generateListData = ({ list }) => {
  return list.sort((a, b) => {
    return b.depth - a.depth;
  });
};

const computedState = ({ list }) => {
  const output = {};
  list.forEach(({ id }) => {
    const targetDom = document.querySelector(`.id_${id}`);
    if (!targetDom) {
      return;
    }
    const rect = targetDom.getBoundingClientRect();
    window.getComputedStyle(targetDom).zIndex;
    const local = {
      x: rect.left + document.documentElement.scrollLeft,
      y: rect.top + document.documentElement.scrollTop,
      w: rect.width,
      h: rect.height
    };
    output[id] = {
      id,
      local
    };
  });
  return output;
};


const useComponentState = () => {
  const [componentList, setComponentList] = useState([]);
  const [componentState, setComponentState] = useState({});
  const [functions, setFunctions] = useState({});
  const [variable, setVariable] = useState({});
  const [active, setActive] = useState(null);

  const componentListRef = useRef(componentList);
  const componentStateRef = useRef(componentState);
  componentListRef.current = componentList;
  componentStateRef.current = componentState;

  const treeData = useMemo(() => {
    return generateTreeData({ list: componentList });
  }, [componentList]);

  const append = ({ componentName, local }) => {
    const { componentData, index } = decorateComponent({
      componentData: {
        id: uniqueId(`${componentName}-`),
        component: componentName,
        props: get(profileMap, `${componentName}.defaultProps`, {}),
        parentId: null,
        depth: 0
      }, local,
      list: componentListRef.current, state: componentStateRef.current
    });

    if (verifyComponent({ componentData, list: componentListRef.current })) {
      message.warning('组件不能放置在该位置');
      return;
    }
    setComponentList((list) => {
      const newData = list.slice(0);
      newData.splice(index, 0, componentData);
      return generateListData({ list: newData });
    });
    setActive(null);
  };
  const placed = ({ componentId, local }) => {
    const prevComponent = componentListRef.current.find((item) => item.id === componentId);
    if (!prevComponent) {
      return;
    }
    const { componentData, index } = decorateComponent({
      componentData: prevComponent, local,
      list: componentListRef.current, state: componentStateRef.current
    });

    //检查被移动的组件不能是目标组件的父级
    const parentIsAllowed = (id, parentId) => {
      if (!parentId) {
        return true;
      }
      if (id === parentId) {
        return false;
      }
      const parent = componentListRef.current.find((item) => item.id === parentId);
      if (!parent) {
        return false;
      }
      if (parent.parentId === id) {
        return false;
      }

      return parentIsAllowed(id, parent.parentId);
    };

    if (!parentIsAllowed(componentData.id, componentData.parentId)) {
      return;
    }

    if (verifyComponent({ componentData, list: componentListRef.current })) {
      message.warning('组件不能放置在该位置');
      return;
    }
    setComponentList((list) => {
      const prevIndex = findIndex(list, (item) => item.id === componentId);
      const newList = list.slice(0);
      newList.splice(prevIndex, 1);
      newList.splice(index, 0, componentData);
      return generateListData({ list: newList });
    });
    setActive(null);
    relocation();
  };
  const remove = () => {
    Modal.confirm({
      content: '确定要删除该组件件及其子组件吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setComponentList((list) => {
          const findTreeListChildrenIndex = (id) => {
            const output = [];
            output.push(id);
            list.filter((item) => item.parentId === id).forEach(({ id }) => {
              output.push(...findTreeListChildrenIndex(id));
            });
            return output;
          };
          const newList = list.slice(0);
          findTreeListChildrenIndex(active).forEach((id) => {
            const index = findIndex(newList, (item) => item.id === id);
            newList.splice(index, 1);
          });

          return generateListData({ list: newList });
        });
        setActive(null);
      }
    });
  };
  const relocation = () => {
    setComponentState(computedState({ list: componentListRef.current }));
  };
  const removeActive = () => {
    setActive(null);
  };
  const setActiveComponent = (local) => {
    const activeComponent = computedActiveComponent({
      list: componentListRef.current,
      state: componentStateRef.current,
      local
    });

    if (!activeComponent) {
      setActive(null);
      return;
    }
    setActive(activeComponent.id);
  };
  const selectParent = () => {
    if (!active) {
      return;
    }
    const prevComponent = componentListRef.current.find(({ id }) => id === active);
    if (!prevComponent) {
      setActive(null);
      return;
    }
    const parentComponent = componentListRef.current.find(({ id }) => id === prevComponent.parentId);
    if (!parentComponent) {
      setActive(null);
      return;
    }
    setActive(parentComponent.id);
  };
  const setContent = (content) => {
    const { variable, functions, data } = Object.assign({}, content);
    setVariable(variable);
    setFunctions(functions);
    const list = parseTreeData(data);
    setComponentList(list);
    componentListRef.current = list;
    relocation();
  };
  const computedActive = useMemo(() => {
    if (!active) {
      return null;
    }
    const activeComponent = componentList.find(({ id }) => id === active);
    if (!activeComponent) {
      return null;
    }
    const state = componentState[activeComponent.id];

    if (!state) {
      return null;
    }

    return {
      local: {
        top: state.local.y,
        left: state.local.x,
        width: state.local.w,
        height: state.local.h
      },
      id: activeComponent.id,
      component: activeComponent.component
    };
  }, [active, componentList, componentState]);

  const setProps = (id, props = {}) => {
    const componentData = componentList.find((item) => item.id === id);
    if (!componentData) {
      return;
    }
    const { property: configProps } = profileMap[componentData.component];
    const output = {};
    Object.keys(configProps).forEach((key) => {
      let value = props[key];
      const jsonschema = get(configProps, `[${key}].jsonschema`);
      if (jsonschema) {
        const validate = ajv.compile(jsonschema);
        if (!validate(value)) {
          return;
        }
      }
      output[key] = value;
    });
    setComponentList((list) => {
      const componentData = list.find((item) => item.id === id);
      const index = list.indexOf(componentData);
      const newList = list.slice(0);
      const newProps = Object.assign({}, componentData.props, output);
      Object.keys(newProps).filter((key) => newProps[key] === '' || newProps[key] === void (0)).forEach((key) => {
        delete newProps[key];
      });
      newList.splice(index, 1, Object.assign({}, componentData, { props: newProps }));
      return newList;
    });
    relocation();
  };
  return {
    active: computedActive,
    componentList,
    content: useMemo(() => {
      return {
        variable,
        functions,
        data: treeData
      };
    }, [variable, functions, treeData]),
    action: {
      append,
      placed,
      remove,
      relocation,
      setActive: setActiveComponent,
      setProps,
      removeActive,
      selectParent,
      setVariable,
      setFunctions,
      setContent
    }
  };
};

export default useComponentState;