import { createStore } from 'shared/store';

export const [setCheckedCinerooms, onCheckedCinerooms, getCheckedCinerooms, useCheckedCinerooms] = createStore<
  string[]
>([]);
