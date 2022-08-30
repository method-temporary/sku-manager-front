import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import _ from 'lodash';

import { PageModel } from 'shared/model';
import MainPagePopupApi from '../apiclient/MainPagePopupApi';
import { MainPagePopupModel } from '../../model/MainPagePopupModel';
import MainPagePopupRdo from '../../model/MainPagePopupRdo';
import { MainPagePopupQueryModel } from '../../model/MainPagePopupQueryModel';
import { NameValueList } from 'shared/model';
import { Moment } from 'moment';
import MainPagePopupCdo from '../../model/MainPagePopupCdo';
import MainPagePopupUdo from '../../model/MainPagePopupUdo';

@autobind
export class MainPagePopupService {
  //
  static instance: MainPagePopupService;

  mainPagePopupApi: MainPagePopupApi;

  @observable
  searchQueryModel: MainPagePopupQueryModel = new MainPagePopupQueryModel();

  @observable
  mainPagePopup: MainPagePopupModel = new MainPagePopupModel();

  @observable
  mainPagePopups: MainPagePopupModel[] = [];

  constructor(mainPagePopupApi: MainPagePopupApi) {
    //
    this.mainPagePopupApi = mainPagePopupApi;
  }

  @action
  initMainPagePopup() {
    //
    this.mainPagePopup = new MainPagePopupModel();
  }

  @action
  changeMainPagePopupProp(name: string, value: any) {
    //
    this.mainPagePopup = _.set(this.mainPagePopup, name, value);
  }

  @action
  changeMainPagePopupModalQueryProp(name: string, value: any) {
    //
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeMainPagePopupPeriodProps(name: string, value: string | Moment | number) {
    //
    this.mainPagePopup = _.set(this.mainPagePopup, name, value);
  }

  @action
  onChangeMainPagePopupPeriodProps(name: string, value: Moment) {
    //
    if (name === 'period.startDateMoment') {
      this.changeMainPagePopupProp('period.startDate', value.format('YYYY-MM-DD HH'));
      this.changeMainPagePopupPeriodProps(name, value);
    }
    if (name === 'period.endDateMoment') {
      this.changeMainPagePopupProp('period.endDate', value.format('YYYY-MM-DD HH'));
      this.changeMainPagePopupPeriodProps(name, value);
    }
  }

  @action
  setMainPagePopupQuery(mainPagePopup: MainPagePopupModel) {
    //
    this.mainPagePopup = mainPagePopup;
  }

  @action
  clearMainPagePopupQuery() {
    this.mainPagePopup = new MainPagePopupModel();
  }

  @action
  async findMainPagePopups(pageModel: PageModel): Promise<number> {
    //
    const offsetElementList = await this.mainPagePopupApi.findMainPagePopups(
      new MainPagePopupRdo(this.searchQueryModel, pageModel)
    );

    // console.log(offsetElementList);

    if (offsetElementList.results) {
      runInAction(() => {
        this.mainPagePopups = offsetElementList.results.map((mainPagePopups) => new MainPagePopupModel(mainPagePopups));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findMainPagePopup(popupId: string): Promise<MainPagePopupModel> {
    //
    const rtnModal = await this.mainPagePopupApi.findMainPagePopupsDetail(popupId);

    // console.log(rtnModal);

    runInAction(() => {
      this.mainPagePopup = new MainPagePopupModel(rtnModal);
    });
    return rtnModal;
  }

  async registerMainPagePopup(mainPagePopupCdo: MainPagePopupCdo) {
    return this.mainPagePopupApi.registerMainPagePopup(mainPagePopupCdo);
  }

  async modifyMainPagePopup(mainPagePopupModel: MainPagePopupUdo): Promise<string> {
    //
    return this.mainPagePopupApi.modifyMainPagePopup(mainPagePopupModel);
  }

  asNameValueList(madel: MainPagePopupModel): NameValueList {
    //
    return {
      nameValues: [
        {
          name: 'title',
          value: JSON.stringify(madel.title),
        },
        {
          name: 'contents',
          value: JSON.stringify(madel.contents), //본문내용
        },
      ],
    };
  }
}

MainPagePopupService.instance = new MainPagePopupService(MainPagePopupApi.instance);
export default MainPagePopupService;
