import { decorate, observable } from 'mobx';

export class Instructor {
  //
  id: string = '';
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
  id: observable,
  representative: observable,
  round: observable,
});
