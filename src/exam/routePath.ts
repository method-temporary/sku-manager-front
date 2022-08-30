import { getTestRoutePath } from "./store/TestRoutePathStore";

export interface TestRoutePath {
  path: string;
}

export function getTestListPath(): string {
  const testRoutePath = getTestRoutePath();
  if (testRoutePath === undefined) {
    return '';
  }
  return `${testRoutePath?.path}`;
}

export function getTestDetailPath(testId: string): string {
  const testRoutePath = getTestRoutePath();
  if (testRoutePath === undefined) {
    return '';
  }
  return `${testRoutePath.path}/${testId}/detail`;
}


export function getTestCreatePath(): string {
  const testRoutePath = getTestRoutePath();
  if (testRoutePath === undefined) {
    return '';
  }
  return `${testRoutePath.path}/create`;
}

export function getTestEditPath(testId: string): string {
  const testRoutePath = getTestRoutePath();
  if (testRoutePath === undefined) {
    return '';
  }
  return `${testRoutePath.path}/${testId}/edit`;
}
