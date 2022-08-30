// import { decorate, observable } from 'mobx';
//
// export class BoardConfigModel {
//   //
//   anonymous: boolean = false;
//   replyable: boolean = false;
//   notifiable: boolean = false;
//   shareable: boolean = false;
//   idDeleted: boolean = false;
//
//   constructor(boardConfig?: BoardConfigModel) {
//     if (boardConfig) {
//       Object.assign(this, { ...boardConfig });
//     }
//   }
// }
//
// decorate(BoardConfigModel, {
//   anonymous: observable,
//   replyable: observable,
//   notifiable: observable,
//   shareable: observable,
//   idDeleted: observable,
// });
