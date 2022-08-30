import moment from 'moment';

import { PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';
import QuestionModel from '../QuestionModel';
import AnswerModel from '../AnswerModel';
import { QnaExcelFormModel } from './QnaExcelFormModel';

export default class QnaExcelRom {
  //
  question: QuestionModel = new QuestionModel();
  answer: AnswerModel = new AnswerModel();
  inquirerIdentity: UserIdentityModel = new UserIdentityModel();
  operatorGroupName: PolyglotModel = new PolyglotModel();
  operatorEmail: string = '';
  cardName: PolyglotModel = new PolyglotModel();

  constructor(qnaRom?: QnaExcelRom) {
    if (qnaRom) {
      const question = new QuestionModel(qnaRom.question);
      const answer = new AnswerModel(qnaRom.answer);
      const operatorGroupName = qnaRom.operatorGroupName && new PolyglotModel(qnaRom.operatorGroupName);
      const inquirerIdentity = qnaRom.inquirerIdentity && new UserIdentityModel(qnaRom.inquirerIdentity);
      const cardName = qnaRom.cardName && new PolyglotModel(qnaRom.cardName);

      Object.assign(this, { ...qnaRom, question, answer, inquirerIdentity, operatorGroupName, cardName });
    }
  }

  static asExcelModel(
    qna: QnaExcelRom,
    idx: number,
    channelName: string,
    mainCategoryName: string,
    subCategoryName: string,
    state: string
  ): QnaExcelFormModel {
    //
    return {
      No: (idx + 1).toString(),
      접수채널: channelName || '',
      카테고리: mainCategoryName || '',
      세부카테고리: subCategoryName || '',
      과정명: (qna.question && getPolyglotToAnyString(qna.question.relatedCardName)) || '',
      '문의자 소속': (qna.inquirerIdentity && getPolyglotToAnyString(qna.inquirerIdentity.companyName)) || '',
      '문의자 부서': (qna.inquirerIdentity && getPolyglotToAnyString(qna.inquirerIdentity.departmentName)) || '',
      '문의자 이름': (qna.inquirerIdentity && getPolyglotToAnyString(qna.inquirerIdentity.name)) || '',
      '문의자 이메일': (qna.inquirerIdentity && qna.inquirerIdentity.email) || '',
      '문의 제목': (qna.question && qna.question.title) || '',
      '문의 내용': (qna.question && qna.question.content) || '',
      문의일자: (qna.question && moment(qna.question.registeredTime).format('yyyy.MM.DD')) || '',
      처리상태: state || '',
      담당조직: (qna.answer && qna.answer.modifierName && getPolyglotToAnyString(qna.operatorGroupName)) || '',
      답변담당자: (qna.answer && qna.answer.modifierName && getPolyglotToAnyString(qna.answer.modifierName)) || '미정',
      '답변담당자 이메일': qna.operatorEmail || '',
      '답변 내용': (qna.answer && qna.answer.content) || '',
      '답변 일자':
        (qna.answer && qna.answer.modifiedTime && moment(qna.answer.modifiedTime).format('yyyy.MM.DD')) || '',
      만족도: (qna.answer && qna.answer.satisfactionPoint && qna.answer.satisfactionPoint.toString()) || '',
      '만족도 답변': (qna.answer && qna.answer.satisfactionComment) || '',
    };
  }
}
