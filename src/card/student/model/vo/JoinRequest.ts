import { decorate, observable } from 'mobx';
import { JoinResponse } from './JoinResponse';


export class JoinRequest {
  //
  time: number = 0;
  response: JoinResponse = new JoinResponse();

  constructor(openRequest: JoinRequest) {
    //
    if (openRequest) Object.assign(this, { ...openRequest });
  }
}

decorate(JoinRequest, {
  time: observable,
  response: observable,
});
