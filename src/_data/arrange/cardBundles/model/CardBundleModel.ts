import { LangSupport } from 'shared/components/Polyglot';
import { GroupBasedAccessRule, PolyglotModel } from 'shared/model';
import { CardBundleType } from './vo';

export default interface CardBundleModel {
  //
  cardIds: string[];
  description: PolyglotModel;
  displayOrder: number;
  displayText: PolyglotModel;
  enabled: boolean;
  groupBasedAccessRule: GroupBasedAccessRule;
  imageUrl: PolyglotModel;
  langSupports: LangSupport[];
  learningTime: number;
  likeFeedbackId: string;
  modifiedTime: number;
  modifierName: PolyglotModel;
  name: PolyglotModel;
  type: CardBundleType;
}
