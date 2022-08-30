import React from 'react';

export interface FormTableContextModel {
  colLength: number;
}

const LoginContext = React.createContext<FormTableContextModel>({
  colLength: 0,
});

export default LoginContext;
