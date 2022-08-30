import { createStore } from './Store';
import Capability from '../model/Capability';

const [setCapability, onCapability, getCapability, useCapability] = createStore<
  Capability[]
>();

export { setCapability, onCapability, getCapability, useCapability };
