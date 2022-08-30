import { action, observable, runInAction, computed } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { OffsetElementList, SelectTypeModel, PolyglotModel } from 'shared/model';
import { LangSupport, langSupportCdo, DEFAULT_LANGUAGE, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CollegeBannerContentModel } from 'college/model/CollegeBannerContentModel';

import { CollegeModel } from '../../model/CollegeModel';
import { CollegeBannerModel } from '../../model/CollegeBannerModel';
import { CollegeBannerQueryModel } from '../../model/CollegeBannerQueryModel';
import { JobDutyModel } from '../../model/JobDutyModel';
import { JobGroupModel } from '../../model/JobGroupModel';
import { CollegeBannerUdo } from '../../model/CollegeBannerUdo';
import { ChannelModel } from '../../../cube/board/board/model/ChannelModel';

import CollegeApi from '../apiclient/CollegeApi';

@autobind
export default class CollegeService {
  //
  static instance: CollegeService;

  collegeApi: CollegeApi;

  @observable
  mainCollege: CollegeModel = new CollegeModel();

  @observable
  subCollege: CollegeModel = new CollegeModel();

  @observable
  colleges: CollegeModel[] = [];

  @observable
  collegesForPanopto: CollegeModel[] = [];

  @observable
  collegeForPanopto: CollegeModel = new CollegeModel();

  @observable
  collegeBanner: CollegeBannerModel = new CollegeBannerModel();

  @observable
  collegeBannerList: OffsetElementList<CollegeBannerModel> = new OffsetElementList<CollegeBannerModel>();

  @observable
  collegeBannerQuery: CollegeBannerQueryModel = new CollegeBannerQueryModel();

  @observable
  _colleges: CollegeModel[] = [];

  @observable
  _collegeList: any[] = [];

  @observable
  collegesSelect: SelectTypeModel[] = [];

  @observable
  channelSelect: SelectTypeModel[] = [new SelectTypeModel()];

  @observable
  collegesMap: Map<string, string> = new Map<string, string>();

  @observable
  channelMap: Map<string, string> = new Map<string, string>();

  @observable
  channelList: ChannelModel[] = [];

  @observable
  collegesForCurrentCineroom: CollegeModel[] = [];

  @observable
  familyCollegesForCurrentCineroom: CollegeModel[] = [];

  @observable
  jobDutyMap: Map<string, JobDutyModel> = new Map<string, JobDutyModel>();

  @observable
  jobGroupMap: Map<string, JobGroupModel> = new Map<string, JobGroupModel>();

  constructor(collegeApi: CollegeApi) {
    this.collegeApi = collegeApi;
  }

  async init() {
    //
    await this.findCollegeApis();
    await this.findAllJobDutyAndMap();
    await this.findALLJobGroupAndMap();
  }

  async findCollegeApis() {
    //
    await this.findAllColleges();
    await this.setCollegeSelectAndMap();
    await this.findAllCollegesForCurrentCineroom();
    await this.findFamilyCollegesForCurrentCineroom();
  }

  @action
  async setCollegeSelectAndMap() {
    //
    const collegesTemp: SelectTypeModel[] = [];
    const collegesMap = new Map<string, string>();
    const channelMap = new Map<string, string>();
    const channelList: ChannelModel[] = [];

    this.colleges.map((college) => {
      collegesTemp.push(new SelectTypeModel(college.id, getPolyglotToAnyString(college.name), college.id));
      collegesMap.set(college.id, getPolyglotToAnyString(college.name));
      college.channels.map((channel) => {
        channelMap.set(channel.id, getPolyglotToAnyString(channel.name));
        channelList.push(channel);
      });
    });

    this.collegesSelect = collegesTemp;
    this.collegesMap = collegesMap;
    this.channelMap = channelMap;
    this.channelList = channelList;
  }

  @action
  async findMainCollege(collegeId: string) {
    //
    const college = await this.collegeApi.findCollege(collegeId);
    if (college) return runInAction(() => (this.mainCollege = new CollegeModel(college)));
    return null;
  }

  @action
  async findSubCollege(collegeId: string) {
    //
    const college = await this.collegeApi.findCollege(collegeId);
    if (college) return runInAction(() => (this.subCollege = new CollegeModel(college)));
    return null;
  }

  @action
  async findCollege(collegeId: string) {
    //
    const college = await this.collegeApi.findCollege(collegeId);
    if (college) return runInAction(() => (this.collegeForPanopto = new CollegeModel(college)));
    return null;
  }

