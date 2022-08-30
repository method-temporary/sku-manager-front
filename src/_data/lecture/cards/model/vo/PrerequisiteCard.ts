import { decorate, observable } from 'mobx';
import { GroupBasedAccessRule, PolyglotModel } from 'shared/model';

export class PrerequisiteCard {
  //
  prerequisiteCardName: PolyglotModel = new PolyglotModel();
  prerequisiteCardId: string = '';
  required: boolean = false;

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  constructor(prerequisiteCard?: PrerequisiteCard) {
    //
    if (prerequisiteCard) {
      Object.assign(this, { ...prerequisiteCard });
    }
  }
}

decorate(PrerequisiteCard, {
  prerequisiteCardName: observable,
  prerequisiteCardId: observable,
  required: observable,
  groupBasedAccessRule: observable,
});
