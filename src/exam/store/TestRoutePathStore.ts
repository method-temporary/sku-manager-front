import { TestRoutePath } from 'exam/routePath';
import { createStore } from 'shared/store';

export const [setTestRoutePath, onTestRoutePath, getTestRoutePath, useTestRoutePath] = createStore<TestRoutePath>();
