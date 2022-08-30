import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel } from 'shared/model';

export class CourseLectureModel extends DramaEntityObservableModel {
  //
  usid: string = '';
  coursePlanId: string = '';
  lectureCardUsids: string[] = [];
  reviewId: string = '';
  commentId: string = '';
  studentCount: number = 0;
  passedStudentCount: number = 0;
  time: number = 0;

  constructor(courseLecture: CourseLectureModel) {
    //
    super();
    if (courseLecture) {
      Object.assign(this, { ...courseLecture });
    }
  }
}

decorate(CourseLectureModel, {
  usid: observable,
  coursePlanId: observable,
  lectureCardUsids: observable,
  reviewId: observable,
  commentId: observable,
  studentCount: observable,
  passedStudentCount: observable,
  time: observable,
});
