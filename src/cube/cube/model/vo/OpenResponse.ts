import { decorate, observable } from 'mobx';

import { DenizenKey } from '@nara.platform/accent';

import { PatronKey } from 'shared/model';

export class OpenResponse {
  //
  email: string = '';
  name: string = '';
  remark: string = '';
  accepted: boolean = false;
  time: number = 0;
  approver: DenizenKey = new PatronKey();

  constructor(openResponse?: OpenResponse) {
    //
    if (openResponse) {
      const approver = new PatronKey(openResponse.approver);
      Object.assign(this, { ...openResponse, approver });
    }
  }
}

decorate(OpenResponse, {
  email: observable,
  name: observable,
  remark: observable,
  accepted: observable,
  time: observable,
});
