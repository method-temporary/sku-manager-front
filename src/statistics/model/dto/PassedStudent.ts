import { UserGroupSequenceModel } from '../../../usergroup/group/model';

export default class PassedStudent {
  //
  name: string = '';
  email: string = '';
  companyName: string = '';
  departmentName: string = '';
  membershipType: string = '';
  studentType: string = '';
  passedDate: string = '';
  collegeName: string = '';
  channelName: string = '';
  cardName: string = '';
  cubeName: string = '';
  learningTime: number = 0;
  replayLearningTime: number = 0;
  freeOfCharge: boolean = true;
  mainCategoryYn: string = '';
  searchableYn: string = '';
  userGroupSequences: UserGroupSequenceModel = new UserGroupSequenceModel();

  constructor(passedStudent?: PassedStudent) {
    if (passedStudent) {
      const userGroupSequences = new UserGroupSequenceModel(passedStudent.userGroupSequences.sequences);
      Object.assign(this, { ...passedStudent, userGroupSequences });
    }
  }
}
