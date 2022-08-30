import { FreeOfCharge } from '../vo/FreeOfCharge';
import { Enrolling } from '../vo/Enrolling';
import { Operation } from '../vo/Operation';
import { decorate, observable } from 'mobx';

export class ClassRoomSdo {
  //
  round: number = 0;
  freeOfCharge: FreeOfCharge = new FreeOfCharge();
  enrolling: Enrolling = new Enrolling();
  capacity: number = 0;
  waitingCapacity: number = 0;
  capacityClosed: boolean = false;
  operation: Operation = new Operation();

  constructor(classRoomSdo?: ClassRoomSdo) {
    if (classRoomSdo) {
      const freeOfCharge = new FreeOfCharge(classRoomSdo.freeOfCharge);
      const enrolling = new Enrolling(classRoomSdo.enrolling);
      const operation = new Operation(classRoomSdo.operation);
      Object.assign(this, { ...classRoomSdo, freeOfCharge, enrolling, operation });
    }
  }
}

decorate(ClassRoomSdo, {
  round: observable,
  freeOfCharge: observable,
  enrolling: observable,
  capacity: observable,
  waitingCapacity: observable,
  capacityClosed: observable,
  operation: observable,
});
