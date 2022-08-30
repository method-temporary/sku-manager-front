import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import { Moment } from 'moment';

import { OffsetElementList } from '@nara.platform/accent';

import { NewDatePeriod } from 'shared/model';

import MediaApi from '../apiclient/MediaApi';
import MediaFlowApi from '../apiclient/MediaFlowApi';
import { PanoptoCdoModel } from '../../model/old/PanoptoCdoModel';
import { PanoptoQueryModel } from '../../model/old/PanoptoQueryModel';
import { InternalMediaConnectionModel } from '../../model/old/InternalMediaConnectionModel';
import { MediaModel } from '../../model/MediaModel';

@autobind
export default class MediaService {
  //
  static instance: MediaService;

  mediaApi: MediaApi;
  mediaFlowApi: MediaFlowApi;

  @observable
  media: MediaModel = new MediaModel();

  @observable
  medias: MediaModel[] = [];

  @observable
  panoptoCubeQuery: PanoptoQueryModel = new PanoptoQueryModel();

  @observable
  panoptoCdo: PanoptoCdoModel = new PanoptoCdoModel();

  @observable
  panoptos: OffsetElementList<InternalMediaConnectionModel> = {
    results: [],
    totalCount: 0,
  } as OffsetElementList<InternalMediaConnectionModel>;

  @observable
  panopto: InternalMediaConnectionModel = new InternalMediaConnectionModel();

  @observable
  selectedPanoptos: InternalMediaConnectionModel[] = [];

  @observable
  selectedPanoptoIds: string[] = [];

  @observable
  uploadedPaonoptos: InternalMediaConnectionModel[] = [];

  constructor(mediaApi: MediaApi, mediaFlowApi: MediaFlowApi) {
    this.mediaApi = mediaApi;
    this.mediaFlowApi = mediaFlowApi;
  }

  @action
  async findMedia(mediaId: string) {
    //
    const media = await this.mediaApi.findMedia(mediaId);
    return runInAction(() => (this.media = new MediaModel(media)));
  }

  @action
  setMedia(media: MediaModel): void {
    this.media = media;
  }

  @action
  changeMediaProps(name: string, value: string | Date | any[], nameSub?: string, valueSub?: string) {
    //
    this.media = _.set(this.media, name, value);
    if (typeof value === 'object' && nameSub) {
      this.media = _.set(this.media, nameSub, valueSub);
    }
  }

  @action
  changeMediaDateProps(name: string, value: Moment) {
    //
    const stringDate = value.format('YYYY-MM-DD');

    this.media = _.set(this.media, name, value);
    this.media = _.set(this.media, name.replace('Moment', ''), stringDate);
  }

  @action
  setSeletedPanoptos(panoptoList: InternalMediaConnectionModel[]) {
    //
    this.selectedPanoptos = panoptoList;
  }

  @action
  setUploadedPanoptos(panoptoList: InternalMediaConnectionModel[]) {
    //
    this.uploadedPaonoptos = panoptoList;
  }

  @action
  setSeletedPanoptoIds(panoptoIdList: string[]) {
    //
    this.selectedPanoptoIds = panoptoIdList;
  }

  @action
  clearMedia() {
    //
    this.media = new MediaModel();
  }

  @action
  async initPanoptoList() {
    this.changePanoptoCdoProps('startDate', this.panoptoCdo.period?.startDateLong || '');
    this.changePanoptoCdoProps('endDate', this.panoptoCdo.period?.endDateLong || '');

    const parsePanoptoCdo = {
      currentPage: this.panoptoCdo.currentPage,
      page_size: this.panoptoCdo.page_size,
      folderId: this.panoptoCdo.folderId,
      folderOwnerId: this.panoptoCdo.folderOwnerId,
      sessionState: this.panoptoCdo.sessionState,
      searchQuery: this.panoptoCdo.searchQuery,
      sessionName: this.panoptoCdo.sessionName,
      college: this.panoptoCdo.college,
      startDate: this.panoptoCdo.startDate,
      endDate: this.panoptoCdo.endDate,
      period: {} as NewDatePeriod,
    };

    const panoptos = await this.mediaApi.findPanoptoList(parsePanoptoCdo);
    runInAction(() => (this.panoptos = panoptos));
    return panoptos;
  }

  @action
  async findPanoptoList() {
    //
    // const panoptos = await this.testApi.findPanoptoList(this.panoptoCdo);
    this.changePanoptoCdoProps('startDate', this.panoptoCdo.period.startDateLong);
    this.changePanoptoCdoProps('endDate', this.panoptoCdo.period.endDateLong);

    const panoptos = await this.mediaApi.findPanoptoList(this.panoptoCdo);
    runInAction(() => (this.panoptos = panoptos));
    return panoptos;
  }

  @action
  async findPanoptoDatelessList() {
    //
    const panoptos = await this.mediaApi.findPanoptoList(this.panoptoCdo);
    runInAction(() => (this.panoptos = panoptos));
    return panoptos;
  }

  @action
  changePanoptoCdoProps(name: string, value: string | number | Moment) {
    //
    this.panoptoCdo = _.set(this.panoptoCdo, name, value);
  }

  @action
  setPanoptoProps(selectedPanopto: InternalMediaConnectionModel) {
    //
    this.panopto = selectedPanopto;
  }

  @action
  clearPanopto() {
    //
    this.panopto = new InternalMediaConnectionModel();
  }

  @action
  clearPanoptos() {
    //
    this.panoptos = { results: [], totalCount: 0 } as OffsetElementList<InternalMediaConnectionModel>;
  }

  @action
  clearPanoptoCdo() {
    //
    this.panoptoCdo = new PanoptoCdoModel();
  }

  @action
  clearSelectedPanoptoCdo() {
    //
    this.selectedPanoptos = [];
  }

  @action
  clearUploadedPanoptoCdo() {
    //
    this.uploadedPaonoptos = [];
  }

  @action
  clearselectedPanoptoIds() {
    //
    this.selectedPanoptoIds = [];
  }
}

Object.defineProperty(MediaService, 'instance', {
  value: new MediaService(MediaApi.instance, MediaFlowApi.instance),
  writable: false,
  configurable: false,
});
