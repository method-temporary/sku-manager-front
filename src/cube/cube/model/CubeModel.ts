import { decorate, observable } from 'mobx';
import moment from 'moment';

import { PatronType } from '@nara.platform/accent';

import { CubeType, DramaEntityObservableModel, CardCategory, PatronKey, PolyglotModel } from 'shared/model';
import { EnumUtil, CubeTypeView } from 'shared/ui';
import { DEFAULT_LANGUAGE, LangSupport, langSupportCdo } from 'shared/components/Polyglot';
import { isDefaultPolyglotBlank, Language } from 'shared/components/Polyglot';

import { CubeMaterial } from './vo/CubeMaterial';
import { CubeReactiveModelModel } from './CubeReactiveModelModel';
import { CubeMaterialSdo } from './sdo/CubeMaterialSdo';
import { CubeSdo } from './sdo/CubeSdo';
import { Instructor } from './vo/Instructor';
import { OperatorModel } from '../../../community/community/model/OperatorModel';
import { CubeWithReactiveModel } from './sdo/CubeWithReactiveModel';
import { CubeXlsxModel } from './CubeXlsxModel';
import { CubeContentsModel } from './CubeContentsModel';

export class CubeModel extends DramaEntityObservableModel {
  //
  name: PolyglotModel = new PolyglotModel();
  existingName: PolyglotModel = new PolyglotModel();
  type: CubeType = CubeType.ALL;
  enabled: boolean = false;
  categories: CardCategory[] = [];
  sharingCineroomIds: string[] = [];
  enrollmentCardId: string = '';

  learningTime: number = 0;
  registeredTime: number = 0;

  hasTest: boolean = false;
  reportName: PolyglotModel = new PolyglotModel();
  surveyCaseId: string = '';

  cubeContents: CubeContentsModel = new CubeContentsModel();
  cubeMaterial: CubeMaterial = new CubeMaterial();
  cubeReactiveModel: CubeReactiveModelModel = new CubeReactiveModelModel();

  remark: string = '';

  // languages: string[] = [DEFAULT_LANGUAGE];
  // defaultLanguage: string = DEFAULT_LANGUAGE;
  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(cube?: CubeModel) {
    super();
    if (cube) {
      const name = new PolyglotModel(cube.name);
      const reportName = new PolyglotModel(cube.reportName);
      const cubeContents = new CubeContentsModel(cube.cubeContents);
      const cubeMaterial = new CubeMaterial(cube.cubeMaterial);
      const cubeRelatedCount = new CubeReactiveModelModel(cube.cubeReactiveModel);
      const existingName = name;
      const langSupports = (cube.langSupports && cube.langSupports.map((target) => new LangSupport(target))) || [];
      Object.assign(this, {
        ...cube,
        name,
        reportName,
        cubeContents,
        cubeMaterial,
        cubeRelatedCount,
        existingName,
        langSupports,
      });
    }
  }

  static asSdo(
    cube: CubeModel,
    instructors: Instructor[],
    operator: OperatorModel | undefined,
    materialSdo: CubeMaterialSdo
  ): CubeSdo {
    //
    return {
      name: cube.name,
      type: cube.type,
      categories: cube.categories,
      sharingCineroomIds: cube.sharingCineroomIds,

      learningTime: cube.learningTime,

      difficultyLevel: cube.cubeContents.difficultyLevel,
      description: cube.cubeContents.description,
      reportFileBox: cube.cubeContents.reportFileBox,

      instructors,

      surveyId: cube.cubeContents.surveyId,
      fileBoxId: cube.cubeContents.fileBoxId,
      tests: cube.cubeContents.tests,

      operator: (operator && operator.patronKey) || new PatronKey({ patronType: PatronType.Denizen, keyString: '' }),
      organizerId: cube.cubeContents.organizerId,
      otherOrganizerName: cube.cubeContents.organizerId !== 'PVD00018' ? '' : cube.cubeContents.otherOrganizerName,
      mandatory: cube.cubeContents.mandatory,

      tags: cube.cubeContents.tags,
      terms: cube.cubeContents.terms,

      materialSdo,
      langSupports: langSupportCdo(cube.langSupports),
    };
  }

  static makeChannelsMap(categoryList: CardCategory[]) {
    const categoryListMap = new Map<string, string[]>();

    categoryList.forEach((category) => {
      if (!categoryListMap.get(category.collegeId)) {
        categoryListMap.set(category.collegeId, [category.channelId]);
      } else {
        const channelList = categoryListMap.get(category.collegeId);
        if (channelList) {
          channelList.push(category.channelId);
          categoryListMap.set(category.collegeId, channelList);
        }
      }
    });
    return categoryListMap;
  }

