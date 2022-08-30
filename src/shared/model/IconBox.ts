import { decorate, observable } from 'mobx';
import { IconType } from './IconType';

export class IconBox {
  //
  iconType: IconType = IconType.SKUniversity;
  iconUrl: string = '';
  baseUrl: string = '';

  constructor(iconBox?: IconBox) {
    //
    if (iconBox) {
      //
      Object.assign(this, { ...iconBox });
    }
  }
}

decorate(IconBox, {
  iconType: observable,
  iconUrl: observable,
  baseUrl: observable,
});