  @action
  async findAllColleges() {
    //
    // const colleges = await this.collegeApi.findAllColleges();
    const colleges = await this.collegeApi.findAllColleges();

    return runInAction(() => (this.colleges = colleges.results.map((college) => new CollegeModel(college))));
  }

  @action
  async findAllCollegesForPanopto() {
    //
    const colleges = await this.collegeApi.findAllColleges();
    return runInAction(() => (this.collegesForPanopto = colleges.results.map((college) => new CollegeModel(college))));
  }

  @action
  async findAllCollegeList() {
    //
    const colleges = await this.collegeApi.findCollegesForCurrentCineroom();

    return runInAction(() => {
      this.collegesForPanopto = colleges;
      this._colleges = colleges.map((result) => new CollegeModel(result)) || [];
      this.makeCollegeList(this._colleges);
    });
  }

  @action
  async findAllCollegesForCurrentCineroom() {
    //
    const colleges = await this.collegeApi.findCollegesForCurrentCineroom();

    return runInAction(() => {
      this.collegesForCurrentCineroom = colleges.map((result) => new CollegeModel(result)) || [];
    });
  }

  @action
  async findFamilyCollegesForCurrentCineroom() {
    //
    const colleges = await this.collegeApi.findFamilyCollegesForCurrentCineroom();

    return runInAction(() => {
      this.familyCollegesForCurrentCineroom = colleges.map((result) => new CollegeModel(result)) || [];
    });
  }

  @action
  async findCollegesByCineroomId() {
    //
    const collegesForPanopto = await this.collegeApi.findCollegesByCineroomId();
    return runInAction(() => (this.collegesForPanopto = collegesForPanopto));
  }

  @action
  async findAllCollegeBannersByQuery() {
    const collegeBannerList = await this.collegeApi.findCollegeBannersByQuery(
      CollegeBannerQueryModel.asBannerRdo(this.collegeBannerQuery)
    );
    runInAction(() => (this.collegeBannerList = collegeBannerList));
    return collegeBannerList;
  }

  @action
  async findCollegeBanner(collegeBannerId: string) {
    const collegeBanner = await this.collegeApi.findCollegeBanner(collegeBannerId);
    runInAction(() => {
      this.collegeBanner = collegeBanner;
      if (this.collegeBanner.langSupports === undefined || this.collegeBanner.langSupports === null) {
        this.changeCollegeBannerProps('langSupports', [DEFAULT_LANGUAGE]);
      } else {
        const langSupports = collegeBanner.langSupports.map((target) => new LangSupport(target));
        this.changeCollegeBannerProps('langSupports', langSupports);
      }
    });
    return collegeBanner;
  }

  @action
  async findAllJobDutyAndMap() {
    //
    const jobDuties = await this.collegeApi.findAllJobDuty();

    runInAction(() => {
      const map = new Map<string, JobDutyModel>();

      jobDuties.forEach((jobDuty) => {
        map.set(jobDuty.id, new JobDutyModel(jobDuty));
      });

      this.jobDutyMap = map;
    });
  }

  @action
  async findALLJobGroupAndMap() {
    //
    const jobGroups = await this.collegeApi.findAllJobGroup();

    runInAction(() => {
      const map = new Map<string, JobGroupModel>();

      jobGroups.forEach((jobGroup) => {
        map.set(jobGroup.id, new JobGroupModel(jobGroup));
      });

      this.jobGroupMap = map;
    });
  }

  @action
  registerCollegeBanner() {
    //
    const collegeBannerCdo = this.collegeBanner;
    collegeBannerCdo.langSupports = langSupportCdo(this.collegeBanner.langSupports);
    return this.collegeApi.registerCollegeBanner(collegeBannerCdo);
  }

  @action
  async modifyCollegeBanner(collegeBannerId: string) {
    //
    // const collegeBannerCdo = this.collegeBanner;
    // collegeBannerCdo.langSupports = langSupportCdo(this.collegeBanner.langSupports);
    // this.collegeApi.modifyCollegeBanner(collegeBannerId, collegeBannerCdo);
    const collegeBannerUdo = CollegeBannerUdo.toUdoByModel(this.collegeBanner);
    this.collegeApi.modifyCollegeBanner(collegeBannerId, collegeBannerUdo);
  }

  @action
  async removeCollegeBanner(collegeBannerId: string) {
    //
    this.collegeApi.removeCollegeBanner(collegeBannerId);
  }

  @action
  async clearColleges() {
    //
    this.colleges = [];
  }

  @action
  clearMainCollege() {
    //
    this.mainCollege = new CollegeModel();
  }

