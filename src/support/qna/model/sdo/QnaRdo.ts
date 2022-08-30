import { QuestionState } from '../vo/QuestionState';
import { RequestChannel } from '../vo/RequestChannel';

export default class QnaRdo {
  //
  startDate: number = 0;
  endDate: number = 0;

  state: QuestionState | null = QuestionState.QuestionReceived;
  requestChannel: RequestChannel | null = RequestChannel.QNA;
  mainCategoryId: string = '';
  subCategoryId: string = '';

  title: string = '';
  inquirerName: string = '';
  operatorName: string = '';
  inquirerEmail: string = '';

  limit: number = 0;
  offset: number = 0;
}
