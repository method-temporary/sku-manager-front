import { decorate, observable } from 'mobx';
import { IdName } from 'shared/model';

export class CategoryModel {
  college: IdName = new IdName();
  channel: IdName = new IdName();

  constructor(category?: CategoryModel) {
    if (category) {
      const college = (category.college && new IdName(category.college)) || this.college;
      const channel = (category.channel && new IdName(category.channel)) || this.channel;
      Object.assign(this, { college, channel });
    }
  }
}

decorate(CategoryModel, {
  college: observable,
  channel: observable,
});
