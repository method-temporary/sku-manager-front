import { Question } from './TestSheetViewModel';
import { QuestionSelectionType } from '../model/QuestionSelectionType';
import { patronInfo } from '@nara.platform/dock';
import { QuestionType } from '../model/QuestionType';
import { ModalGroup, ModalQuestion } from './TestQuestionGroupModalViewModel';

export interface TestCreateFormViewModel {
  id: string; // id;
  finalCopy: boolean; // 최종본 여부
  title: string; // 제목
  description: string; // 설명
  applyLimit: string; // 1일 응시 횟수
  authorName: string; // 생성자 이름
  email: string; // 생성자 Email
  language: string; // 언어
  newQuestions: Question[]; // 문항 목록

  questionSelectionType: QuestionSelectionType; // 셔플 방식
  questionSelectionConfig: QuestionSelectionConfig; // 셔플 문항 설정
  successPoint: string; // 합격 점수
  totalPoint: number; // 총점

  stepIndex: 1 | 2; // Step 위치 값
  questionCount: number; // 출제 문항 수
  mandatoryCount: number; // 필수 문항 수
  totalQuestionCount: number; // 총 문항 수
}

export interface QuestionSelectionConfig {
  // 모두 출제 (ALL)
  enableShuffle: boolean; // 셔플 여부

  // 그룹 셔플 (BY_GROUP)
  questionGroups: QuestionGroup[];

  // 선택 서플
  pointPerQuestion: string; // 점수
  questionCount: string; // 출제 문항 갯수
}

export interface QuestionGroup {
  name: string; // 그룹 명
  pointPerGroup: string; // 그룹 점수
  questionCount: string; // 출제 문항 갯수

  totalQuestionCount: number; // 그룹 별 총 문항 갯수
  mandatoryCount: number; // 그룹 별 필수 문항 갯수
}

export function getInitialTestCreateFromViewModel(): TestCreateFormViewModel {
  const authorName = JSON.parse(patronInfo.getPatronName() || '')?.ko || '';
  const email = patronInfo.getPatronEmail() || '';

  return {
    id: '',
    finalCopy: false,
    title: '',
    description: '',
    applyLimit: '0',
    authorName,
    email,
    language: 'Korean',
    newQuestions: [],
    questionSelectionType: QuestionSelectionType.BY_GROUP,
    questionSelectionConfig: getInitialQuestionSelectionConfig(),
    successPoint: '0',
    totalPoint: 0,
    questionCount: 0,
    mandatoryCount: 0,
    stepIndex: 1,
    totalQuestionCount: 0,
  };
}

export function getInitialQuestionSelectionConfig(): QuestionSelectionConfig {
  return {
    enableShuffle: true,
    questionGroups: [getInitialQuestionGroup()],
    pointPerQuestion: '0',
    questionCount: '0',
  };
}

export function getInitialQuestionGroup(): QuestionGroup {
  return {
    name: '',
    pointPerGroup: '0',
    questionCount: '0',
    totalQuestionCount: 0,
    mandatoryCount: 0,
  };
}

export function getChoiceScore(questions: Question[]) {
  return questions
    .filter((q) => q.questionType === QuestionType.SingleChoice || q.questionType === QuestionType.MultiChoice)
    .map((q) => q.point)
    .reduce((a, b) => a + Number(b), 0);
}

export function getAnswerScore(questions: Question[]) {
  return questions
    .filter((q) => q.questionType === QuestionType.ShortAnswer || q.questionType === QuestionType.Essay)
    .map((q) => q.point)
    .reduce((a, b) => a + Number(b), 0);
}

export function getQuestionsByModalQuestions(modalQuestions: ModalQuestion[]): Question[] {
  //
  return modalQuestions.map((mQuestion) => getQuestionByModalQuestion(mQuestion));
}

export function getQuestionByModalQuestion(modalQuestion: ModalQuestion): Question {
  //
  return {
    sequence: modalQuestion.sequence,
    mandatory: modalQuestion.mandatory,
    groupName: modalQuestion.groupName,
    questionType: modalQuestion.questionType,
    point: modalQuestion.point,
    question: modalQuestion.question,
    items: modalQuestion.items,
    imagePath: modalQuestion.imagePath,
    questionAnswer: modalQuestion.questionAnswer,
    description: modalQuestion.description,
  };
}

export function getGroupsByModalGroups(modalGroups: ModalGroup[]): QuestionGroup[] {
  //
  return modalGroups.map((modalGroup) => getGroupByModalGroup(modalGroup));
}

export function getGroupByModalGroup(modalGroup: ModalGroup): QuestionGroup {
  //
  const totalQuestionCount = modalGroup.questions.length;
  const mandatoryCount = modalGroup.questions.filter((question) => question.mandatory).length;
  const questionCount =
    Number(modalGroup.questionCount) < mandatoryCount ? String(mandatoryCount) : modalGroup.questionCount;

  return {
    name: modalGroup.name,
    pointPerGroup: modalGroup.pointPerGroup,
    questionCount,
    totalQuestionCount,
    mandatoryCount,
  };
}
