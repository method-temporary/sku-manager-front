import { Enrolling } from './Enrolling';
import { FreeOfCharge } from './FreeOfCharge';
import { Operation } from '../Operation';
import { DramaEntity, PatronType } from '@nara.platform/accent';
import { ClassroomSdo } from './ClassroomSdo';
import { PatronKey } from '../../../../shared/model';

export interface Classroom extends DramaEntity {
  capacity: number;
  capacityClosed: boolean;
  cubeId: string;
  enrolling: Enrolling;
  freeOfCharge: FreeOfCharge;
  operation: Operation;
  round: number;
  waitingCapacity: number;
}

function fromClassroomSdo(cubeId: string, classroomSdo: ClassroomSdo): Classroom {
  return {
    ...classroomSdo,
    cubeId,
    id: cubeId,
    patronKey: new PatronKey(),
    entityVersion: 0,
  };
}
export const ClassroomFunc = { fromClassroomSdo };
