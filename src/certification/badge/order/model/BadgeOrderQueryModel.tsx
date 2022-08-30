import { QueryModel } from 'shared/model';
import { decorate, observable } from 'mobx';
import { PageModel } from 'shared/model';
import BadgeOrderRdo from './BadgeOrderRdo';

export default class BadgeOrderQueryModel extends QueryModel {
  //
  id: string = '';
  seq: number = 0;
  cineroomId: string = '';
  name: string = '';
  creatorName: string = '';
  creationTime: number = 0;

  static asBadgeOrderRdo(badgeOrderQueryModel: BadgeOrderQueryModel, pageModel: PageModel): BadgeOrderRdo {
    //
    return {
      id: badgeOrderQueryModel.id,
      seq: badgeOrderQueryModel.seq,
      cineroomId: badgeOrderQueryModel.cineroomId,
      name: badgeOrderQueryModel.name,
      creatorName: badgeOrderQueryModel.creatorName,
      creationTime: badgeOrderQueryModel.creationTime,
      offset: pageModel.offset,
      limit: pageModel.limit,
    };
  }
}

decorate(BadgeOrderQueryModel, {
  id: observable,
  seq: observable,
  cineroomId: observable,
  name: observable,
  creatorName: observable,
  creationTime: observable,
});
