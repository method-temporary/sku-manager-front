import * as TriggerTypes from './types';
import TriggerContainer from './logic/TriggerContainer';
import TriggerContext from './sub/TriggerContext/TriggerContext';

type TriggerComponent = typeof TriggerContainer & {
  //
  Context: typeof TriggerContext;
};

const Trigger = TriggerContainer as TriggerComponent;

Trigger.Context = TriggerContext;

export default Trigger;
export { TriggerTypes };
