import { QueryModel } from 'shared/model';
import { decorate, observable } from 'mobx';

export default class UserWorkspaceManagerQueryModel extends QueryModel {
  //
  email: string = '';
  name: string = '';
  cineroomId: string = '';
}

decorate(UserWorkspaceManagerQueryModel, {
  email: observable,
  name: observable,
  cineroomId: observable,
});
