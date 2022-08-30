export class BadgeArrangeFlowUdoModel {
  categoryId: string = '';
  badgeIds: string[] = [];

  constructor(categoryId: string, badgeIds: string[]) {
    this.categoryId = categoryId;
    this.badgeIds = badgeIds;
  }
}
