// import { decorate, observable } from 'mobx';
// import { EventType } from './EventType';

// export class EventSummaryModel {
//   //
//   eventId: string = ''; // Lecture ID | Coursework's Lecture ID | MOOC ID
//   title: string = '';
//   eventType: EventType = EventType.OpenLecture;
//   episode: number = 0;
//   startDay: Date = new Date();

//   constructor(eventSummary?: EventSummaryModel) {
//     if (eventSummary) {
//       Object.assign(this, { ...eventSummary });
//     }
//   }
// }

// decorate(EventSummaryModel, {
//   eventId: observable,
//   title: observable,
//   eventType: observable,
//   episode: observable,
//   startDay: observable,
// });
