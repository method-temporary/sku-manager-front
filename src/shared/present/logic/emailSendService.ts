import autobind from 'autobind-decorator';
import { action, computed, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { SendEmailModel, SendEmailRdoModel } from 'shared/model';
import { SendEmailApi } from 'shared/present';

import { MailQueryModel } from 'resultSendMail/model/MailQueryModel';
import StudentByCubeRdo from 'student/model/StudentByCubeRdo';
import { StudentCardRdoModel } from 'student/model/StudentCardRdoModel';

@autobind
export default class SendEmailService {
  //
  static instance: SendEmailService;
  sendEmailApi: SendEmailApi;

  @observable
  _fileName: string = '';

  /**
   * 엑셀 파일 불러오기 총 데이터 건수
   */
  @observable
  _excelDataRowCount: number = 0;

  _sendEmailCdoList: SendEmailRdoModel[] = [];

  /**
   * 처리후 반환된 결과 목록
   */
  @observable
  _sendEmailTempModelList: SendEmailRdoModel[] = [];

  /**
   * 총 데이터 건수
   */
  @observable
  _procTargetTotalListCount: number = 0;

  /**
   * 처리할 데이터 건수
   */
  @observable
  _procTargetRegistCount: number = 0;

  @observable
  sendEmails: SendEmailModel = new SendEmailModel();

  @observable
  resultMailQuery: MailQueryModel = new MailQueryModel();

  constructor(sendEmailApi: SendEmailApi) {
    this.sendEmailApi = sendEmailApi;
  }

  @action
  changeResultMailQueryProps(name: string, value: any) {
    if (value === '전체') value = '';
    if (name === 'searchFilterType') {
      this.resultMailQuery.type = value;
    } else {
      this.resultMailQuery = _.set(this.resultMailQuery, name, value);
    }
  }

  @action
  changeSelectedStudentEmailProps(
    selectedEmailList: string[],
    selectedNameList: string[],
    cubeName: string,
    type: string,
    selectedIdList?: string[]
  ) {
    this.sendEmails.emails = selectedEmailList;
    this.sendEmails.names = selectedNameList;
    this.sendEmails.cubeName = cubeName;
    this.sendEmails.type = type;
    this.sendEmails.studentIds = selectedIdList;
  }

  @action
  changeSelectedRejectEmailProps(
    selectedEmailList: string[],
    selectedNameList: string[],
    cubeTitles: string[],
    type: string
  ) {
    this.sendEmails.emails = selectedEmailList;
    this.sendEmails.names = selectedNameList;
    this.sendEmails.cubeTitles = cubeTitles;
    this.sendEmails.type = type;
  }

  @action
  changeSendMailProps(name: string, value: any) {
    this.sendEmails = _.set(this.sendEmails, name, value);
  }

  @action
  changeFileName(fileName: string) {
    this._fileName = fileName;
  }

  @action
  setExcelDataRowCount(excelDataRowCount: number) {
    this._excelDataRowCount = excelDataRowCount;
  }

  @action
  setProcTargetTotalListCount(count: number) {
    this._procTargetTotalListCount = count;
  }

  @action
  setProcTargetRegistCount(count: number) {
    this._procTargetRegistCount = count;
  }

  @action
  setSendEmailUdoList(sendEmailTempProcCdoList: SendEmailRdoModel[]) {
    this._sendEmailCdoList = sendEmailTempProcCdoList;
  }

  getSendEmailUdoList() {
    return this._sendEmailCdoList;
  }

  /**
   * email 정합성 체크
   * @param sendEmailCdoList
   */
  @action
  async confirmEmail(sendEmailRdoList: SendEmailRdoModel[]): Promise<SendEmailRdoModel[]> {
    ///
    const rdoList: SendEmailRdoModel[] = [];
    const confirmList = await this.sendEmailApi.confirmEmail(sendEmailRdoList);
    confirmList?.forEach((confirm, idx) => {
      rdoList.push(this.getLanguageNames(confirm, idx));
    });
    return runInAction(() => (this._sendEmailTempModelList = rdoList));
  }

  getLanguageNames(obj: any, idx: number) {
    let rtn = new SendEmailRdoModel(obj);
    if (obj.companyNames) {
      const language = obj.companyNames.defaultLanguage;
      rtn = { ...rtn, company: obj.companyNames.langStringMap[language] };
    }
    if (obj.departmentNames) {
      const language = obj.departmentNames.defaultLanguage;
      rtn = { ...rtn, department: obj.departmentNames.langStringMap[language] };
    }
    if (obj.userNames) {
      const language = obj.userNames.defaultLanguage;
      rtn = { ...rtn, name: obj.userNames.langStringMap[language] };
    }
    rtn = {
      ...rtn,
      currPage: Math.floor(idx / 10) + 1,
    };
    return rtn;
  }

  /**
   * 엑셀 파일 불러오기시 기존 데이터 처리 표기 부분 초기화(그리드 포함)
   */
  @action
  clearDisplay() {
    this.sendEmails = new SendEmailModel();

    //학습완료 처리 업데이트용 데이터 목록 초기화
    this._sendEmailCdoList = [];

    //학습완료 처리후 결과 목록 초기화
    this._sendEmailTempModelList = [];
  }

  /**
   * 엑셀 파일 불러오기시 기존 데이터 처리 표기 부분 초기화(그리드 포함)
   */
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
  async sendRjEmail() {
    //
    const results = await this.sendEmailApi.sendRjEmail(SendEmailModel.asRjCdo(this.sendEmails));
    return results;
  }

  @action
  async sendEmail() {
    //
    const results = await this.sendEmailApi.sendEmail(SendEmailModel.asCdo(this.sendEmails));
    return results;
  }

  @action
  async sendCubeStudentEmailOrSms(studentByCubeRdo?: StudentByCubeRdo) {
    const results = await this.sendEmailApi.sendCubeStudentEmailOrSms(
      SendEmailModel.asCubeStudentSendEmailOrSmsCdo(this.sendEmails, studentByCubeRdo)
    );
    return results;
  }

  @action
  async sendCardStudentEmailOrSms(studentCardRdoModel?: StudentCardRdoModel) {
    const results = await this.sendEmailApi.sendCardStudentEmailOrSms(
      SendEmailModel.asCardStudentSendEmailOrSmsCdo(this.sendEmails, studentCardRdoModel)
    );
    return results;
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
    let completedTotalCount: number = 0;
    this._sendEmailTempModelList.map((model) => {
      if (model.result === '성공') {
        completedTotalCount += 1;
      }
    });

    return completedTotalCount;
  }

  @computed
  get sendEmailTempProcList() {
    return this._sendEmailTempModelList;
  }
}

Object.defineProperty(SendEmailService, 'instance', {
  value: new SendEmailService(SendEmailApi.instance),
  writable: false,
  configurable: false,
});
