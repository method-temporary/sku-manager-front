import { getInitialQuestionGroup, QuestionGroup } from './TestCreateFormViewModel';
import { Question } from './TestSheetViewModel';

export interface TestQuestionGroupModalViewModel {
  groupName: string; // 추가할 Group 명

  selectedGroupName: string; // 선택된 그룹 이름
  selectedQuestions: number[]; // 선택된 문항의 Sequence 목록
  selectedQuestionsInGroup: number[];

  questions: ModalQuestion[]; // 문항 목록
  groups: ModalGroup[]; // 그룹 목록
}

export interface ModalQuestion extends Question {
  isOpen: boolean;
}

export interface ModalGroup extends QuestionGroup {
  isOpen: boolean;
  updatable: boolean;
  updateName: string;
  questions: ModalQuestion[];
}

export const getInitialTestQuestionGroupModalViewModel = (): TestQuestionGroupModalViewModel => {
  return {
    groupName: '',
    selectedGroupName: '',
    selectedQuestions: [],
    selectedQuestionsInGroup: [],
    questions: [],
    groups: [],
  };
};

export const getInitialModalGroup = (): ModalGroup => {
  const group = getInitialQuestionGroup();

  return {
    ...group,
    isOpen: false,
    updatable: false,
    updateName: '',
    questions: [],
  };
};

export const getModalQuestionByQuestion = (question: Question): ModalQuestion => {
  return {
    ...question,
    isOpen: false,
  };
};

export const getModalGroupByQuestionGroup = (group: QuestionGroup, questions: ModalQuestion[]): ModalGroup => {
  const groupQuestions = questions.filter((question) => question.groupName === group.name && question);

  return {
    ...group,
    isOpen: false,
    updatable: false,
    updateName: '',
    questions: groupQuestions,
  };
};

export const createModalGroup = (name: string): ModalGroup => {
  return {
    name,
    isOpen: false,
    updatable: false,
    updateName: '',
    totalQuestionCount: 0,
    mandatoryCount: 0,
    questionCount: '0',
    pointPerGroup: '0',
    questions: [],
  };
};
