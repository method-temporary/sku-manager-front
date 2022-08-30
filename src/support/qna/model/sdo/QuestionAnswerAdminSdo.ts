import { PolyglotString } from 'shared/model';
import { QuestionState } from '../vo/QuestionState';
import { RequestChannel } from '../vo/RequestChannel';

export default class QuestionAnswerAdminSdo {
  //
  denizenId: string = '';
  requestChannel: RequestChannel = RequestChannel.QNA;

  mainCategoryId: string = '';
  subCategoryId: string = '';

  relatedCardId: string = '';
  relatedCardName: PolyglotString = new PolyglotString();
  relatedQuestionId: string = '';

  operatorIds: string[] = [];

  title: string = '';
  content: string = '';

  depotId: string = '';

  state: QuestionState = QuestionState.QuestionReceived;
  registeredTime: number = 0;

  answerContent: string = '';
  answerDepotId: string = '';
  checkMail: boolean = false;
  memo: string = '';

  operatorsToSendMail: string[] = [];

  visibleForQuestioner: boolean = false;
}
