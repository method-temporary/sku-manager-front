import { decorate, observable } from 'mobx';
import { OpenResponseModel } from './OpenResponseModel';

export class BadgeOpenRequestModel {
  //
  time: number = 0;
  response: OpenResponseModel = new OpenResponseModel();

  constructor(openRequest?: BadgeOpenRequestModel) {
    //
    if (openRequest) {
      const response = (this.response && new OpenResponseModel(openRequest.response)) || this.response;
      Object.assign(this, { ...openRequest, response });
    }
  }
}

decorate(BadgeOpenRequestModel, {
  time: observable,
  response: observable,
});
