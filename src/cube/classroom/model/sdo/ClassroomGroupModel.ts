import { decorate, observable } from 'mobx';
import { DramaEntity } from '@nara.platform/accent';
import { IdName, PatronKey } from 'shared/model';
import { ClassroomModel } from 'cube/classroom';

export class ClassroomGroupModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = new PatronKey();

  classrooms: IdName[] = [];
  classroomCdos: ClassroomModel[] = [];
  totalRound: number = 0;
  time: number = 0;

  constructor(classroomGroup?: ClassroomGroupModel) {
    //
    if (classroomGroup) {
      Object.assign(this, { ...classroomGroup });
    }
  }
}

decorate(ClassroomGroupModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

  classrooms: observable,
  classroomCdos: observable,
  totalRound: observable,
  time: observable,
});
