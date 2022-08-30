import { QueryModel } from 'shared/model';
import { decorate, observable } from 'mobx';
import { PageElementRdo } from '_data/arrange/pageElements/model';
import { PageElementPosition, PageElementType } from '_data/arrange/pageElements/model/vo';

export class PageElementQueryModel extends QueryModel {
  //
  position: PageElementPosition = PageElementPosition.Select;
  type: PageElementType = PageElementType.Category;
  groupBasedAccessRule: number[] = [];
  ruleStrings: string = '';

  static asPageElementRdo(pageElementQuery: PageElementQueryModel): PageElementRdo {
    return {
      limit: pageElementQuery && pageElementQuery.limit,
      groupSequences: pageElementQuery.groupBasedAccessRule.map((accessRule) => accessRule),
      offset: (pageElementQuery && pageElementQuery.offset) || 0,
      position: pageElementQuery.position,
      type: pageElementQuery.type,
    };
  }
}

decorate(PageElementQueryModel, {
  position: observable,
  groupBasedAccessRule: observable,
  ruleStrings: observable,
});
