import { decorate, observable } from 'mobx';

export class CardRelatedCount {
  //
  id: string = '';
  passedStudentCount: number = 0; // 이수자
  studentCount: number = 0; // 학습자
  startCount: number = 0; // 별점

  constructor(cardRelatedCount?: CardRelatedCount) {
    //
    if (cardRelatedCount) {
      Object.assign(this, { ...cardRelatedCount });
    }
  }
}

decorate(CardRelatedCount, {
  passedStudentCount: observable,
  studentCount: observable,
  startCount: observable,
});
