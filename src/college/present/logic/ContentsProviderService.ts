import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';

import { NameValueList, SelectTypeModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { ContentsProviderModel } from '../../model/ContentsProviderModel';
import ContentsProviderApi from '../apiclient/ContentsProviderApi';

@autobind
export default class ContentsProviderService {
  //
  static instance: ContentsProviderService;

  contentsProviderApi: ContentsProviderApi;

  @observable
  contentsProvider: ContentsProviderModel = new ContentsProviderModel();

  @observable
  contentsProviders: ContentsProviderModel[] = [];

  @observable
  selectTypeContentsProviders: SelectTypeModel[] = [];

  constructor(contentsProviderApi: ContentsProviderApi) {
    this.contentsProviderApi = contentsProviderApi;
  }

  @action
  async findContentsProvider(contentsProviderId: string) {
    //
    const contentsProvider = await this.contentsProviderApi.findContentsProvider(contentsProviderId);
    if (contentsProvider)
      return runInAction(() => (this.contentsProvider = new ContentsProviderModel(contentsProvider)));
    return null;
  }

  @action
  async findAllContentsProviders() {
    //
    const contentsProviders = await this.contentsProviderApi.findAllContentsProviders();
    return runInAction(
      () =>
        (this.contentsProviders = contentsProviders.map(
          (contentsProvider) => new ContentsProviderModel(contentsProvider)
        ))
    );
  }

  @action
  async findAllContentsProvidersToSelectType(all: boolean = true) {
    //
    const contentsProviders = await this.contentsProviderApi.findAllContentsProviders();
    runInAction(() => {
      const contentsProvidersTemp = [];
      all && contentsProvidersTemp.push(new SelectTypeModel());
      contentsProviders.forEach((contentsProvider) => {
        contentsProvidersTemp.push(
          new SelectTypeModel(contentsProvider.id, getPolyglotToAnyString(contentsProvider.name), contentsProvider.id)
        );
      });
      this.selectTypeContentsProviders = contentsProvidersTemp;
    });
  }

  modifyContentsProvider(contentsProviderId: string, nameValues: NameValueList) {
    //
    this.contentsProviderApi.modifyContentsProvider(contentsProviderId, nameValues);
  }

  removeContentsProvider(contentsProviderId: string) {
    //
    this.contentsProviderApi.removeContentsProvider(contentsProviderId);
  }

  @action
  clearContentsProvider() {
    //
    this.contentsProvider = new ContentsProviderModel();
  }
}

Object.defineProperty(ContentsProviderService, 'instance', {
  value: new ContentsProviderService(ContentsProviderApi.instance),
  writable: false,
  configurable: false,
});
