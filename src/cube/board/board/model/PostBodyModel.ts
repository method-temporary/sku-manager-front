import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel } from 'shared/model';

export class PostBodyModel extends DramaEntityObservableModel {
  //
  contents: string = '';
  fileBoxId: string = '';

  constructor(postBody?: PostBodyModel) {
    super();
    if (postBody) {
      Object.assign(this, { ...postBody });
    }
  }
}

decorate(PostBodyModel, {
  contents: observable,
  fileBoxId: observable,
});
