import { QuestionGroup } from './QuestionGroup';

export interface QuestionSelectionConfig {
  enableShuffle: boolean;
  questionGroups: QuestionGroup[];
  pointPerQuestion: number;
  questionCount: number;
}

export function getInitQuestionSelectionConfig() {
  //
  return {
    enableShuffle: false,
    questionGroups: [],
    pointPerQuestion: 0,
    questionCount: 0,
  };
}
