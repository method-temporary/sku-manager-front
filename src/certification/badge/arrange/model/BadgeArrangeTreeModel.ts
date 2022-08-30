import { decorate, observable } from 'mobx';

export class BadgeArrangeTreeModel {
  //
  categoryId: string = '';
  name: string = '전체';
  treeId: string = 'All';

  constructor(badgeArrangeTreeModel?: BadgeArrangeTreeModel) {
    if (badgeArrangeTreeModel) {
      Object.assign(this, {
        categoryId: badgeArrangeTreeModel.categoryId,
        name: badgeArrangeTreeModel.name,
        treeId: badgeArrangeTreeModel.treeId,
      });
    }
  }
}

decorate(BadgeArrangeTreeModel, {
  categoryId: observable,
  name: observable,
  treeId: observable,
});
