import { decorate, observable } from 'mobx';

import { PolyglotModel, GroupBasedAccessRule, PatronKey } from 'shared/model';
import { LangSupport, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

import { CardBundleType } from '_data/arrange/cardBundles/model/vo';

export class CardBundleFormModel {
  //
  cardIds: string[] = [];
  description: PolyglotModel = new PolyglotModel();
  displayOrder: number = 0;
  displayText: PolyglotModel = new PolyglotModel();
  enabled: boolean = true;
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();
  imageUrl: PolyglotModel = new PolyglotModel();
  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];
  learningTime: number = 0;
  likeFeedbackId: string = '';
  modifiedTime: number = 0;
  modifierName: PolyglotModel = new PolyglotModel();
  name: PolyglotModel = new PolyglotModel();
  type: CardBundleType = CardBundleType.Normal;
  id: string = '';
  checked: boolean = false;
  patronKey: PatronKey = new PatronKey();
}

decorate(CardBundleFormModel, {
  name: observable,
  displayText: observable,
  enabled: observable,
  displayOrder: observable,
  type: observable,
  modifierName: observable,
  modifiedTime: observable,
  imageUrl: observable,
  description: observable,
  cardIds: observable,
  learningTime: observable,
  groupBasedAccessRule: observable,

  checked: observable,
  langSupports: observable,
});
