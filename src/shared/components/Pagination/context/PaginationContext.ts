import React from 'react';

export interface PaginationContextModel {
  name: string;
  onChange: (activePage: number) => void;
}

const LoginContext = React.createContext<PaginationContextModel>({
  name: '',
  onChange: () => {},
});

export default LoginContext;
