import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';
import { NameValueList, OffsetElementList, PolyglotModel } from 'shared/model';

import CardBundleApi from '_data/arrange/cardBundles/api/CardBundleApi';
import { getInitCardBundleRdo } from '_data/arrange/cardBundles/shared/util';
import { CardBundleCdo, CardBundleRdo, CardBundleModel } from '_data/arrange/cardBundles/model';

import { CardBundleQueryModel } from '../../model/CardBundleQueryModel';
import { getInitCardBundleFormModel } from '../../shared/util';
import { CardBundleFormModel } from './CardBundleFormModel';
import { fromCardBundleFormModel } from '../../shared/util/cardbunldle.util';
import { CardBundleModifyModel, CardBundleMobileOrderType } from './CardBundleModifyModel';

@autobind
export default class CardBundleService {
  //
  static instance: CardBundleService;

  cardBundleApi: CardBundleApi;

  @observable
  cardBundleRdo: CardBundleRdo = getInitCardBundleRdo();

  @observable
  cardBundleForm: CardBundleFormModel = getInitCardBundleFormModel();

  @observable
  cardBundleForms: CardBundleFormModel[] = [];

  @observable
  cardBundleQuery: CardBundleQueryModel = new CardBundleQueryModel();

  @observable
  fileName: PolyglotModel = new PolyglotModel();

  @observable
  cardBundleMobileOrderType: CardBundleMobileOrderType = 'Sequence';

  constructor(cardBundleApi: CardBundleApi) {
    this.cardBundleApi = cardBundleApi;
  }

  async registerCardBundle(cardBundleCdo: CardBundleCdo): Promise<string> {
    //
    return this.cardBundleApi.registerCardBundle(cardBundleCdo);
  }

  @action
  async findAllCardBundles(cardBundleRdo: CardBundleRdo): Promise<OffsetElementList<CardBundleModel>> {
    //
    console.log(cardBundleRdo);

    const offsetElementList = await this.cardBundleApi.findAllCardBundles(cardBundleRdo);
    runInAction(() => {
      this.cardBundleForms = offsetElementList.results.map((cardBundle) => fromCardBundleFormModel(cardBundle));
    });

    return offsetElementList;
  }

  @action
  async findCardBundle(cardBundleId: string): Promise<CardBundleModel> {
    //
    const cardBundle = await this.cardBundleApi.findCardBundle(cardBundleId);
    runInAction(() => {
      this.cardBundleForm = fromCardBundleFormModel(cardBundle);
    });
    return cardBundle;
  }

  async modifyCardBundle(cardBundleId: string, nameValueList: NameValueList): Promise<string> {
    //
    return this.cardBundleApi.modifyCardBundle(cardBundleId, nameValueList);
  }

  @action
  changeCardBundleRdoProps(name: string, value: any) {
    //
    this.cardBundleRdo = _.set(this.cardBundleRdo, name, value);
  }

  @action
  changeCardBundleFormProps(name: string, value: any) {
    //
    this.cardBundleForm = _.set(this.cardBundleForm, name, value);
  }

  @action
  changeCardBundleQueryProps(name: string, value: any) {
    if (value === '전체') value = '';
    this.cardBundleQuery = _.set(this.cardBundleQuery, name, value);
  }

  @action
  changeTargetCardBundleProps(index: number, name: string, value: any) {
    // 체크박스 이벤트 처리 함수
    this.cardBundleForms = _.set(this.cardBundleForms, `[${index}].${name}`, value);
  }

  @action
  changeCardBundleSequence(
    cardBundleForms: CardBundleFormModel[],
    cardBundleForm: CardBundleFormModel,
    oldSeq: number,
    newSeq: number
  ) {
    //
    if (newSeq > -1 && newSeq < cardBundleForms.length) {
      const displayOder = this.cardBundleForms.indexOf(cardBundleForm);
      const changeDisplayOder = this.cardBundleForms.indexOf(cardBundleForms[newSeq]);

      const tmp = this.cardBundleForms[displayOder];
      this.cardBundleForms[displayOder] = this.cardBundleForms[changeDisplayOder];
      this.cardBundleForms[changeDisplayOder] = tmp;

      // this.cardBundleForms.find((item) => item === cardBundleForm);

      // this.cardBundleForms.splice(oldSeq, 1);
      // this.cardBundleForms.splice(newSeq, 0, cardBundleForm);
    }
  }

  @action
  changeCardBundleMobileOrderType(cardBundleMobileOrderType: CardBundleMobileOrderType) {
    this.cardBundleMobileOrderType = cardBundleMobileOrderType;
  }

  @action
  changeCardBundleFiltered(filteredCardBundleForm: CardBundleFormModel[]) {
    this.cardBundleForms = filteredCardBundleForm;
  }

  async modifyCardBundlesDisplayOrder(params: CardBundleModifyModel): Promise<string> {
    //
    return this.cardBundleApi.modifyCardBundlesDisplayOrder(params);
  }

  async enableCardBundles(cardIds: string[]): Promise<string> {
    //
    return this.cardBundleApi.enableCardBundles(cardIds);
  }

  async disableCardBundles(cardIds: string[]): Promise<string> {
    //
    return this.cardBundleApi.disableCardBundles(cardIds);
  }

  async removeCardBundles(cardBundleIds: string[]): Promise<string> {
    //
    return this.cardBundleApi.removeCardBundles(cardBundleIds);
  }
  // --------------------------------------------------

  @action
  clearCardBundle() {
    this.cardBundleForm = getInitCardBundleFormModel();
  }

  @action
  clearCardBundles() {
    this.cardBundleForms = [];
  }

  @action
  clearCardBundleQuery() {
    this.cardBundleQuery = new CardBundleQueryModel();
  }

  // ----------------------------------------------------------------------------

  @action
  clearFileName() {
    //
    this.fileName = new PolyglotModel();
  }

  @action
  changeFileName(name: PolyglotModel) {
    this.fileName = name;
  }
}

Object.defineProperty(CardBundleService, 'instance', {
  value: new CardBundleService(CardBundleApi.instance),
  writable: false,
  configurable: false,
});
