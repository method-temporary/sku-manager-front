import { decorate, observable } from 'mobx';

import { PatronType } from '@nara.drama/depot';

import { PatronKey } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { MemberModel } from '../../../_data/approval/members/model';

export class OperatorModel {
  employeeId: string = '';
  email: string = '';
  name: string = '';
  company: string = '';

  patronKey: PatronKey = new PatronKey();

  constructor(operator?: OperatorModel) {
    if (operator) {
      Object.assign(this, { ...operator });
    }
  }

  static fromMemberModel(member: MemberModel): OperatorModel {
    //
    return new OperatorModel({
      employeeId: member.employeeId,
      email: member.email,
      company: member.companyCode,
      // name: MemberViewModel.getLanguageStringByLanguage(member.name, 'ko'),
      name: getPolyglotToAnyString(member.name),
      patronKey: { keyString: member.id, patronType: PatronType.Denizen },
    });
  }
}

decorate(OperatorModel, {
  employeeId: observable,
  email: observable,
  name: observable,
  company: observable,
});
