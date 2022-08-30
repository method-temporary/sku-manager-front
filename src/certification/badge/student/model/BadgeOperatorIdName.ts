export class BadgeOperatorIdName {
  // 처리자
  operatorId: string = '';
  operatorName: string = '';

  constructor(idName?: BadgeOperatorIdName) {
    if (idName) {
      Object.assign(this, idName);
    }
  }
}
