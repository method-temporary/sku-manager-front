import { createStore } from './Store';
import CapabilityCdo from '../model/CapabilityCdo';

const [
  setCapabilityCdo,
  onCapabilityCdo,
  getCapabilityCdo,
  useCapabilityCdo,
] = createStore<CapabilityCdo>();

export {
  setCapabilityCdo,
  onCapabilityCdo,
  getCapabilityCdo,
  useCapabilityCdo,
};
