import { decorate, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';

export class Descriptions {
  //
  goal: PolyglotModel = new PolyglotModel();
  applicants: PolyglotModel = new PolyglotModel();
  description: PolyglotModel = new PolyglotModel();
  completionTerms: PolyglotModel = new PolyglotModel();
  guide: PolyglotModel = new PolyglotModel();

  constructor(descriptions?: Descriptions) {
    if (descriptions) {
      const goal = new PolyglotModel(descriptions.goal);
      const applicants = new PolyglotModel(descriptions.applicants);
      const description = new PolyglotModel(descriptions.description);
      const completionTerms = new PolyglotModel(descriptions.completionTerms);
      const guide = new PolyglotModel(descriptions.guide);
      Object.assign(this, { ...descriptions, goal, applicants, description, completionTerms, guide });
    }
  }
}

decorate(Descriptions, {
  goal: observable,
  applicants: observable,
  description: observable,
  completionTerms: observable,
  guide: observable,
});
