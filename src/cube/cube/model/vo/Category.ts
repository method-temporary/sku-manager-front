import { decorate, observable } from 'mobx';

export class Category {
  //
  collegeId: string = '';
  channelId: string = '';
  mainCategory: boolean = false;

  constructor(cubeCategory?: Category) {
    //
    if (cubeCategory) {
      Object.assign(this, { ...cubeCategory });
    }
  }
}

decorate(Category, {
  collegeId: observable,
  channelId: observable,
  mainCategory: observable,
});
