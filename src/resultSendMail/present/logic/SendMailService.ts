import { observable, action, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { OffsetElementList } from 'shared/model';

import { MailQueryModel } from '../../model/MailQueryModel';
import { SendMailModel } from '../../model/SendMailModel';
import { ResultMailRdoModel } from '../../model/ResultMailRdoModel';
import ResultMailApi from '../apiclient/MailApi';

@autobind
export default class SendMailService {
  //
  static instance: SendMailService;
  resultMailApi: ResultMailApi;

  constructor(resultMailApi: ResultMailApi) {
    this.resultMailApi = resultMailApi;
  }

  @observable
  resultMailQuery: MailQueryModel = new MailQueryModel();

  @observable
  sendMailModel: SendMailModel = new SendMailModel();

  @observable
  sendMailModels: OffsetElementList<SendMailModel> = new OffsetElementList<SendMailModel>();

  @observable
  resultMailRdoModel: ResultMailRdoModel = new ResultMailRdoModel();

  @observable
  sendId: string = '';

  @observable
  resultSendCont: any = {};

  @observable
  resultEmailModal: boolean = false;

  @action
  setSendId(sendId: string) {
    //
    this.sendId = sendId;
  }

  @action
  clearSendMailModel() {
    //
    this.sendMailModel = new SendMailModel();
  }

  @action
  clearResultMailQueryProps() {
    //
    this.resultMailQuery = new MailQueryModel();
  }

  @action
  async findAllResultMail() {
    //
    const rtn = await this.resultMailApi.findAllResultMail(MailQueryModel.asRdo(this.resultMailQuery));
    rtn.results.map((res: SendMailModel) => new SendMailModel(res));

    return runInAction(() => (this.sendMailModels = rtn));
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
  async findResultMail(sendId: string) {
    //
    const rtn = await this.resultMailApi.findResultMail(sendId);
    return runInAction(() => (this.resultSendCont = rtn));
  }
}

Object.defineProperty(SendMailService, 'instance', {
  value: new SendMailService(ResultMailApi.instance),
  writable: false,
  configurable: false,
});
