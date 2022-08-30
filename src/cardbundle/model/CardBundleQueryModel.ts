import { decorate, observable } from 'mobx';

import { PageModel, QueryModel } from 'shared/model';
import { LangSupport, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

import { CardBundleRdo } from '../../_data/arrange/cardBundles/model';
import { CardBundleType } from '../../_data/arrange/cardBundles/model/vo';

export class CardBundleQueryModel extends QueryModel {
  //
  tempOption: string = '';
  enabled: string = ' ';

  groupBasedAccessRule: number[] = [];
  ruleStrings: string = '';

  types: CardBundleType[] = [];
  keyword: string = '';

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  static asBardBundleCdoModel(cardBundleQuery: CardBundleQueryModel, pageModel: PageModel): CardBundleRdo {
    //
    const enableBoolean =
      cardBundleQuery.enabled === ' ' ? undefined : (cardBundleQuery.enabled === 'true' && true) || false;

    return {
      enabled: enableBoolean,
      offset: pageModel.offset,
      limit: pageModel.limit,
      groupSequences: cardBundleQuery.groupBasedAccessRule.map((sequence) => sequence),
      types: cardBundleQuery.types.map((type) => type),
      keyword: cardBundleQuery.keyword,
    };
  }
}

decorate(CardBundleQueryModel, {
  tempOption: observable,
  enabled: observable,
  groupBasedAccessRule: observable,
  ruleStrings: observable,
  types: observable,
  keyword: observable,
});
