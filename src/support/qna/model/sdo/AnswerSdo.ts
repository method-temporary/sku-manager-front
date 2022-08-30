import { QuestionState } from '../vo/QuestionState';

export default class AnswerSdo {
  //
  questionId: string = '';
  content: string = '';
  depotId: string = '';

  state: QuestionState = QuestionState.QuestionReceived;
}
