import { RequestChannel } from '../vo/RequestChannel';

export default class QuestionCdo {
  //
  denizenId: string = '';
  requestChannel: RequestChannel = RequestChannel.QNA;

  mainCategoryId: string = '';
  subCategoryId: string = '';

  relatedCardId: string = '';
  relatedQuestionId: string = '';

  title: string = '';
  content: string = '';

  depotId: string = '';
}
