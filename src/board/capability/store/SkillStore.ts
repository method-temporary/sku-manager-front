import { createStore } from './Store';
import Skill from '../model/Skill';

const [setCapability, onCapability, getCapability, useCapability] = createStore<
  Skill[]
>();

export { setCapability, onCapability, getCapability, useCapability };
