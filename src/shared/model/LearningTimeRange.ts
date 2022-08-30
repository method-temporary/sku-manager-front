export class LearningTimeRange extends TimeRanges {
  //
  constructor(startTime: number, endTime: number) {
    super();
    Object.assign(this, { start: startTime, end: endTime });
  }
}
