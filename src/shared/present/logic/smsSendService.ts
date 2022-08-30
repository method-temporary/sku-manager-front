import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { SendSmsApi } from 'shared/present';
import { SendSmsModel, SendSmsMainNumberModel } from 'shared/model';

import StudentByCubeRdo from 'student/model/StudentByCubeRdo';
import { StudentCardRdoModel } from 'student/model/StudentCardRdoModel';

@autobind
export default class SendSmsService {
  //
  static instance: SendSmsService;
  sendSmsApi: SendSmsApi;

  @observable
  sendSmss: SendSmsModel = new SendSmsModel();

  @observable
  mainNumbers: { representativeNumber: SendSmsMainNumberModel }[] = [];

  @observable
  allowed: boolean = false;

  constructor(sendSmsApi: SendSmsApi) {
    this.sendSmsApi = sendSmsApi;
  }

  @action
  changeSelectedStudentPhoneProps(
    selectedIdList: string[],
    selectedNameList: string[],
    cubeName: string,
    type: string
  ) {
    this.sendSmss.studentIds = selectedIdList;
    this.sendSmss.names = selectedNameList;
    this.sendSmss.cubeName = cubeName;
    this.sendSmss.type = type;
  }

  @action
  changeSendSmsProps(name: string, value: any) {
    this.sendSmss = _.set(this.sendSmss, name, value);
  }

  @action
  async findEnableMainNumbers() {
    const results = await this.sendSmsApi.findEnableRepresentativeNumber();
    return runInAction(() => (this.mainNumbers = results));
  }

  @action
  async findMySmsSenderAllowed() {
    const results = await this.sendSmsApi.findMySmsSenderQualified();
    if (results !== undefined) {
      this.allowed = results.qualified;
    }
    return this.allowed;
  }

  @action
  async sendCubeStudentEmailOrSms(studentByCubeRdo?: StudentByCubeRdo) {
    const results = await this.sendSmsApi.sendCubeStudentEmailOrSms(
      SendSmsModel.asCubeStudentSendEmailOrSmsCdo(this.sendSmss, studentByCubeRdo)
    );
    return results;
  }

  @action
  async sendCardStudentEmailOrSms(studentCardRdoModel?: StudentCardRdoModel) {
    const results = await this.sendSmsApi.sendCardStudentEmailOrSms(
      SendSmsModel.asCardStudentSendEmailOrSmsCdo(this.sendSmss, studentCardRdoModel)
    );
    return results;
  }
}

Object.defineProperty(SendSmsService, 'instance', {
  value: new SendSmsService(SendSmsApi.instance),
  writable: false,
  configurable: false,
});
