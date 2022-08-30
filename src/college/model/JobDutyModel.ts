import { PolyglotModel } from 'shared/model';

export class JobDutyModel {
  //
  id: string = '';
  jobGroupId: string = '';
  name: PolyglotModel = new PolyglotModel();
  registeredTime: number = 0;

  constructor(jobDutyModel: JobDutyModel) {
    //
    if (jobDutyModel) {
      const name = new PolyglotModel(jobDutyModel.name) || new PolyglotModel();

      Object.assign(this, { ...jobDutyModel, name });
    }
  }
}
