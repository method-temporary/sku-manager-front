import { decorate, observable } from 'mobx';

export class PostTypeModel {
  id: string = '';
  title: string = '';

  constructor(postType?: PostTypeModel) {
    if (postType) {
      Object.assign(this, { ...postType });
    }
  }
}

decorate(PostTypeModel, {
  id: observable,
  title: observable,
});
