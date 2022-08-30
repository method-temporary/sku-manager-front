// front 개선 필요 > Model Import 변경
import { PolyglotModel } from 'shared/model/PolyglotModel';
import { GroupBasedAccessRule, PatronKey } from 'shared/model';

export interface Channel {
  //
  collegeId: string;
  description: PolyglotModel;
  displayOrder: number;
  enabled: boolean;
  groupBasedAccessRule: GroupBasedAccessRule;
  id: string;
  name: PolyglotModel;
  parentId: string;
  patronKey: PatronKey;
  registeredTime: number;
}

export function getInitChannel() {
  //
  return {
    collegeId: '',
    description: new PolyglotModel(),
    displayOrder: 0,
    enabled: false,
    groupBasedAccessRule: new GroupBasedAccessRule(),
    id: '',
    name: new PolyglotModel(),
    parentId: '',
    patronKey: new PatronKey(),
    registeredTime: 0,
  };
}
