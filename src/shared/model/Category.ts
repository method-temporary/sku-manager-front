import {IdName} from './IdName';
import {decorate, observable} from 'mobx';

export class Category {
  //
  serialVersionUID: number = 0;
  college: IdName = new IdName();
  channel: IdName = new IdName();
}

decorate(Category, {
  college: observable,
  channel: observable,
});
