import { decorate, observable } from 'mobx';
import { CardOpenResponse } from 'card/card/model/vo/CardOpenResponse';

export class OpenRequest {
  //
  time: number = 0;
  response: CardOpenResponse = new CardOpenResponse();

  constructor(cardOpenRequest?: OpenRequest) {
    //
    if (cardOpenRequest) {
      const response = (cardOpenRequest.response && new CardOpenResponse(cardOpenRequest.response)) || this.response;
      Object.assign(this, { ...cardOpenRequest, response });
    }
  }
}

decorate(OpenRequest, {
  time: observable,
  response: observable,
});
