import { decorate, observable } from 'mobx';
import { OpenResponseModel } from './OpenResponseModel';

export class OpenRequestModel {
  time: number = 0;
  response: OpenResponseModel = new OpenResponseModel();

  constructor(openRequest?: OpenRequestModel) {
    if (openRequest) {
      const response = openRequest.response && new OpenResponseModel(openRequest.response) || this.response;
      Object.assign(this, { ...openRequest, response });
    }
  }
}

decorate(OpenRequestModel, {
  time: observable,
  response: observable,
});