  static makeChannelsIdNameMap(channelList: CardCategory[]) {
    const channelListMap = new Map<string, string[]>();

    channelList.forEach((channel) => {
      if (!channelListMap.get(channel.collegeId)) {
        channelListMap.set(channel.collegeId, [channel.channelId]);
      } else {
        const channelList = channelListMap.get(channel.collegeId);
        if (channelList) {
          channelList.push(channel.channelId);
          channelListMap.set(channel.collegeId, channelList);
        }
      }
    });
    return channelListMap;
  }

  static asXLSX(
    cubeWithReactive: CubeWithReactiveModel,
    index: number,
    collegeName: string | undefined,
    channelName: string | undefined
  ): CubeXlsxModel {
    //

    return {
      No: String(index + 1),
      'Cube???(Kor)': cubeWithReactive.name.getValue(Language.Ko) || '-',
      'Cube???(Eng)': cubeWithReactive.name.getValue(Language.En) || '-',
      'Cube???(China)': cubeWithReactive.name.getValue(Language.Zh) || '-',
      'Cube???(Frans)': cubeWithReactive.name.getValue(Language.Zh) || '-',
      'Cube???(Mgz)': cubeWithReactive.name.getValue(Language.Zh) || '-',
      'Cube???(Esp)': cubeWithReactive.name.getValue(Language.Zh) || '-',
      'Cube???(Poc)': cubeWithReactive.name.getValue(Language.Zh) || '-',
      'Cube???(Pol)': cubeWithReactive.name.getValue(Language.Zh) || '-',
      'Cube???(?????????)': cubeWithReactive.name.getValue(Language.Zh) || '-',
      ????????????: EnumUtil.getEnumValue(CubeTypeView, cubeWithReactive.type).get(cubeWithReactive.type) || '-',
      Channel: collegeName + ' -> ' + channelName || '-',
      //??????: '???' + Math.floor(cubeWithReactive.starCount * 10) / 10,
      /*????????????: moment(cube.time).format('YYYY-MM-DD HH:mm:ss') || '-',*/
      ????????????: moment(cubeWithReactive.registeredTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      // ????????????: moment(finalApprovalTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      ???????????????: `${cubeWithReactive.usingCardCount}`,
      // ????????????: EnumUtil.getEnumValue(CubeStateView, cube.cubeState).get(cube.cubeState) || '-',
      '????????? (Ko)': cubeWithReactive.registrantName.getValue(Language.Ko) || '-',
      '????????? (En)': cubeWithReactive.registrantName.getValue(Language.En) || '-',
      '????????? (Zh)': cubeWithReactive.registrantName.getValue(Language.Zh) || '-',
      ????????????: cubeWithReactive.enabled ? 'Yes' : 'No' || '-',
    };
  }

  static isBlank(cube: CubeModel): string {
    if (!cube.categories.some((target) => target.mainCategory)) return '?????? ??????';
    if (!cube.categories.some((channel) => channel.channelId)) return '??????';
    if (!cube.categories.some((college) => college.collegeId)) return '????????????';

    // if (!cube.categories.some((target) => !target.mainCategory)) return '?????? ??????';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.name)) return 'Cube???';
    if (!cube.type) return '????????????';
    return 'success';
  }

  getMainCategory(): CardCategory {
    let cardCategory = new CardCategory();
    this.categories.forEach((category) => {
      if (category.mainCategory) {
        cardCategory = category;
      }
    });
    return cardCategory;
  }

  getSubCategories(): CardCategory[] {
    const cardCategories: CardCategory[] = [];
    this.categories.forEach((category) => {
      if (!category.mainCategory) {
        cardCategories.push(category);
      }
    });
    return cardCategories;
  }
}

decorate(CubeModel, {
  name: observable,
  type: observable,
  enabled: observable,
  categories: observable,
  sharingCineroomIds: observable,

  learningTime: observable,
  registeredTime: observable,

  hasTest: observable,
  reportName: observable,
  surveyCaseId: observable,

  cubeContents: observable,
  cubeMaterial: observable,
  cubeReactiveModel: observable,

  remark: observable,

  // languages: observable,
  // defaultLanguage: observable,
  langSupports: observable,
});
