import { computed, decorate, observable } from 'mobx';
import { QueryModel, PageModel } from 'shared/model';

import { UserRdo } from './UserRdo';

export class UserQueryModel extends QueryModel {
  //
  name: string = '';
  signed: string = '';
  company: string = '';
  department: string = '';
  email: string = '';
  checked: boolean = false;
  userGroupSequence: number = -1;
  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(skProfileQueryModel?: UserQueryModel) {
    super();
    if (skProfileQueryModel) Object.assign(this, { ...skProfileQueryModel });
  }

  static asSkProfileRdo(skProfileQuery: UserQueryModel, limit: number): UserRdo {
    let company = '';
    let department = '';
    let name = '';
    let email = '';
    if (skProfileQuery.searchPart === '소속사') {
      company = skProfileQuery.searchPart;
    }
    if (skProfileQuery.searchPart === '소속 조직(팀)') {
      department = skProfileQuery.searchPart;
    }
    if (skProfileQuery.searchPart === '성명') {
      name = skProfileQuery.searchPart;
    }
    if (skProfileQuery.searchPart === 'E-mail') {
      email = skProfileQuery.searchPart;
    }

    return {
      offset: skProfileQuery.offset,
      limit,
      startDate: skProfileQuery.period.startDateLong,
      endDate: skProfileQuery.period.endDateLong,
      signed: skProfileQuery.signed === 'Y' ? true : skProfileQuery.signed === 'N' ? false : undefined,
      companyCode: company !== '' ? skProfileQuery.searchWord : skProfileQuery.company,
      department: department !== '' ? skProfileQuery.searchWord : skProfileQuery.department,
      name: name !== '' ? skProfileQuery.searchWord : skProfileQuery.name,
      email: email !== '' ? skProfileQuery.searchWord : skProfileQuery.email,
      groupSequences: skProfileQuery.sequences,
      checked: skProfileQuery.checked,
    };
  }

  static asAllSkProfileRdo(skProfileQuery: UserQueryModel, pageModel: PageModel): UserRdo {
    //
    return {
      offset: pageModel.offset,
      limit: pageModel.limit,
      companyCode: skProfileQuery.company,
      name: skProfileQuery.searchPart === '성명' ? skProfileQuery.searchWord : '',
      email: skProfileQuery.searchPart === 'Email' ? skProfileQuery.searchWord : '',
    };
  }

  @computed
  get sequences() {
    //
    let sequences = '';
    this.groupSequences &&
      this.groupSequences.forEach((seq, index) => {
        index === 0 ? (sequences = seq + '') : (sequences += ',' + seq);
      });

    return sequences;
  }
}

decorate(UserQueryModel, {
  name: observable,
  signed: observable,
  company: observable,
  department: observable,
  email: observable,
  checked: observable,
  userGroupSequence: observable,
  ruleStrings: observable,
});
