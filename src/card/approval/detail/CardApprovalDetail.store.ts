import { action, observable } from 'mobx';
import { PolyglotModel } from '../../../shared/model';

class CardApprovalDetailStore {
  //
  static instance: CardApprovalDetailStore;

  @observable
  activeIndex: number = 0;

  @observable
  cardState: string = '';

  @observable
  email: string = '';

  @observable
  remark: string = '';

  @observable
  newRemark: string = '';

  @observable
  isApprovalDetailLoading: boolean = false;

  @action.bound
  setActiveIndex(activeIndex: number) {
    //
    this.activeIndex = activeIndex;
  }

  @action.bound
  setCardState(cardState: string) {
    //
    this.cardState = cardState;
  }

  @action.bound
  setEmail(email: string) {
    //
    this.email = email;
  }

  @action.bound
  setRemark(remark: string) {
    //
    this.remark = remark;
  }

  @action.bound
  setNewRemark(newRemark: string) {
    //
    this.newRemark = newRemark;
  }

  @action.bound
  setIsApprovalDetailLoading(isApprovalDetailLoading: boolean) {
    //
    this.isApprovalDetailLoading = isApprovalDetailLoading;
  }
}

CardApprovalDetailStore.instance = new CardApprovalDetailStore();
export default CardApprovalDetailStore;
