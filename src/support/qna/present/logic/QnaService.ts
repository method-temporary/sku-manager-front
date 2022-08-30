import { action, computed, observable, runInAction } from 'mobx';
import moment from 'moment';
import _ from 'lodash';

import { autobind } from '@nara.platform/accent';
import { MemberViewModel } from '@nara.drama/approval';

import { OffsetElementList } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserDetailModel } from 'user/model/UserDetailModel';
import QnaRom from 'support/qna/model/sdo/QnaRom';
import { QnaQueryModel } from 'support/qna/model/sdo/QnaQueryModel';
import QuestionAnswerAdminSdo from 'support/qna/model/sdo/QuestionAnswerAdminSdo';
import OperatorRom from 'support/operator/model/sdo/OperatorRom';
import QnaExcelRom from 'support/qna/model/sdo/QnaExcelRom';
import RelatedQnaRdo from 'support/qna/model/sdo/RelatedQnaRdo';

import QnaRdo from '../../model/sdo/QnaRdo';
import QnaApi from '../apiclient/QnaApi';

@autobind
export default class QnaService {
  //
  static instance: QnaService;
  qnaApi: QnaApi;

  constructor(qnaApi: QnaApi) {
    this.qnaApi = qnaApi;
  }

  @observable
  qnaRom: QnaRom = new QnaRom();

  @observable
  qnaRoms: QnaRom[] = [];

  @observable
  qnaQuery: QnaQueryModel = new QnaQueryModel();

  @observable
  totalSearchCount: number = 0;

  @observable
  operator: OperatorRom = new OperatorRom();

  @observable
  mailSender: UserDetailModel = new UserDetailModel();

  @observable
  relatedQnaRdo: RelatedQnaRdo = new RelatedQnaRdo();

  @observable
  relatedQnaRdos: RelatedQnaRdo[] = [];

  @observable
  requestUser: {
    key: number;
    id: string;
    name: string;
    companyName: string;
    departmentName: string;
    email: string;
  } | null = null;

  // Excel 일괄 등록
  @observable
  _fileName: string = '';

  // 엑셀 파일 불러오기 총 데이터 건수
  @observable
  _excelDataRowCount: number = 0;

  // _sendEmailCdoList: SendEmailRdoModel[] = [];
  _sendEmailCdoList: [] = [];

  // 처리후 반환된 결과 목록
  @observable
  // _sendEmailTempModelList: SendEmailRdoModel[] = [];
  _sendEmailTempModelList: [] = [];

  // 총 데이터 건수
  @observable
  _procTargetTotalListCount: number = 0;

  // 처리할 데이터 건수
  @observable
  _procTargetRegistCount: number = 0;

  @action
  createPageInit() {
    //
    this.qnaRom = new QnaRom();
    this.qnaRom.question.registeredTime = moment().toDate().getTime();
    this.requestUser = null;
  }

  @action
  changeQnaQuery(name: string, value: any) {
    this.qnaQuery = _.set(this.qnaQuery, name, value);
  }

  @action
  clearQnaQuery() {
    this.qnaQuery = new QnaQueryModel();
  }

  @action
  changeQnaRom(name: string, value: any) {
    this.qnaRom = _.set(this.qnaRom, name, value);
  }

  @action
  clearQnaRom() {
    this.qnaRom = new QnaRom();
  }

  @action
  clearRelatedQnaRdos() {
    this.relatedQnaRdos = [];
  }

  @action
  async findByRdo(qnaRdo: QnaRdo): Promise<OffsetElementList<QnaRom>> {
    //
    const offsetElementList = await this.qnaApi.findByRdo(qnaRdo);

    await runInAction(() => {
      this.qnaRoms = offsetElementList.results.map((qnaRom) => new QnaRom(qnaRom));
    });

    await runInAction(() => {
      this.totalSearchCount = offsetElementList.totalCount;
    });

    return offsetElementList;
  }

  @action
  async findForExcel(qnaRdo: QnaRdo): Promise<QnaExcelRom[]> {
    //
    const offsetElementList = await this.qnaApi.findForExcel(qnaRdo);

    return offsetElementList.results;
  }

  @action
  async findByQuestionId(questionId: string): Promise<QnaRom> {
    //
    const qunRom = await this.qnaApi.findByQuestionId(questionId);

    runInAction(() => {
      this.qnaRom = new QnaRom(qunRom);
    });

    return this.qnaRom;
  }

