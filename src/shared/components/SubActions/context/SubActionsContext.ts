import React from 'react';

export interface SubActionsContextModel {
  form: boolean;
}

const LoginContext = React.createContext<SubActionsContextModel>({
  form: false,
});

export default LoginContext;
