import { decorate, observable } from 'mobx';
import moment from 'moment';

import { DramaEntityObservableModel, NewDatePeriod } from 'shared/model';

import { OperatorModel } from '../../../community/community/model/OperatorModel';
import { addDateValue } from '../../cube/ui/logic/CubeHelper';
import { FreeOfCharge } from './vo/FreeOfCharge';
import { Enrolling } from './vo/Enrolling';
import { Operation } from './vo/Operation';
import { ClassRoomSdo } from './sdo/ClassRoomSdo';

export class ClassroomModel extends DramaEntityObservableModel {
  //
  cubeId: string = '';
  round: number = 1;
  // name: string = '';
  // description: string = '';
  // instructor: InstructorModel = new InstructorModel();
  freeOfCharge: FreeOfCharge = new FreeOfCharge();
  enrolling: Enrolling = this.initialCubeClassroomEnrolling();
  capacity: number = 0;
  waitingCapacity: number = 0;
  capacityClosed: boolean = false;
  operation: Operation = new Operation();

  constructor(classroom?: ClassroomModel) {
    //
    super();
    if (classroom) {
      const freeOfCharge = new FreeOfCharge(classroom.freeOfCharge);
      const enrolling = new Enrolling(classroom.enrolling);
      const operation = new Operation(classroom.operation);
      Object.assign(this, { ...classroom, freeOfCharge, enrolling, operation });
    }
  }

  initialCubeClassroomEnrolling() {
    //
    const enrolling = new Enrolling();

    const endDateValue = addDateValue(moment(), 30);
    const learningStartDateValue = addDateValue(moment(), 31);
    const learningEndDateValue = addDateValue(moment(), 61);
    const cancellableEndDateValue = addDateValue(moment(), 29);

    enrolling.applyingPeriod.endDateMoment = endDateValue;
    enrolling.learningPeriod.startDateMoment = learningStartDateValue;
    enrolling.learningPeriod.endDateMoment = learningEndDateValue;
    enrolling.cancellablePeriod.startDateMoment = moment().startOf('day');
    enrolling.cancellablePeriod.endDateMoment = cancellableEndDateValue;

    return enrolling;
  }

  static asSdo(classroom: ClassroomModel): ClassRoomSdo {
    //
    const operation: Operation = {
      operator: classroom.operation.operatorInfo.patronKey,
      location: classroom.operation.location,
      siteUrl: classroom.operation.siteUrl,
      operatorInfo: new OperatorModel(),
    };

    const enrolling = {
      applyingPeriod: NewDatePeriod.syncDatePeriod(classroom.enrolling.applyingPeriod),
      cancellablePeriod: NewDatePeriod.syncDatePeriod(classroom.enrolling.cancellablePeriod),
      cancellationPenalty: classroom.enrolling.cancellationPenalty,
      learningPeriod: NewDatePeriod.syncDatePeriod(classroom.enrolling.learningPeriod),
      enrollingAvailable: classroom.enrolling.enrollingAvailable,
    };

    return {
      round: classroom.round,
      freeOfCharge: {
        ...classroom.freeOfCharge,
        chargeAmount: classroom.freeOfCharge.freeOfCharge ? 0 : classroom.freeOfCharge.chargeAmount,
      },
      enrolling,
      capacity: classroom.capacity,
      waitingCapacity: classroom.waitingCapacity,
      capacityClosed: classroom.capacityClosed,
      operation,
    };
  }
}

decorate(ClassroomModel, {
  cubeId: observable,
  round: observable,
  freeOfCharge: observable,
  enrolling: observable,
  capacity: observable,
  waitingCapacity: observable,
  capacityClosed: observable,
  operation: observable,
});
