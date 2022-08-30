import { decorate, observable } from 'mobx';

export class ContentsProviderTypeModel {
  id: string = '';
  title: string = '';

  constructor(contentsProviderType?: ContentsProviderTypeModel) {
    if (contentsProviderType) {
      Object.assign(this, { ...contentsProviderType });
    }
  }
}

decorate(ContentsProviderTypeModel, {
  id: observable,
  title: observable,
});
