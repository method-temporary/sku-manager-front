import { observable, action, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { OffsetElementList } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';

import { MailQueryModel } from '../../model/MailQueryModel';
import { ResultMailModel } from '../../model/ResultMailModel';
import { ResultMailDetailModel } from '../../model/ResultMailDetailModel';
import { ResultMailRdoModel } from '../../model/ResultMailRdoModel';
import MailApi from '../apiclient/MailApi';

@autobind
export default class ResultMailService {
  //
  static instance: ResultMailService;
  mailApi: MailApi;

  constructor(mailApi: MailApi) {
    this.mailApi = mailApi;
  }

  @observable
  resultMailQuery: MailQueryModel = new MailQueryModel();

  @observable
  resultMailModel: ResultMailModel = new ResultMailModel();

  @observable
  resultMailModels: OffsetElementList<ResultMailModel> = new OffsetElementList<ResultMailModel>();

  @observable
  resultMailDetailModel: ResultMailDetailModel = new ResultMailDetailModel();

  @observable
  resultMailDetailModels: OffsetElementList<ResultMailDetailModel> = new OffsetElementList<ResultMailDetailModel>();

  @observable
  resultMailRdoModel: ResultMailRdoModel = new ResultMailRdoModel();

  @observable
  sendId: string = '';

  @observable
  resultSendCont: any = {};

  @observable
  resultEmailModal: boolean = false;

  @observable
  receiverUsers: UserIdentityModel[] = [];

  @action
  setSendId(sendId: string) {
    //
    this.sendId = sendId;
  }

  @action
  clearResultMailModel() {
    //
    this.resultMailModel = new ResultMailModel();
  }

  @action
  clearResultMailDetailModel() {
    //
    this.resultMailDetailModel = new ResultMailDetailModel();
    this.sendId = '';
  }

  @action
  clearResultMailQueryProps() {
    //
    this.resultMailQuery = new MailQueryModel();
  }

  @action
  async findAllResultMail() {
    //
    const rtn = await this.mailApi.findAllResultMail(MailQueryModel.asRdo(this.resultMailQuery));
    const ids: string[] = [];
    rtn.results.map((res: ResultMailModel) => {
      if (res.sender !== null) {
        ids.push(res.sender.keyString);
      }
      return new ResultMailModel(res);
    });

    const senderInfos = await this.mailApi.findUsersByDenizenIds(ids);
    const newRtn: OffsetElementList<ResultMailModel> = {
      results: rtn.results.map((res: ResultMailModel) => {
        const senderInfo = senderInfos?.find(
          (userInfo: UserIdentityModel) => res.sender !== null && userInfo.id === res.sender.keyString
        );
        const resultMail: ResultMailModel = new ResultMailModel();
        resultMail.id = res.id;
        resultMail.entityVersion = res.entityVersion;
        resultMail.patronKey = res.patronKey;
        resultMail.sender = res.sender;
        resultMail.cubeName = res.cubeName;
        resultMail.type = res.type;
        resultMail.receiverEmail = res.receiverEmail;
        resultMail.sendId = res.sendId;
        resultMail.typeName = res.typeName;
        resultMail.mailTitle = res.mailTitle;
        resultMail.dispatcherName = res.dispatcherName;
        resultMail.dispatcherEmail = res.dispatcherEmail;
        resultMail.trueCount = res.trueCount;
        resultMail.falseCount = res.falseCount;
        resultMail.createDate = res.createDate;
        resultMail.senderEmail = senderInfo?.email || '';
        resultMail.senderName = senderInfo === undefined ? '' : getPolyglotToAnyString(senderInfo.name);
        return resultMail;
      }),
      empty: rtn.empty,
      totalCount: rtn.totalCount,
    };

    return runInAction(() => (this.resultMailModels = newRtn));
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

  // paging detail
  @action
  async findResultMailPage(sendId: string) {
    //
    const rtn = await this.mailApi.findResultMailPage(sendId);
    rtn.results.map((res: ResultMailDetailModel) => new ResultMailDetailModel(res));

    return runInAction(() => (this.resultMailDetailModels = rtn));
  }

  @action
  async findResultMail(sendId: string) {
    //
    const rtn = await this.mailApi.findResultMail(sendId);
    return runInAction(() => (this.resultSendCont = rtn));
  }

  @action
  async findUsersByEmails(emails: string[]) {
    const emailRtn = await this.mailApi.findUsersByEmails(emails);
    return runInAction(() => (this.receiverUsers = emailRtn));
  }

  @action
  changeResultMailContSendListProps(idx: number, name: string, value: any) {
    this.resultSendCont.sendLists[idx] = _.set(this.resultSendCont.sendLists[idx], name, value);
  }
}

Object.defineProperty(ResultMailService, 'instance', {
  value: new ResultMailService(MailApi.instance),
  writable: false,
  configurable: false,
});
