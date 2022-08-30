import React from 'react';

export type ModalContextModel = {
  //
  close: () => void;
};

const ModalContext = React.createContext<ModalContextModel>({
  close: () => {},
});

export default ModalContext;
