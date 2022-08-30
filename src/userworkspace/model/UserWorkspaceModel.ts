import { decorate, observable } from 'mobx';

import { patronInfo } from '@nara.platform/dock';

import { DramaEntityObservableModel, NameValueList, AccessRule, PolyglotModel, SyncWithGdi } from 'shared/model';

import { UserGroupSequenceModel } from '../../usergroup/group/model';
import { UserWorkspaceState } from './vo/UserWorkspaceState';
import LectureApproval from './vo/LectureApproval';

export default class UserWorkspaceModel extends DramaEntityObservableModel {
  //
  name: PolyglotModel = new PolyglotModel();
  usid: string = '';
  skGroup: boolean = false;
  //
  // syncWithGdi: boolean = false;
  syncWithGdi: SyncWithGdi = new SyncWithGdi();
  state: UserWorkspaceState = UserWorkspaceState.DEFAULT;
  useApl: boolean = false;
  hasChildren?: boolean = undefined;
  lectureApproval: LectureApproval = new LectureApproval();
  defaultUserGroupSequences: UserGroupSequenceModel = new UserGroupSequenceModel();
  blacklistAccessRuleForPaidLecture: AccessRule = new AccessRule();
  titleCodesFor200Membership: string[] = [];

  registeredTime: number = 0;
  modifiedTime: number = 0;
  modifierName: PolyglotModel = new PolyglotModel();

  registrant: string = '';
  modifier: String = '';
  parentId: string = '';

  creatorName: string = '';

  constructor(userWorkspace?: UserWorkspaceModel) {
    super();
    if (userWorkspace) {
      //
      const name = new PolyglotModel(userWorkspace.name);
      const lectureApproval = new LectureApproval(userWorkspace.lectureApproval);
      // const creator = new PatronKey(userWorkspace.creator);
      // const modifier = new PatronKey(userWorkspace.modifier);
      const blacklistAccessRuleForPaidLecture = new AccessRule(userWorkspace.blacklistAccessRuleForPaidLecture);
      const modifierName = new PolyglotModel(userWorkspace.modifierName);
      Object.assign(this, {
        ...userWorkspace,
        name,
        lectureApproval,
        // creator,
        // modifier,
        blacklistAccessRuleForPaidLecture,
        modifierName,
      });
    }
  }

  static asNameValues(userWorkspace: UserWorkspaceModel): NameValueList {
    //
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    const nameValues = [
      {
        name: 'useApl',
        value: String(userWorkspace.useApl),
      },
      {
        name: 'lectureApproval',
        value: JSON.stringify(LectureApproval.asValues(userWorkspace.lectureApproval)),
      },
      {
        name: 'defaultUserGroupSequences',
        value: JSON.stringify(userWorkspace.defaultUserGroupSequences),
      },
    ];
    if (roles.includes('SuperManager') || roles.includes('CollegeManager')) {
      nameValues.push({
        name: 'blacklistAccessRuleForPaidLecture',
        value: JSON.stringify(userWorkspace.blacklistAccessRuleForPaidLecture),
      });
    }
    return { nameValues };
  }
}

decorate(UserWorkspaceModel, {
  name: observable,
  usid: observable,
  skGroup: observable,
  syncWithGdi: observable,
  state: observable,
  useApl: observable,
  hasChildren: observable,
  lectureApproval: observable,
  defaultUserGroupSequences: observable,
  blacklistAccessRuleForPaidLecture: observable,
  titleCodesFor200Membership: observable,

  registeredTime: observable,
  modifiedTime: observable,
  modifierName: observable,

  registrant: observable,
  modifier: observable,
  parentId: observable,

  creatorName: observable,
});
