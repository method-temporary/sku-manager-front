import { decorate, observable } from 'mobx';
import { PatronKey } from 'shared/model';
import { DenizenKey } from '@nara.platform/accent';

export class CardOpenResponse {
  //
  approver: DenizenKey = new PatronKey();
  accepted: boolean = true;
  remark: string = '';
  time: number = 0;

  constructor(cardOpenResponse?: CardOpenResponse) {
    //
    if (cardOpenResponse) Object.assign(this, { ...cardOpenResponse });
  }
}

decorate(CardOpenResponse, {
  approver: observable,
  accepted: observable,
  time: observable,
});
