import React from 'react';
import TriggerContextModel from '../../model/TriggerContextModel';

const TriggerContext = React.createContext<TriggerContextModel>({
  //
  open: false,
  onOpen: () => {},
  onClose: () => {},
});

export default TriggerContext;
