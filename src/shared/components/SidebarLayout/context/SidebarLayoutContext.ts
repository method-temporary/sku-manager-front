import React from 'react';

export interface SidebarLayoutContextModel {
  activeItem: string;
  onClickItem: (url: string) => void;
}

const LoginContext = React.createContext<SidebarLayoutContextModel>({
  activeItem: '',
  onClickItem: () => {},
});

export default LoginContext;
