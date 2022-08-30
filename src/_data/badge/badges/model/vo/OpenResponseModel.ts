import { decorate, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';

export class OpenResponseModel {
  //
  approverName: PolyglotModel = new PolyglotModel();
  approverId: string = '';
  remark: string = '';
  accepted: boolean = false;
  time: number = 0;

  constructor(openResponse?: OpenResponseModel) {
    //
    if (openResponse) Object.assign(this, { ...openResponse });
  }
}

decorate(OpenResponseModel, {
  approverName: observable,
  approverId: observable,
  remark: observable,
  accepted: observable,
  time: observable,
});
