import { decorate, observable } from 'mobx';

import { QueryModel } from 'shared/model';

export class BadgeApproverQueryModel extends QueryModel {
  //
  searchPart: string = '';
  searchWord: string = '';

  id: string = '';
  approvingCineroomId: string = '';
  name: string = '';
  email: string = '';
  time: number = 0;
  roles: string[] = [];
}

decorate(BadgeApproverQueryModel, {
  searchPart: observable,
  searchWord: observable,
  id: observable,
  approvingCineroomId: observable,
  name: observable,
  email: observable,
  time: observable,
  roles: observable,
});
