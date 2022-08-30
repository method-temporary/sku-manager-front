import { decorate, observable } from 'mobx';
import moment from 'moment';
import { PolyglotString } from 'shared/model';

import QuestionModel from '../QuestionModel';
import AnswerModel from '../AnswerModel';
import { UserIdentityModel } from '../../../../cube/user/model/UserIdentityModel';
import QuestionAnswerAdminSdo from './QuestionAnswerAdminSdo';
import { RequestChannel } from '../vo/RequestChannel';
import { QuestionState } from '../vo/QuestionState';
import QnaEmailHistory from '../QnaEmailHistory';
import { OperatorWithUserIdentityRom } from './OperatorWithUserIdentityRom';

export default class QnaRom {
  //
  question: QuestionModel = new QuestionModel();
  answer: AnswerModel = new AnswerModel();
  inquirerIdentity: UserIdentityModel = new UserIdentityModel();

  // detail 시에만 넘어옴
  operators: OperatorWithUserIdentityRom[] = [];
  latestOperatorSentEmail: QnaEmailHistory = new QnaEmailHistory();

  operatorsToSendMail: string[] = [];

  constructor(qnaRom?: QnaRom) {
    if (qnaRom) {
      const question = new QuestionModel(qnaRom.question);
      const answer = new AnswerModel(qnaRom.answer);
      const operators =
        qnaRom.operators && qnaRom.operators.map((operator) => new OperatorWithUserIdentityRom(operator));
      const inquirerIdentity = qnaRom.inquirerIdentity && new UserIdentityModel(qnaRom.inquirerIdentity);
      const latestOperatorSentEmail =
        qnaRom.latestOperatorSentEmail && new QnaEmailHistory(qnaRom.latestOperatorSentEmail);

      Object.assign(this, { ...qnaRom, question, answer, inquirerIdentity, operators, latestOperatorSentEmail });
    }
  }

  isBlank(operatorCheck?: boolean, answeredCheck?: boolean): string | null {
    //
    if (!(this.question && this.question.registeredTime > 0)) {
      return '문의 일자';
    } else if (!this.question.requestChannel) {
      return '접수 채널';
    } else if (!this.question.mainCategoryId) {
      return '카테고리';
    } else if (!this.question.denizenId) {
      return '문의자';
    } else if (!this.question.title) {
      return '문의 제목';
    } else if (!this.question.content) {
      return '문의 내용';
    }

    if (operatorCheck && !(this.question && this.question.operatorIds && this.question.operatorIds.length > 0)) {
      return '담당자 지정';
    } else if (operatorCheck && !(this.question && this.question.state)) {
      return '처리 상태';
    }

    if (
      this.question.state === QuestionState.AnswerCompleted &&
      this.question.requestChannel === RequestChannel.QNA &&
      !this.answer.content
    ) {
      return '답변 내용';
    }

    if (answeredCheck && !(this.answer && this.answer.content)) {
      return '답변 내용';
    }

    return null;
  }

  static asCdo(
    qnaRom: QnaRom,
    requestUser?: {
      key: number;
      id: string;
      name: string;
      companyName: string;
      departmentName: string;
      email: string;
    } | null
  ): QuestionAnswerAdminSdo {
    let newOperatorIds: string[] = [];
    if (qnaRom && qnaRom.operators && qnaRom.operators.length > 0) {
      newOperatorIds = qnaRom.operators.map((operator) => {
        return operator.denizenId;
      });
    }

    return {
      denizenId: (requestUser && requestUser.id) || (qnaRom.question && qnaRom.question.denizenId),
      requestChannel: (qnaRom && qnaRom.question && qnaRom.question.requestChannel) || RequestChannel.QNA,
      mainCategoryId: qnaRom && qnaRom.question && qnaRom.question.mainCategoryId,
      subCategoryId: qnaRom && qnaRom.question && qnaRom.question.subCategoryId,
      relatedCardId: (qnaRom && qnaRom.question && qnaRom.question.relatedCardId) || '',
      relatedCardName: (qnaRom && qnaRom.question && qnaRom.question.relatedCardName) || new PolyglotString(),
      relatedQuestionId: (qnaRom && qnaRom.question && qnaRom.question.relatedQuestionId) || '',
      operatorIds: newOperatorIds,
      title: qnaRom && qnaRom.question && qnaRom.question.title,
      content: qnaRom && qnaRom.question && qnaRom.question.content,
      depotId: qnaRom && qnaRom.question && qnaRom.question.depotId,
      state: (qnaRom && qnaRom.question && qnaRom.question.state) || QuestionState.QuestionReceived,
      registeredTime: (qnaRom && qnaRom.question && qnaRom.question.registeredTime) || moment().toDate().getTime(),
      answerContent: (qnaRom && qnaRom.answer && qnaRom.answer.content) || '',
      answerDepotId: (qnaRom && qnaRom.answer && qnaRom.answer.depotId) || '',
      checkMail: (qnaRom && qnaRom.answer && qnaRom.answer.checkMail) || false,
      memo: (qnaRom && qnaRom.answer && qnaRom.answer.memo) || '',
      operatorsToSendMail: (qnaRom && qnaRom.operatorsToSendMail) || [],
      visibleForQuestioner: (qnaRom && qnaRom.question && qnaRom.question.visibleForQuestioner) || false,
    };
  }
}

decorate(QnaRom, {
  question: observable,
  answer: observable,
  inquirerIdentity: observable,

  operators: observable,
  latestOperatorSentEmail: observable,
  operatorsToSendMail: observable,
});
