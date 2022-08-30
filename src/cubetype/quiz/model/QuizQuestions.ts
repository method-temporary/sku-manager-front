import QuizItem, { getEmptyQuizItem } from './QuizItem';
import QuizMessage from './QuizMessage';
import AlertMessage from './AlertMessage';

export default interface QuizQuestions {
  alertMessage: AlertMessage;
  answer: boolean;
  id: string;
  img: string;
  number: number;
  quizId: string;
  quizQuestionItems?: QuizItem[];
  resultView: boolean;
  subText: string;
  text: string;
  type: string;
  index: number;
}

export function getEmptyQuizQuestions(): QuizQuestions {
  return {
    alertMessage: {
      failMessage: '다시 한번 생각해 주세요.',
      passMessage: '딩동댕! 정답입니다.',
      failImg: '',
      passImg: '',
    },
    answer: false,
    id: '',
    img: '',
    quizQuestionItems: [getEmptyQuizItem()],
    number: 0,
    quizId: '',
    resultView: false,
    subText: '',
    text: '',
    type: 'SingleChoice',
    index: new Date().getTime(),
  };
}
