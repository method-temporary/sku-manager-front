import { QuestionType } from 'exam/model/QuestionType';
import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';

export interface TestSheetViewModel {
  id: string;
  title: string;
  description: string;
  authorName: string;
  questionSelectionTypeText: QuestionSelectionTypeText;
  questionCount: number;
  successPoint: number;
  totalPoint: number;
  choiceScore: number;
  answerScore: number;
  questions: Question[];
}

export interface Question {
  sequence: number; // 문항
  mandatory: boolean; // 필수 여부
  groupName: string; // 그룹 명
  questionType: QuestionType; // 유형
  point: string; // 점수
  question: string; // 문제
  items: QuestionItem[]; // 객관식 답 목록
  imagePath: string; // 문제 Img 경로
  questionAnswer: QuestionAnswer; // 답, 해설
  description: string; //비고
}

export interface QuestionItem {
  itemNo: string;
  itemText: string;
  imgSrc: string;
}

export interface QuestionAnswer {
  answer: string; // 정답
  explanation: string; // 해설
}

export function createQuestion(nextQuestionNo: number, questionType: QuestionType): Question {
  return {
    sequence: nextQuestionNo,
    mandatory: false,
    groupName: '',
    questionType,
    question: '',
    point: '0',
    imagePath: '',
    items: [createQuestionItem('1')],
    questionAnswer: { answer: '', explanation: '' },
    description: '',
  };
}

export function createQuestionItem(nextItemNo: string): QuestionItem {
  return {
    itemNo: nextItemNo,
    itemText: '',
    imgSrc: '',
  };
}

export function changeQuestionItemNo(nextItemNo: string, item: QuestionItem): QuestionItem {
  return {
    itemNo: nextItemNo,
    itemText: item.itemText,
    imgSrc: item.imgSrc,
  };
}

export function createQuestionAnswer(): QuestionAnswer {
  return {
    answer: '',
    explanation: '',
  };
}

export function copyQuestion(nextSequence: number, question: Question): Question {
  const newQuestion = createQuestion(nextSequence, question.questionType);

  newQuestion.mandatory = question.mandatory;
  newQuestion.groupName = '';
  newQuestion.question = question.question;
  newQuestion.point = question.point;
  newQuestion.imagePath = question.imagePath;
  newQuestion.description = question.imagePath;

  const items = question.items.map((item) => {
    const newItem = createQuestionItem(item.itemNo);
    newItem.itemText = item.itemText;
    newItem.imgSrc = item.imgSrc;

    return newItem;
  });
  newQuestion.items = items;

  const questionAnswer = createQuestionAnswer();
  questionAnswer.answer = question.questionAnswer.answer;
  questionAnswer.explanation = question.questionAnswer.explanation;
  newQuestion.questionAnswer = questionAnswer;

  return newQuestion;
}
