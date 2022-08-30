import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel, IdName, GroupBasedAccessRule } from 'shared/model';
import { PageElementPosition, PageElementType } from './vo';

export class PageElementModel extends DramaEntityObservableModel {
  //
  checked: boolean = false;
  position: PageElementPosition = PageElementPosition.Select;
  type: PageElementType = PageElementType.Default;
  creator: IdName = new IdName();
  time: Date = new Date();
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  constructor(pageElement?: PageElementModel) {
    //
    super();

    if (pageElement) {
      const time = pageElement.time;
      const groupBasedAccessRule = new GroupBasedAccessRule(pageElement.groupBasedAccessRule);
      Object.assign(this, { ...pageElement, groupBasedAccessRule, time });
    }
  }
}

decorate(PageElementModel, {
  checked: observable,
  position: observable,
  type: observable,
  creator: observable,
  time: observable,
  groupBasedAccessRule: observable,
});
