import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { PageModel, OffsetElementList } from 'shared/model';

import AplApi from '../apiclient/AplApi';
import { AplModel } from '../../model/AplModel';
import { AplQueryModel } from '../../model/AplQueryModel';
import { AplListViewModel } from '../../model/AplListViewModel';

@autobind
export default class AplService {
  static instance: AplService;

  aplApi: AplApi;

  @observable
  preApl: AplModel = new AplModel();

  @observable
  apl: AplModel = new AplModel();

  @observable
  aplQuery: AplQueryModel = new AplQueryModel();

  @observable
  apls: OffsetElementList<AplModel> = new OffsetElementList<AplModel>();

  aplsForExcel: AplListViewModel[] = [];

  @observable
  aplSearchInit: boolean = true;

  @observable
  selectedList: string[] = [];

  constructor(aplApi: AplApi) {
    this.aplApi = aplApi;
  }

  @action
  async findAllAplsByQuery(pageModel: PageModel) {
    //
    const apls = await this.aplApi.findAllAplsByQuery(AplQueryModel.asAplRdo(this.aplQuery, pageModel));
    //arranges.results.map((arrange) => new MenuMainListViewModel(arrange));
    runInAction(() => (this.apls = apls));
    return apls;
  }

  @action
  async findAllAplsForExcel(): Promise<AplListViewModel[]> {
    //
    const apls = await this.aplApi.findAllAplsExcel(AplQueryModel.asAplRdo(this.aplQuery, new PageModel(0, 99999999)));
    runInAction(() => (this.aplsForExcel = apls));
    return apls;
  }

  @action
  async findApl(arrangeId?: string) {
    //
    const apl = await this.aplApi.findApl(arrangeId);
    runInAction(() => (this.apl = apl));
    return apl;
  }

  modifyApl(apl: AplModel) {
    //
    return this.aplApi.modifyApl(AplModel.asUdo(apl));
  }

  @action
  changeAplQueryProps(name: string, value: any) {
    if (value === '전체') value = '';
    this.aplQuery = _.set(this.aplQuery, name, value);
  }

  @action
  changeAplProps(name: string, value: any) {
    this.apl = _.set(this.apl, name, value);
  }

  @action
  clearAplQueryProps() {
    //
    this.aplQuery = new AplQueryModel();
  }

  @action
  clearApl() {
    //
    this.apl = new AplModel();
  }

  @action
  changeAplSearchInit(aplSearchInit: boolean) {
    this.aplSearchInit = aplSearchInit;
  }

  @action
  changeSelectedAplProps(selectedList: string[]) {
    //
    this.selectedList = selectedList;
  }
}

Object.defineProperty(AplService, 'instance', {
  value: new AplService(AplApi.instance),
  configurable: false,
  writable: false,
});
