import { action, observable, runInAction } from 'mobx';
import { SubtitleModel } from '../../model/SubtitleModel';
import { SubtitleUdoModel } from '../../model/SubtitleUdoModel';
import autobind from 'autobind-decorator';
import SubtitleApi from '../apliclient/SubtitleApi';
import _ from 'lodash';

@autobind
export default class SubtitleService {
  //
  static instance: SubtitleService;

  subtitleApi: SubtitleApi

  @observable
  subtitleModel: SubtitleModel = new SubtitleModel();

  constructor(subtitleApi: SubtitleApi) {
    //
    this.subtitleApi = subtitleApi;
  }

  @action
  async findSubtitle(deliveryId: string, locale: string) {
    //
    const subtitleModel = await this.subtitleApi.findSubtitle(deliveryId, locale);
    return runInAction(
      () => (this.subtitleModel = new SubtitleModel(subtitleModel))
    );
  }

  @action
  claer() {
    //
    this.subtitleModel = new SubtitleModel();
  }

  @action
  async registerSubtitle() {

    const subtitleCdoModel = SubtitleModel.asSubtitleCdo(this.subtitleModel);
    return this.subtitleApi.registerSubtitle(subtitleCdoModel);

  }

  @action
  async modifySubtitle() {
    //
    const subtitleUdo: SubtitleUdoModel = {
      subtitleNameValues: SubtitleModel.getNameValueList(this.subtitleModel)
    }

    return this.subtitleApi.modifySubtitle(this.subtitleModel.deliveryId, this.subtitleModel.locale, subtitleUdo)
  }


  @action
  async removeSubtitle() {
    //
    return this.subtitleApi.removeSubtitle(this.subtitleModel.deliveryId, this.subtitleModel.locale)
  }

}


Object.defineProperty(SubtitleService, 'instance', {
  value: new SubtitleService(SubtitleApi.instance),
  writable: false,
  configurable: false,
});
