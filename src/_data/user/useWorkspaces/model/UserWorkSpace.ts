import { AccessRule, PolyglotModel, SyncWithGdi } from 'shared/model';
import { UserGroupSequenceModel } from 'usergroup/group/model';
import LectureApproval from 'userworkspace/model/vo/LectureApproval';
import { UserWorkspaceState } from 'userworkspace/model/vo/UserWorkspaceState';

export interface UserWorkSpace {
  blacklistAccessRuleForPaidLecture: AccessRule;
  defaultUserGroupSequences: UserGroupSequenceModel;
  hasChildren: boolean;
  id: string;
  lectureApproval: LectureApproval;
  modifiedTime: number;
  modifier: string;
  modifierName: PolyglotModel;
  name: PolyglotModel;
  parentId: string;
  registeredTime: number;
  registrant: string;
  skGroup: boolean;
  state: UserWorkspaceState;
  syncWithGdi: SyncWithGdi;
  useApl: boolean;
  usid: string;
}
