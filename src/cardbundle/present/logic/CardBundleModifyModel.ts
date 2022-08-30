import { CardBundleType } from './../../../_data/arrange/cardBundles/model/vo/CardBundleType';

export interface CardBundleModifyModel {
  cardBundleIdAndTypes: cardBundleIdAndType[];
  cardBundleMobileOrderType?: CardBundleMobileOrderType;
}

export type CardBundleMobileOrderType = 'Sequence' | 'Random' | '';

export interface cardBundleIdAndType {
  cardBundleType: CardBundleType;
  id: string;
}
