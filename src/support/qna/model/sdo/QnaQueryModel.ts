import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import { QuestionState } from '../vo/QuestionState';
import { RequestChannel } from '../vo/RequestChannel';
import { SearchPartForQna } from '../vo/SearchPartForQna';
import QnaRdo from './QnaRdo';

export class QnaQueryModel extends QueryModel {
  //
  state: QuestionState | 'All' = 'All';
  requestChannel: RequestChannel | 'All' = 'All';
  mainCategoryId: string = 'All';
  subCategoryId: string = 'All';

  static asQnaRdo(qnaQuery: QnaQueryModel): QnaRdo {
    //
    const newState = qnaQuery.state === 'All' ? null : qnaQuery.state;
    const newRequestChannel = qnaQuery.requestChannel === 'All' ? null : qnaQuery.requestChannel;
    let newTitle = '';
    let newInquirerName = '';
    let newOperatorName = '';
    let newInquirerEmail = '';

    if (qnaQuery.searchPart === SearchPartForQna.TITLE) {
      newTitle = qnaQuery.searchWord;
    } else if (qnaQuery.searchPart === SearchPartForQna.INQUIRER_NAME) {
      newInquirerName = qnaQuery.searchWord;
    } else if (qnaQuery.searchPart === SearchPartForQna.OPERATOR_NAME) {
      newOperatorName = qnaQuery.searchWord;
    } else if (qnaQuery.searchPart === SearchPartForQna.INQUIRER_EMAIL) {
      newInquirerEmail = qnaQuery.searchWord;
    }

    const newMainCategoryId = qnaQuery.mainCategoryId === 'All' ? '' : qnaQuery.mainCategoryId;
    const newSubCategoryId = qnaQuery.subCategoryId === 'All' ? '' : qnaQuery.subCategoryId;

    return {
      startDate: qnaQuery && qnaQuery.period && qnaQuery.period.startDateLong,
      endDate: qnaQuery && qnaQuery.period && qnaQuery.period.endDateLong,
      state: newState,
      requestChannel: newRequestChannel,
      mainCategoryId: newMainCategoryId,
      subCategoryId: newSubCategoryId,
      title: newTitle,
      inquirerName: newInquirerName,
      operatorName: newOperatorName,
      inquirerEmail: newInquirerEmail,
      offset: qnaQuery && qnaQuery.offset,
      limit: qnaQuery && qnaQuery.limit,
    };
  }
}

decorate(QnaQueryModel, {
  state: observable,
  requestChannel: observable,
  mainCategoryId: observable,
  subCategoryId: observable,
});
