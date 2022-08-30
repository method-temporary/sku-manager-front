export interface TestSheetModalViewModel {
  isOpen: boolean;
  testId: string;
}

export function getInitialTestSheetModalViewModel(): TestSheetModalViewModel {
  return {
    isOpen: false,
    testId: '',
  }
}