  @action
  clearSubCollege() {
    //
    this.subCollege = new CollegeModel();
  }

  @action
  clearCollegeForPanopto() {
    //
    this.collegeForPanopto = new CollegeModel();
  }

  @action
  setCollegeForPanopto(selectedCollege: CollegeModel) {
    //
    this.collegeForPanopto = selectedCollege;
  }

  @action
  changeCollegeBannerProps(name: string, value: string | number | LangSupport[]) {
    this.collegeBanner = _.set(this.collegeBanner, name, value);
  }

  @action
  clearCollegeBannerQueryProps() {
    //
    this.collegeBannerQuery = new CollegeBannerQueryModel();
  }

  @action
  changeCollegeBannerContentProps(index: number, name: string, value: string | number | PolyglotModel) {
    let collegeBanner = this.collegeBanner.collegeBannerContents[index];
    if (collegeBanner) {
      collegeBanner = _.set(collegeBanner, name, value);
      this.collegeBanner.collegeBannerContents = [...this.collegeBanner.collegeBannerContents];
    }
  }

  @action
  clearCollegeBannerProps() {
    //
    this.collegeBanner = new CollegeBannerModel();
  }

  @action
  changeCollegeBannerQueryProps(name: string, value: any) {
    if (value === '전체') value = '';
    this.collegeBannerQuery = _.set(this.collegeBannerQuery, name, value);
  }

  @action
  changeCollegeBannerViewType() {
    const nowLength = this.collegeBanner?.collegeBannerContents?.length || 0;
    const resultList: CollegeBannerContentModel[] =
      (nowLength !== 0 && [...this.collegeBanner.collegeBannerContents]) || [];

    if (nowLength !== 3) {
      let addLength = 3 - nowLength;

      while (addLength !== 0) {
        const initModel = new CollegeBannerContentModel();
        initModel.collegeBannerOrder = 3 - addLength + 1;
        resultList.push(initModel);
        addLength--;
      }
    }

    runInAction(() => {
      this.collegeBanner.collegeBannerContents = [...resultList];
    });

    // const viewType = this.collegeBanner.viewType;

    // if (viewType && viewType === '1') {
    //   if (this.collegeBanner.collegeBannerContents.length === 0) {
    //     this.collegeBanner.collegeBannerContents.push(new CollegeBannerContentModel());
    //     this.changeCollegeBannerContentProps(0, 'collegeBannerOrder', 1);
    //   } else {
    //     this.collegeBanner.collegeBannerContents.map((collegeBannerContent, index) => {
    //       if (index > 0) {
    //         (this.collegeBanner.collegeBannerContents as any).remove(this.collegeBanner.collegeBannerContents[index]);
    //       }
    //     });
    //   }
    // } else if (viewType && viewType === '2') {
    //   const contentsLength = this.collegeBanner.collegeBannerContents.length;
    //   if (contentsLength === 0 || contentsLength <= 1) {
    //     for (let i = contentsLength; i < 2; i++) {
    //       this.collegeBanner.collegeBannerContents.push(new CollegeBannerContentModel());
    //       this.changeCollegeBannerContentProps(i, 'collegeBannerOrder', i + 1);
    //     }
    //   } else {
    //     this.collegeBanner.collegeBannerContents.map((collegeBannerContent, index) => {
    //       if (index > 1) {
    //         (this.collegeBanner.collegeBannerContents as any).remove(this.collegeBanner.collegeBannerContents[index]);
    //       }
    //     });
    //   }
    // }
  }

  makeCollegeList(colleges: CollegeModel[]) {
    this._collegeList = [];

    colleges.map((college, index) => {
      this._collegeList.push({ key: index + 1, text: getPolyglotToAnyString(college.name), value: college.id });
    });

    //this._collegeList = this._collegeList.sort((a,b));

    this._collegeList = this._collegeList.sort((a, b) => {
      const nameA = a.text.toUpperCase(); // ignore upper and lowercase
      const nameB = b.text.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // 이름이 같을 경우
      return 0;
    });

    return this._collegeList;
  }

  @computed
  get collegeList() {
    return this._collegeList;
  }

  @action
  setChannelSelect(channelSelect: SelectTypeModel[]) {
    this.channelSelect = channelSelect;
  }

  @action
  clearChannelSelect() {
    this.channelSelect = [];
  }
}

Object.defineProperty(CollegeService, 'instance', {
  value: new CollegeService(CollegeApi.instance),
  writable: false,
  configurable: false,
});
