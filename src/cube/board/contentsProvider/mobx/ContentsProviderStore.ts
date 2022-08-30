import { action, computed, observable } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';

import { OffsetElementList } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

import ContentsProvider, { getEmptyContentsProvider } from '../model/ContentsProvider';
import { ContentsProviderQueryModel } from '../model/ContentsProviderQueryModel';
import ContentsProviderCdoModel from '../model/ContentsProviderCdoModel';
import ContentsProviderWithCubeCountRom from '../model/ContentsProviderWithCubeCountRom';

class ContentsProviderStore {
  static instance: ContentsProviderStore;

  constructor() {
    this.clearContentsProviderCdo = this.clearContentsProviderCdo.bind(this);
  }

  @observable
  innerContentsProviderList: OffsetElementList<ContentsProviderWithCubeCountRom> = new OffsetElementList<ContentsProviderWithCubeCountRom>();

  @action
  setContentsProviderList(next: OffsetElementList<ContentsProviderWithCubeCountRom>) {
    this.innerContentsProviderList = next;
  }

  @computed
  get contentsProviderList() {
    return this.innerContentsProviderList;
  }

  @observable
  innerSelected: ContentsProvider = getEmptyContentsProvider();

  @action
  select(next: ContentsProvider) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  contentsProviderQuery: ContentsProviderQueryModel = new ContentsProviderQueryModel();

  @action
  clearContentsProviderQuery() {
    this.contentsProviderQuery = new ContentsProviderQueryModel();
  }

  @action
  setContentsProviderQuery(
    query: ContentsProviderQueryModel,
    name: string,
    value: string | Moment | number | undefined
  ) {
    this.contentsProviderQuery = _.set(query, name, value);
  }

  @computed
  get selectedContentsProviderQuery() {
    return this.contentsProviderQuery;
  }

  @observable
  contentsProviderCdo: ContentsProviderCdoModel = new ContentsProviderCdoModel();

  @action
  clearContentsProviderCdo() {
    this.contentsProviderCdo = new ContentsProviderCdoModel();
  }

  @action
  setContentsProviderCdo(
    query: ContentsProviderCdoModel,
    name: string,
    value: string | Moment | number | LangSupport[] | undefined
  ) {
    // console.log(query);
    this.contentsProviderCdo = _.set(query, name, value);
  }

  @action
  selectContentsProviderCdo(next: ContentsProviderCdoModel) {
    this.contentsProviderCdo = next;
  }

  @computed
  get selectedContentsProviderCdo() {
    return this.contentsProviderCdo;
  }
}

ContentsProviderStore.instance = new ContentsProviderStore();

export default ContentsProviderStore;
