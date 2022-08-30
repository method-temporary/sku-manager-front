import { decorate, observable } from 'mobx';
import { GroupBasedAccessRule, PolyglotModel } from 'shared/model';

export default class ChannelSdo {
  //
  id: string = '';
  name: PolyglotModel = new PolyglotModel();
  description: PolyglotModel = new PolyglotModel();
  displayOrder: number = 0;
  enabled: boolean = true;
  registeredTime: number = 0;

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  selected: boolean = false;
  modified: string = '';

  beforeChangeName: PolyglotModel = new PolyglotModel();

  parentId: string | null = null;
  children: ChannelSdo[] = [];

  constructor(channelSdo?: ChannelSdo) {
    if (channelSdo) {
      const groupBasedAccessRule = new GroupBasedAccessRule(channelSdo.groupBasedAccessRule);
      const name = new PolyglotModel(channelSdo.name);
      const description = new PolyglotModel(channelSdo.description);
      const modified = '';
      const beforeChangeName = new PolyglotModel(channelSdo.name);
      const children = (channelSdo.children && channelSdo.children.length && [...channelSdo.children]) || [];
      Object.assign(this, {
        ...channelSdo,
        groupBasedAccessRule,
        name,
        description,
        modified,
        beforeChangeName,
        children,
      });
    }
  }
}

decorate(ChannelSdo, {
  id: observable,
  name: observable,
  description: observable,
  displayOrder: observable,
  enabled: observable,
  groupBasedAccessRule: observable,
  registeredTime: observable,

  selected: observable,
  modified: observable,
  beforeChangeName: observable,
  parentId: observable,
  children: observable,
});
