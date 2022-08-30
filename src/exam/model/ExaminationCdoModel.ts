// import { decorate, observable } from 'mobx';
// import { EventSummaryModel } from './EventSummaryModel';

// export class ExaminationCdoModel {
//   //
//   id: string = '';
//   title: string = '';
//   eventSummary: EventSummaryModel = new EventSummaryModel();
//   examinerId: string = '';
//   examinerName: string = '';
//   examineeCount: number = 0;
//   absenteeCount: number = 0;
//   average: number = 0;
//   questionCount: number = 0;
//   takenDate: string = '';
//   finalCopy: boolean = true;

//   finalCopyKr: string = '1';
//   eventTypeKr: string = '';

//   paperId: string = '';

//   attendeeCount: number = 0;
//   successPoint: number = 0;

//   constructor(examination?: ExaminationCdoModel) {
//     if (examination) {
//       Object.assign(this, { ...examination });
//       this.eventSummary = examination.eventSummary && new EventSummaryModel(examination.eventSummary) || this.eventSummary;
//     }
//   }
// }

// decorate(ExaminationCdoModel, {
//   id: observable,
//   title: observable,
//   eventSummary: observable,
//   examinerId: observable,
//   examinerName: observable,
//   examineeCount: observable,
//   absenteeCount: observable,
//   average: observable,
//   questionCount: observable,
//   takenDate: observable,
//   finalCopy: observable,

//   finalCopyKr: observable,
//   eventTypeKr: observable,

//   paperId: observable,

//   attendeeCount: observable,
//   successPoint: observable,
// });
