import { QuizQuestionItem } from './QuizQuestionItem';
import { QuizQuestionType } from './QuizQuestionType';
import { UserQuizAnswerRdo } from './UserQuizAnswerRdo';

export interface QuizAnswerExcelRdo {
  quizQuestionId: string;
  quizText?: string;
  quizSubText?: string;
  quizNumbers: number;
  quizQuestionType: QuizQuestionType;
  questionItems?: QuizQuestionItem[];
  userQuizAnswerRdoList?: UserQuizAnswerRdo[];
}
