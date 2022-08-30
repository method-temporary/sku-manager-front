import { decorate, observable } from 'mobx';

import { DenizenKey } from '@nara.platform/accent';

import { PatronKey, DramaEntityObservableModel, NameValueList, ProposalState } from 'shared/model';

export default class StudentApprovalModel extends DramaEntityObservableModel {
  //
  approval: DenizenKey = new PatronKey();
  proposalState: ProposalState = ProposalState.All;
  remark: string = '';
  time: number = 0;

  constructor(studentApproval?: StudentApprovalModel) {
    //
    super();
    if (studentApproval) {
      Object.assign(this, { ...studentApproval });
    }
  }

  static asNameValues(studentApproval: StudentApprovalModel): NameValueList {
    //
    return {
      nameValues: [
        {
          name: 'remark',
          value: studentApproval.remark,
        },
      ],
    };
  }
}

decorate(StudentApprovalModel, {
  approval: observable,
  proposalState: observable,
  remark: observable,
  time: observable,
});
