import { decorate, observable } from 'mobx';
import { DenizenKey, PatronType } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';
import { ProposalState } from './ProposalState';

export class StudentCdoModel {
  //
  denizenKey?: DenizenKey = {} as DenizenKey;
  rollBookId: string = '';
  name: string = '';
  email: string = '';
  company: string = '';
  department: string = '';
  proposalState: ProposalState = ProposalState.Approved;
  programLectureUsid: string = '';
  courseLectureUsid: string = '';
  lectureUsid: string = '';
  serviceType: string = '';
  learningState: string = '';
  leaderEmails: string[] = [];
  url: string = '';

  constructor(student?: StudentCdoModel) {
    //
    if (student) {
      Object.assign(this, { ...student });
      this.denizenKey = { keyString: patronInfo.getPatronId(), patronType: PatronType.Audience } as DenizenKey;
    }
  }
}

decorate(StudentCdoModel, {
  denizenKey: observable,
  rollBookId: observable,
  name: observable,
  email: observable,
  company: observable,
  department: observable,
  proposalState: observable,
  programLectureUsid: observable,
  courseLectureUsid: observable,
});

export default StudentCdoModel;

