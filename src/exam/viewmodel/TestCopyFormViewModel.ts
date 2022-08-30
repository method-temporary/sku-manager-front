export interface TestCopyFormViewModel {
  isOpen: boolean;
  id: string;
  newTitle: string;
  title: string;
  creatorName: string;
  cineroomIds: string[];
}

export function getInitialTestCopyFromViewModel(): TestCopyFormViewModel {
  return {
    isOpen: false,
    id: '',
    newTitle: '',
    title: '',
    creatorName: '',
    cineroomIds: [],
  };
}
