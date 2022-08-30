import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import { PageModel } from 'shared/model';

import { InstructorSdo } from '_data/user/instructors/model/InstructorSdo';

import { yesNoToBoolean } from 'card/card/ui/logic/CardHelper';

export class InstructorSdoModel extends QueryModel {
  //
  startDate: number = 0; // 등록일자
  endDate: number = 0; // 등록일자

  college: string = ''; // College
  internal: string | undefined = ''; // 강사 구분
  resting: string | undefined = ''; // 활동 여부

  email: string = ''; // email
  name: string = ''; // 이름
  position: string = ''; // 직위

  constructor(instructorSdoModel?: InstructorSdoModel) {
    //
    super();
    if (instructorSdoModel) {
      Object.assign(this, { ...instructorSdoModel });
    }
  }

  static asInstructorSdo(instructorSdoModel: InstructorSdoModel, pageModel: PageModel): InstructorSdo {
    //
    return {
      startDate: instructorSdoModel.period.startDateLong,
      endDate: instructorSdoModel.period.endDateLong,
      collegeId: instructorSdoModel.college,
      internal: instructorSdoModel.internal === '' ? undefined : yesNoToBoolean(instructorSdoModel.internal || ''),
      resting: instructorSdoModel.resting === '' ? undefined : yesNoToBoolean(instructorSdoModel.resting || ''),
      email: instructorSdoModel.searchPart === 'Email' ? instructorSdoModel.searchWord : '',
      name: instructorSdoModel.searchPart === '성명' ? instructorSdoModel.searchWord : '',
      position: instructorSdoModel.searchPart === '직위' ? instructorSdoModel.searchWord : '',
      instructorIds: undefined,
      offset: pageModel.offset,
      limit: pageModel.limit,
    };
  }

  static asInstructorSdoNoDate(instructorSdoModel: InstructorSdoModel, pageModel: PageModel): InstructorSdo {
    //
    return {
      startDate: undefined,
      endDate: undefined,
      collegeId: undefined,
      internal: instructorSdoModel.internal === '' ? undefined : yesNoToBoolean(instructorSdoModel.internal || ''),
      resting: undefined,
      email: undefined,
      name: instructorSdoModel.searchPart === '성명' ? instructorSdoModel.searchWord : '',
      position: undefined,
      instructorIds: undefined,
      offset: pageModel.offset,
      limit: pageModel.limit,
    };
  }

  static asInstructorSdoExcel(instructorSdoModel: InstructorSdoModel): InstructorSdo {
    //
    return {
      startDate: undefined,
      endDate: undefined,
      collegeId: instructorSdoModel.college,
      internal: instructorSdoModel.internal === '' ? undefined : yesNoToBoolean(instructorSdoModel.internal || ''),
      resting: instructorSdoModel.resting === '' ? undefined : yesNoToBoolean(instructorSdoModel.resting || ''),
      email: instructorSdoModel.searchPart === 'Email' ? instructorSdoModel.searchWord : '',
      name: instructorSdoModel.searchPart === '성명' ? instructorSdoModel.searchWord : '',
      position: instructorSdoModel.searchPart === '직위' ? instructorSdoModel.searchWord : '',
      instructorIds: undefined,
      offset: 0,
      limit: 99999999,
    };
  }
}

decorate(InstructorSdoModel, {
  startDate: observable,
  endDate: observable,
  college: observable,
  internal: observable,
  resting: observable,
  email: observable,
  name: observable,
  position: observable,
});
