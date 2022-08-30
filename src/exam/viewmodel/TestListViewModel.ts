import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';

export interface TestListViewModel {
  totalCount: number;
  testList: TestListItem[];
}
export interface TestListItem {
  id: string;
  title: string;
  language: string;
  questionSelectionTypeText: QuestionSelectionTypeText;
  isFinalVersion: boolean;
  creatorName: string;
  createDate: string;
  patronKey: {
    keyString: string;
  };
  cineroomIds?: string[];
}

export function getInitialTestListViewModel(): TestListViewModel {
  return {
    totalCount: 0,
    testList: [],
  };
}
