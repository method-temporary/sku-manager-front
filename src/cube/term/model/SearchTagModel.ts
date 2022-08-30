import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel } from 'shared/model';

import { CreatorModel } from './CreatorModel';

export class SearchTagModel extends DramaEntityObservableModel {
  //
  tag: string = '';
  keywords: string = '';
  registrant: CreatorModel = new CreatorModel();
  modifier: CreatorModel = new CreatorModel();
  registeredTime: number = 0;
  modifiedTime: number = 0;

  constructor(searchTag?: SearchTagModel) {
    super();
    if (searchTag) {
      const registrant = new CreatorModel(searchTag.registrant);
      const modifier = new CreatorModel(searchTag.modifier);
      Object.assign(this, { ...searchTag, registrant, modifier });
    }
  }
}

decorate(SearchTagModel, {
  tag: observable,
  keywords: observable,
  registrant: observable,
  modifier: observable,
  registeredTime: observable,
  modifiedTime: observable,
});
