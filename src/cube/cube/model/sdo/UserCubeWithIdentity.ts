import { decorate, observable } from 'mobx';
import moment from 'moment';

import { getPolyglotToAnyString, Language } from 'shared/components/Polyglot';
import { EnumUtil, UserCubeStateView } from 'shared/ui';

import { UserCubeModel } from '../UserCubeModel';
import { CubeModel } from '../CubeModel';
import { UserIdentityModel } from '../../../user/model/UserIdentityModel';
import { UserCubeCreateXlsxModel } from '../UserCubeCreateXlsxModel';

export class UserCubeWithIdentity {
  //
  userCube: UserCubeModel = new UserCubeModel();
  cube: CubeModel = new CubeModel();
  userIdentity: UserIdentityModel = new UserIdentityModel();

  constructor(userCubeWithIdentity?: UserCubeWithIdentity) {
    if (userCubeWithIdentity) {
      const userCube = new UserCubeModel(userCubeWithIdentity.userCube);
      const cube = new CubeModel(userCubeWithIdentity.cube);
      const userIdentity = new UserIdentityModel(userCubeWithIdentity.userIdentity);
      Object.assign(this, { ...userCubeWithIdentity, userCube, cube, userIdentity });
    }
  }

  static asCreateXLSX(userCubeWithIdentity: UserCubeWithIdentity, index: number): UserCubeCreateXlsxModel {
    //
    // const finalApprovalTime =
    //   userCubeWithIdentity.openRequests &&
    //   userCubeWithIdentity.openRequests.length &&
    //   userCubeWithIdentity.openRequests[userCubeWithIdentity.openRequests.length - 1].time;
    // const finalApprovalName =
    //   userCubeWithIdentity &&
    //   userCubeWithIdentity.openRequests &&
    //   userCubeWithIdentity.openRequests.length &&
    //   userCubeWithIdentity.openRequests[userCubeWithIdentity.openRequests.length - 1].response.name;

    return {
      No: String(index + 1),
      '소속사 (Ko)': userCubeWithIdentity.userIdentity.companyName.getValue(Language.Ko) || '-',
      '소속사 (En)': userCubeWithIdentity.userIdentity.companyName.getValue(Language.En) || '-',
      '소속사 (Zh)': userCubeWithIdentity.userIdentity.companyName.getValue(Language.Zh) || '-',
      '조직 (Ko)': userCubeWithIdentity.userIdentity.departmentName.getValue(Language.Ko) || '-',
      '조직 (En)': userCubeWithIdentity.userIdentity.departmentName.getValue(Language.En) || '-',
      '조직 (Zh)': userCubeWithIdentity.userIdentity.departmentName.getValue(Language.Zh) || '-',
      신청자: getPolyglotToAnyString(userCubeWithIdentity.userIdentity.name) || '-',
      '신청자 E-mail': userCubeWithIdentity.userIdentity.email || '-',
      '과정명 (Ko)': userCubeWithIdentity.cube.name.getValue(Language.Ko) || '-',
      '과정명 (En)': userCubeWithIdentity.cube.name.getValue(Language.En) || '-',
      '과정명 (Zh)': userCubeWithIdentity.cube.name.getValue(Language.Zh) || '-',
      교육시간: userCubeWithIdentity.cube.learningTime + 'minute(s)' || '-',
      요청일자: moment(userCubeWithIdentity.cube.registeredTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      상태:
        EnumUtil.getEnumValue(UserCubeStateView, userCubeWithIdentity.userCube.state).get(
          userCubeWithIdentity.userCube.state
        ) || '-',
      // 승인자: '' || '-',
      처리일자: moment(userCubeWithIdentity.userCube.openedTime).format('YYYY.MM.DD HH:mm:ss') || '-',
    };
  }
}

decorate(UserCubeWithIdentity, {
  userCube: observable,
  cube: observable,
  userIdentity: observable,
});
