import QuizMessage from "./QuizMessage";
import QuizQuestions, { getEmptyQuizQuestions } from "./QuizQuestions";

export default interface QuizTableList {
  id:string;
  endTime: number;
  name: string;
  quizQuestions: QuizQuestions[];
  resultAlertMessage: QuizMessage;
  showTime: number;
}

export function getEmptyQuizTable(): QuizTableList {
  return {
    id:'',
    showTime: 0,
    endTime: 0,
    name: '',
    quizQuestions: [getEmptyQuizQuestions()],
    resultAlertMessage: {
      img: '',
      message: ''
    },
  }
}