import { decorate, observable } from 'mobx';
import { IdName, NameValueList } from 'shared/model';

export class FavoriteJobGroupModel {
  favoriteJobGroup: IdName = new IdName();
  favoriteJobDuty: IdName = new IdName();

  constructor(favoriteJobGroup?: FavoriteJobGroupModel) {
    Object.assign(this, { ...favoriteJobGroup });
  }

  static asNameValues(favoriteJob: FavoriteJobGroupModel): NameValueList {
    const asNameValues = {
      nameValues: [
        {
          name: 'favoriteJobGroup',
          value: JSON.stringify(favoriteJob.favoriteJobGroup),
        },
        {
          name: 'favoriteJobDudy',
          value: JSON.stringify(favoriteJob.favoriteJobDuty),
        },
      ],
    };
    return asNameValues;
  }
}

decorate(FavoriteJobGroupModel, {
  favoriteJobGroup: observable,
  favoriteJobDuty: observable,
});
