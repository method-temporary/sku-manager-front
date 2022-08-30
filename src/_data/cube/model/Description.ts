import { PolyglotModel } from '../../../shared/model';

export interface Description {
  //
  goal: PolyglotModel;
  applicants: PolyglotModel;
  description: PolyglotModel;
  completionTerms: PolyglotModel;
  guide: PolyglotModel;
}

export function getInitDescription() {
  //
  return {
    goal: new PolyglotModel(),
    applicants: new PolyglotModel(),
    description: new PolyglotModel(),
    completionTerms: new PolyglotModel(),
    guide: new PolyglotModel(),
  };
}
