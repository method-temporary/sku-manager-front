import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import OfficeWebApi from '../apiclient/OfficeWebApi';
import { OfficeWebModel } from '../../model/old/OfficeWebModel';
import OfficeWebFlowApi from '../apiclient/OfficeWebFlowApi';

@autobind
export default class OfficeWebService {
  //
  static instance: OfficeWebService;

  officeWebApi: OfficeWebApi;
  officeWebFlowApi: OfficeWebFlowApi;

  @observable
  officeWeb: OfficeWebModel = new OfficeWebModel();

  @observable
  officeWebs: OfficeWebModel[] = [];

  constructor(officeWebApi: OfficeWebApi, officeWebFlowApi: OfficeWebFlowApi) {
    this.officeWebApi = officeWebApi;
    this.officeWebFlowApi = officeWebFlowApi;
  }

  @action
  setOfficeWeb(officeWeb: OfficeWebModel): void {
    this.officeWeb = officeWeb;
  }

  @action
  async findOfficeWeb(officeWebId: string) {
    //
    const officeWeb = await this.officeWebApi.findOfficeWeb(officeWebId);
    runInAction(() => (this.officeWeb = officeWeb));
    return officeWeb;
  }

  @action
  changeOfficeWebProps(name: string, value: string | Date | boolean | number, nameSub?: string, valueSub?: string) {
    //
    this.officeWeb = _.set(this.officeWeb, name, value);
    if (typeof value === 'object' && nameSub) {
      this.officeWeb = _.set(this.officeWeb, nameSub, valueSub);
    }
  }

  @action
  clearOfficeWeb() {
    //
    this.officeWeb = new OfficeWebModel();
  }
}

Object.defineProperty(OfficeWebService, 'instance', {
  value: new OfficeWebService(OfficeWebApi.instance, OfficeWebFlowApi.instance),
  writable: false,
  configurable: false,
});
