import { CreatorModel, PolyglotModel } from 'shared/model';

export class JobGroupModel {
  //
  creator: CreatorModel = new CreatorModel();
  id: string = '';
  jobGroupType: string = '';
  name: PolyglotModel = new PolyglotModel();
  registeredTime: number = 0;

  constructor(jobGroupModel: JobGroupModel) {
    //
    if (jobGroupModel) {
      const name = new PolyglotModel(jobGroupModel.name) || new PolyglotModel();

      Object.assign(this, { ...jobGroupModel, name });
    }
  }
}
