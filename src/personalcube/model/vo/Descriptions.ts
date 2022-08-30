import { decorate, observable } from 'mobx';

export class Descriptions {
  //
  goal: string = '';
  applicants: string = '';
  description: string = '';
  completionTerms: string = '';
  guide: string = '';

  constructor(description?: Descriptions) {
    if (Descriptions) {
      Object.assign(this, { ...description });
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
