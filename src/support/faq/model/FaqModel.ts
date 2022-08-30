import { decorate, observable } from 'mobx';

import { DramaEntityObservableModel, PolyglotModel } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

export default class FaqModel extends DramaEntityObservableModel {
  //
  langSupports: LangSupport[] = [];

  title: PolyglotModel = new PolyglotModel();
  content: PolyglotModel = new PolyglotModel();

  readCount: number = 0;

  pinned: boolean = false;
  deleted: boolean = false;

  registrant: string = '';
  registeredTime: number = 0;
  registrantName: PolyglotModel = new PolyglotModel();
  modifier: string = '';
  modifiedTime: number = 0;
}

decorate(FaqModel, {
  langSupports: observable,

  title: observable,
  content: observable,

  readCount: observable,

  pinned: observable,
  deleted: observable,

  // registrant: observable,
  // registeredTime: observable,
  // registrantName: observable,
  // modifier: observable,
  // modifiedTime: observable
});
