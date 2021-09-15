import { createContext, useContext } from 'react';

const context = createContext({});

export const { Provider, Consumer } = context;

export const useGlobal = () => {
  return useContext(context);
};

export default context;