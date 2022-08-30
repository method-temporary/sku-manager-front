import { decorate, observable } from 'mobx';

export class TimePeriod {
  //
  zoneId: string = '';
  startTime: number = 0;
  endTime: number = 0;

  startHour: number = 0;
  startMinute: number = 0;

  endHour: number = 0;
  endMinute: number = 0;

  constructor(timePeriod?: TimePeriod) {
    if ( timePeriod ) {
      Object.assign(this, timePeriod);
    }
  }
}

decorate(TimePeriod, {
  zoneId: observable,
  startTime: observable,
  endTime: observable,
});
