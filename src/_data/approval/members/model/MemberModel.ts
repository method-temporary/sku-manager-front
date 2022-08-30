import { decorate, observable } from 'mobx';

import { DramaEntityObservableModel, PolyglotModel } from 'shared/model';
import { LangSupport, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { MemberState } from './vo';

export default class MemberModel extends DramaEntityObservableModel {
  //
  name: PolyglotModel = new PolyglotModel();
  employeeId: string = '';
  rank: string = '';
  title: string = '';
  duty: string = '';
  email: string = '';
  phone: string = '';
  registeredTime: number = 0;
  modifiedTime: number = 0;
  companyCode: string = '';
  companyName: PolyglotModel = new PolyglotModel();
  departmentCode: string = '';
  departmentName: PolyglotModel = new PolyglotModel();

  chartDisplayed: boolean = false;
  displayOrder: string = '';
  retired: boolean = false;
  photoFileUrl: string = '';

  userGroupSequences: string = '';
  state: MemberState = MemberState.Active;

  memberName: string = '';

  titleCode: string = '';
  imPhotoUrl: string = '';
  modifier: string = '';

  langSupports: LangSupport[] = [];

  constructor(member?: MemberModel) {
    //
    super();
    if (member) {
      //
      const name = (member.name && new PolyglotModel(member.name)) || this.name;
      const companyName = (member.companyName && new PolyglotModel(member.companyName)) || this.companyName;
      const departmentName = (member.departmentName && new PolyglotModel(member.departmentName)) || this.departmentName;

      const memberName = getPolyglotToAnyString(name) || '';

      Object.assign(this, {
        ...member,
        name,
        companyName,
        departmentName,
        memberName,
      });
    }
  }
}

decorate(MemberModel, {
  entityVersion: observable,
  id: observable,
  patronKey: observable,
  name: observable,
  employeeId: observable,
  rank: observable,
  title: observable,
  duty: observable,
  email: observable,
  phone: observable,
  registeredTime: observable,
  modifiedTime: observable,
  companyCode: observable,
  companyName: observable,
  departmentCode: observable,
  departmentName: observable,
  chartDisplayed: observable,
  displayOrder: observable,
  retired: observable,
  photoFileUrl: observable,
  userGroupSequences: observable,
  state: observable,

  memberName: observable,
  titleCode: observable,
  imPhotoUrl: observable,
  modifier: observable,

  langSupports: observable,
});
