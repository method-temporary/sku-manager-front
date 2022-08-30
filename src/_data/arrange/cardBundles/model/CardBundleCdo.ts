import { PolyglotModel, GroupBasedAccessRule } from 'shared/model';
import { LangSupport, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

import { CardBundleType } from './vo';

export class CardBundleCdo {
  //
  name: PolyglotModel = new PolyglotModel();
  displayText: PolyglotModel = new PolyglotModel();
  enabled: boolean = true;

  imageUrl: PolyglotModel = new PolyglotModel();
  description: PolyglotModel = new PolyglotModel();
  type: CardBundleType = CardBundleType.Normal;
  displayOrder: number = 0;

  cardIds: string[] = [];
  learningTime: number = 0;
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];
}
