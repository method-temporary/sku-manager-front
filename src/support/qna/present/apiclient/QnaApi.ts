import QnaRdo from '../../model/sdo/QnaRdo';
import { OffsetElementList } from 'shared/model';
import QnaRom from '../../model/sdo/QnaRom';
import { axiosApi } from 'shared/axios/Axios';
import QuestionCdo from '../../model/sdo/QuestionCdo';
import AnswerSdo from '../../model/sdo/AnswerSdo';
import QuestionAnswerAdminSdo from 'support/qna/model/sdo/QuestionAnswerAdminSdo';
import QnaExcelRom from 'support/qna/model/sdo/QnaExcelRom';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import RelatedQnaRdo from 'support/qna/model/sdo/RelatedQnaRdo';

class QnaApi {
  //
  static instance: QnaApi;

  URL = '/api/support/admin/qnas';

  findByRdo(qnaRdo: QnaRdo): Promise<OffsetElementList<QnaRom>> {
    //
    return axiosApi.getLoader(this.URL, { params: qnaRdo }).then((response) => (response && response.data) || null);
  }

  findForExcel(qnaRdo: QnaRdo): Promise<OffsetElementList<QnaExcelRom>> {
    //
    const apiUrl = this.URL + '/excel';

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: qnaRdo,
      workType: 'Excel Download',
    });

    return axiosApi.get(apiUrl, { params: qnaRdo }).then((response) => (response && response.data) || null);
  }

  findByQuestionId(questionId: string): Promise<QnaRom> {
    //
    return axiosApi.getLoader(this.URL + `/${questionId}`).then((response) => (response && response.data) || null);
  }

  findRelatedQnasByQuestionId(questionId: string): Promise<RelatedQnaRdo[]> {
    //
    return axiosApi
      .getLoader(this.URL + `/${questionId}/related`)
      .then((response) => (response && response.data) || null);
  }

  registerQuestion(questionCdo: QuestionCdo): Promise<string> {
    //
    return axiosApi.postLoader(this.URL + '', questionCdo).then((response) => (response && response.data) || null);
  }

  saveAnswer(questionId: string, answerSdo: AnswerSdo): Promise<void> {
    //
    return axiosApi
      .putLoader(this.URL + `?questionId=${questionId}`, answerSdo)
      .then((response) => (response && response.data) || null);
  }

  registerQna(qnaId: string, qnaCdo: QuestionAnswerAdminSdo) {
    //
    axiosApi.postLoader(this.URL + `/answer/${qnaId}`, qnaCdo).then((response) => (response && response.data) || null);
  }

  modifyQna(qnaId: string, qnaCdo: QuestionAnswerAdminSdo) {
    //
    axiosApi.putLoader(this.URL + `/answer/${qnaId}`, qnaCdo).then((response) => (response && response.data) || null);
  }

  registerEtc(etcCdo: QuestionAnswerAdminSdo): Promise<string> {
    //
    return axiosApi.postLoader(this.URL, etcCdo).then((response) => (response && response.data) || null);
  }

  modifyEtc(qnaId: string, etcCdo: QuestionAnswerAdminSdo) {
    //
    axiosApi.putLoader(this.URL + `/${qnaId}`, etcCdo).then((response) => (response && response.data) || null);
  }

  removeQna(qnaId: string) {
    //
    axiosApi.deleteLoader(`/api/support/qnas/${qnaId}`).then((response) => (response && response.data) || null);
  }
}

export default QnaApi;
QnaApi.instance = new QnaApi();
