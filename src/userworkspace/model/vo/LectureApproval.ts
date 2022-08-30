import { decorate, observable } from 'mobx';
import { LectureApproverType } from './LectureApproverType';

export default class LectureApproval {
  //
  courseApproverType: LectureApproverType = LectureApproverType.DEFAULT;
  courseApprover: string = '';
  aplApproverType: LectureApproverType = LectureApproverType.DEFAULT;
  aplApprover: string = '';

  //
  courseApproverName: string = '';
  aplApproverName: string = '';

  constructor(lectureApproval?: LectureApproval) {
    if (lectureApproval) {
      const paidCourseApprover = lectureApproval.courseApprover;
      const aplApprover = lectureApproval.aplApprover;
      Object.assign(this, { ...lectureApproval, paidCourseApprover, aplApprover });
    }
  }

  static asValues(lectureApproval: LectureApproval) {
    //
    const target: any = {};
    target.aplApproverType = lectureApproval.aplApproverType;
    if (lectureApproval.aplApproverType === LectureApproverType.HrManager) {
      target.aplApprover = lectureApproval.aplApprover;
    }
    target.courseApproverType = lectureApproval.courseApproverType;
    if (lectureApproval.courseApproverType === LectureApproverType.HrManager) {
      target.courseApprover = lectureApproval.courseApprover;
    }

    return target;
  }
}

decorate(LectureApproval, {
  courseApproverType: observable,
  courseApprover: observable,
  aplApproverType: observable,
  aplApprover: observable,

  courseApproverName: observable,
  aplApproverName: observable,
});
