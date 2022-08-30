import { UserCubeState } from '../vo/UserCubeState';
import { ConditionDateType } from '../vo/ConditionDateType';

export class UserCubeAdminRdo {
  //
  name: string = '';
  creatorName: string = '';
  creatorEmail: string = '';
  cineroomId: string = '';
  state: UserCubeState = UserCubeState.OpenApproval;
  conditionDateType: ConditionDateType = ConditionDateType.OpenedTime;
  startDate: number = 0;
  endDate: number = 0;
  limit: number = 0;
  offset: number = 0;
}
