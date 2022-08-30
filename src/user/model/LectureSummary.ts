import { decorate, observable } from 'mobx';

export class LectureSummary {
  completeCount : number=0;
  runningCount : number=0;
  enrolledCount : number=0;
  rejectedCount : number=0;

  constructor(lectureSummary? : LectureSummary) {
    if (lectureSummary) Object.assign(this, { ...lectureSummary });
  }
}

decorate(LectureSummary, {
  completeCount: observable,
  runningCount: observable,
  enrolledCount: observable,
  rejectedCount: observable,
});
