import { decorate, observable } from 'mobx';

export class JoinResponse {
  //
  email: string = '';
  name: string = '';
  remark: string = '';
  accepted: boolean = false;
  time: number = 0;

  constructor(openResponse?: JoinResponse) {
    //
    if (openResponse) Object.assign(this, { ...openResponse });
  }
}

decorate(JoinResponse, {
  email: observable,
  name: observable,
  remark: observable,
  accepted: observable,
  time: observable,
});
