import { decorate, observable } from 'mobx';
import { IdName } from 'shared/model';
import { CubeState } from '../vo/CubeState';

export class PersonalCubeRequestCdoModel {
  //
  audienceKey: string = 'r2p8-r@nea-m5-c5';
  personalCube: IdName = new IdName();
  actor: IdName = new IdName();
  cubeState: CubeState = CubeState.OpenApproval;
  remark: string = '';
}

decorate(PersonalCubeRequestCdoModel, {
  audienceKey: observable,
  personalCube: observable,
  actor: observable,
  cubeState: observable,
  remark: observable,
});
