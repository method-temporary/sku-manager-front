import { decorate, observable } from 'mobx';
import { DramaEntity, PatronKey } from '@nara.platform/accent';
import { IdName } from 'shared/model';

export class LectureCardModel implements DramaEntity {
  //
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

  usid: string = '';
  learningCard: IdName = new IdName();
  reviewId: string = '';
  commentId: string = '';
  studentCount: number = 0;
  time: number = 0;

  constructor(lectureCard?: LectureCardModel) {
    if (lectureCard) {
      Object.assign(this, { ...lectureCard });
    }
  }
}

decorate(LectureCardModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

  usid: observable,
  learningCard: observable,
  reviewId: observable,
  commentId: observable,
  studentCount: observable,
  time: observable,
});
