import { decorate, observable } from 'mobx';

export class Instructor {
  //
  instructorId: string = '';
  lectureTime: number = 0;
  instructorLearningTime: number = 0;
  representative: boolean = false;
  round: number = 0;

  constructor(instructor?: Instructor) {
    //
    if (instructor) {
      Object.assign(this, { ...instructor });
    }
  }
}

decorate(Instructor, {
  instructorId: observable,
  representative: observable,
  round: observable,
});
