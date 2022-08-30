import { createStore } from './Store';
import Discussion from '../model/Discussion';

const [setDiscussion, onDiscussion, getDiscussion, useDiscussion] = createStore<
  Discussion
>();

export { setDiscussion, onDiscussion, getDiscussion, useDiscussion };
