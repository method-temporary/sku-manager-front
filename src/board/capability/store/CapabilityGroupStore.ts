import { createStore } from './Store';
import CapabilityGroup from '../model/CapabilityGroup';

const [
  setCapabilityGroup,
  onCapabilityGroup,
  getCapabilityGroup,
  useCapabilityGroup,
] = createStore<CapabilityGroup[]>();

export {
  setCapabilityGroup,
  onCapabilityGroup,
  getCapabilityGroup,
  useCapabilityGroup,
};
