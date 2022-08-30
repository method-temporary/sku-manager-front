import { action, computed, observable } from 'mobx';
import { PolyglotModel } from '../../shared/model';
import { CardState } from '../../_data/lecture/cards/model/vo';
import { SurveyFormModel } from '../../survey';

class CardDetailStore {
  //
  static instance: CardDetailStore;

  @observable
  readonly: boolean = true;

  @observable
  activeIndex: number = 1;

  @observable
  loaderPage: boolean = false;

  @observable
  registeredTime: number = 0;

  @observable
  registrantName: PolyglotModel = new PolyglotModel();

  @observable
  approvalInfo: string = '';

  @observable
  cardState: CardState = '';

  // Loading
  @observable
  isDetailLoading: boolean = false;

  @observable
  cardSurveyFrom: SurveyFormModel = new SurveyFormModel();

  @action.bound
  setReadonly(readonly: boolean) {
    this.readonly = readonly;
  }

  @action.bound
  setActiveIndex(activeIndex: number) {
    this.activeIndex = activeIndex;
  }

  @action.bound
  setRegisteredTime(registeredTime: number) {
    //
    this.registeredTime = registeredTime;
  }

  @action.bound
  setRegistrantName(registrantName: PolyglotModel) {
    //
    this.registrantName = registrantName;
  }

  @action.bound
  setApprovalInfo(approvalInfo: string) {
    //
    this.approvalInfo = approvalInfo;
  }

  @action.bound
  setCardState(cardState: CardState) {
    //
    this.cardState = cardState;
  }

  @action.bound
  setIsDetailLoading(isDetailLoading: boolean) {
    this.isDetailLoading = isDetailLoading;
  }

  @action.bound
  setDetailPageLoading(active: boolean) {
    this.isDetailLoading = active;
    this.loaderPage = active;
  }

  @action.bound
  setCardSurveyFrom(cardSurveyFrom: SurveyFormModel) {
    //
    this.cardSurveyFrom = cardSurveyFrom;
  }

  @computed
  get questions() {
    return this.cardSurveyFrom.questions;
  }

  @action.bound
  reset() {
    //
    this.readonly = true;
    this.activeIndex = 0;
    this.loaderPage = false;
    this.registeredTime = 0;
    this.registrantName = new PolyglotModel();
    this.approvalInfo = '';
    this.cardState = '';
    this.isDetailLoading = false;
  }
}

CardDetailStore.instance = new CardDetailStore();
export default CardDetailStore;