  @action
  async findRelatedQnasByQuestionId(questionId: string): Promise<RelatedQnaRdo[]> {
    //
    const qnaRdos = await this.qnaApi.findRelatedQnasByQuestionId(questionId);

    runInAction(() => {
      this.relatedQnaRdos = qnaRdos.map((qnaRdo) => new RelatedQnaRdo(qnaRdo));
    });

    return this.relatedQnaRdos;
  }

  @action
  selectRequestUser(member: MemberViewModel) {
    //
    this.requestUser = {
      key: member.id,
      id: member.id,
      name: getPolyglotToAnyString(member.name),
      companyName: member.companyCode,
      departmentName: member.departmentCode,
      email: member.email,
    };
  }

  // registerQuestion(questionCdo: QuestionAnswerAdminSdo): Promise<string> {
  //   //
  //   return this.qnaApi.registerQuestion(questionCdo);
  // }

  // saveAnswer(questionId: string, answerSdo: AnswerSdo): Promise<void> {
  //   //
  //   return this.qnaApi.saveAnswer(questionId, answerSdo);
  // }

  @action
  registerQna(qnaCdo: QuestionAnswerAdminSdo) {
    //
    return this.qnaApi.registerQna(this.qnaRom.question.id, qnaCdo);
  }

  @action
  modifyQna(qnaCdo: QuestionAnswerAdminSdo) {
    //
    this.qnaApi.modifyQna(this.qnaRom.question.id, qnaCdo);
  }

  @action
  registerEtc(qnaCdo: QuestionAnswerAdminSdo): Promise<string> {
    //
    return this.qnaApi.registerEtc(qnaCdo);
  }

  @action
  modifyEtc(qnaCdo: QuestionAnswerAdminSdo) {
    //
    this.qnaApi.modifyEtc(this.qnaRom.question.id, qnaCdo);
  }

  @action
  removeQna(qnaId: string) {
    //
    this.qnaApi.removeQna(qnaId);
  }

  // Excel Upload

  @action
  changeFileName(fileName: string) {
    this._fileName = fileName;
  }

  //엑셀 파일 불러오기시 기존 데이터 처리 표기 부분 초기화(그리드 포함)
  @action
  clearFileDisplay() {
    //전체 엑셀 건수 표기 초기화
    this._excelDataRowCount = 0;

    //총 건수 초기화
    this._procTargetTotalListCount = 0;

    //등록 건수 초기화
    this._procTargetRegistCount = 0;

    //학습완료 처리 업데이트용 데이터 목록 초기화
    this._sendEmailCdoList = [];

    //학습완료 처리후 결과 목록 초기화
    this._sendEmailTempModelList = [];
  }

  @action
  setExcelDataRowCount(excelDataRowCount: number) {
    this._excelDataRowCount = excelDataRowCount;
  }

  @computed
  get fileName() {
    return this._fileName;
  }

  /**
   * 엑셀내 전체 데이터 건수(오류포함) 가져오기
   */
  @computed
  get excelDataRowCount() {
    return this._excelDataRowCount;
  }

  /**
   * 총 데이터 건수 가져오기
   */
  @computed
  get procTargetTotalListCount() {
    return this._procTargetTotalListCount;
  }

  /**
   * 총 데이터 건수 가져오기
   */
  @computed
  get procTargetRegistCount() {
    return this._procTargetRegistCount;
  }

  /**
   * 학습완료 처리시 오류를 제외한 실제 완료처리 성공 건수 가져오기
   */
  @computed
  get processingSuccessTotalCount() {
    const completedTotalCount: number = 0;
    // let completedTotalCount: number = 0;
    this._sendEmailTempModelList.map((model) => {
      // if (model.result === '성공') {
      //   completedTotalCount += 1;
      // }
    });

    return completedTotalCount;
  }

  @computed
  get sendEmailTempProcList() {
    return this._sendEmailTempModelList;
  }

  @action
  setOperator(operator: OperatorRom) {
    runInAction(() => {
      this.operator = new OperatorRom(operator);
    });
  }

  @action
  setMailSender(sender: UserDetailModel) {
    this.mailSender = new UserDetailModel(sender);
  }
}

Object.defineProperty(QnaService, 'instance', {
  value: new QnaService(QnaApi.instance),
  writable: false,
  configurable: false,
});
