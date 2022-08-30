import { decorate, observable } from 'mobx';

export class CardAdminRdo {
  //
  offset: number = 0;
  limit: number = 0;

  name: string = '';
  collegeId: string = '';
  channelId: string = '';
  registrantName: string = '';
  cineroomId: string = '';
  startDate: number = 0;
  endDate: number = 0;
  searchable?: boolean = false;

  sharedOnly: boolean = false;

  constructor(cardRdo?: CardAdminRdo) {
    //
    if (cardRdo) {
      Object.assign(this, { ...cardRdo });
    }
  }
}

decorate(CardAdminRdo, {
  offset: observable,
  limit: observable,

  name: observable,
  collegeId: observable,
  channelId: observable,
  registrantName: observable,
  cineroomId: observable,
  startDate: observable,
  endDate: observable,

  // hasStamp: observable,
  // cardState: observable,
  // searchable: observable,
  // myCineroomOnlu: observable,
});
