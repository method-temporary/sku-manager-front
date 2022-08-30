import { decorate, observable } from 'mobx';
import { IdNameList, NameValueList } from 'shared/model';

export class StudySummaryCdoModel {
  profileId: string = '';
  favoriteChannels: IdNameList = {} as IdNameList;
  favoriteColleges: IdNameList = {} as IdNameList;
  favoriteLearningType: IdNameList = {} as IdNameList;

  constructor(studySummary?: StudySummaryCdoModel) {
    if (studySummary) {
      Object.assign(this, { studySummary });
    }
  }

  static asNameValueList(idNameList: IdNameList): NameValueList {
    const nameValueList: NameValueList = new NameValueList();
    idNameList.idNames.map((data) => {
      nameValueList.nameValues.push({
        name: data.id,
        value: data.name,
      });
    });
    return nameValueList;
  }
}

decorate(StudySummaryCdoModel, {
  profileId: observable,
  favoriteChannels: observable,
  favoriteColleges: observable,
  favoriteLearningType: observable,
});
