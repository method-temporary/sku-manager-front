import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel } from 'shared/model';

export class ProgramLectureModel extends DramaEntityObservableModel {
  //
  usid: string = '';
  coursePlanId: string = '';
  courseLectureUsids: string[] = [];
  lectureCardUsids: string[] = [];
  reviewId: string = '';
  commentId: string = '';
  studentCount: number = 0;
  passedStudentCount: number = 0;
  time: number = 0;

  constructor(programLecture: ProgramLectureModel) {
    //
    super();
    if (programLecture) {
      Object.assign(this, { ...programLecture });
    }
  }
}

decorate(ProgramLectureModel, {
  usid: observable,
  coursePlanId: observable,
  courseLectureUsids: observable,
  lectureCardUsids: observable,
  reviewId: observable,
  commentId: observable,
  studentCount: observable,
  passedStudentCount: observable,
  time: observable,
});
