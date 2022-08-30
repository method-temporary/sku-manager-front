import { getInitQuestionSelectionConfig, QuestionSelectionConfig } from './QuestionSelectionConfig';
import { QuestionSelectionType } from './QuestionSelectionType';

export interface ExamPaperModel {
  id: string;
  patronKey: {
    keyString: string;
  };
  title: string;
  description: string;
  authorName: string;
  language: string;
  finalCopy: boolean;
  applyLimit: number;
  time: number;
  modifier: {
    keyString: string;
  };
  modifiedTime: number;
  successPoint: number;
  totalPoint: number;
  questionSelectionType: QuestionSelectionType;
  questionSelectionConfig: QuestionSelectionConfig;
}

export function getInitExamPaperModel() {
  //
  return {
    id: '',
    patronKey: {
      keyString: '',
    },
    title: '',
    description: '',
    authorName: '',
    language: '',
    finalCopy: false,
    applyLimit: 0,
    time: 0,
    modifier: {
      keyString: '',
    },
    modifiedTime: 0,
    successPoint: 0,
    totalPoint: 0,
    questionSelectionType: QuestionSelectionType.ALL,
    questionSelectionConfig: getInitQuestionSelectionConfig(),
  };
}
