import { decorate, observable } from 'mobx';

import { DenizenKey } from '@nara.platform/accent';

import { DramaEntityObservableModel, PolyglotModel, PatronKey, Test, ReportFileBox } from 'shared/model';

import { DifficultyLevel } from './vo/DifficultyLevel';
import { Descriptions } from './vo/Descriptions';
import { Instructor } from './vo/Instructor';
import { CubeTermModel } from './CubeTermModel';

export class CubeContentsModel extends DramaEntityObservableModel {
  //
  difficultyLevel: DifficultyLevel = DifficultyLevel.Basic;
  description: Descriptions = new Descriptions();
  reportFileBox: ReportFileBox = new ReportFileBox();

  instructors: Instructor[] = [];

  operator: DenizenKey = new PatronKey();
  registrantName: PolyglotModel = new PolyglotModel();
  organizerId: string = '';
  otherOrganizerName: string = '';

  tests: Test[] = [];
  tags: PolyglotModel = new PolyglotModel();
  tag: PolyglotModel = new PolyglotModel();

  surveyId: string = '';
  fileBoxId: string = '';

  commentFeedbackId: string = '';
  reviewFeedbackId: string = '';

  surveyTitle: string = '';
  surveyDesignerName: string = '';

  terms: CubeTermModel[] = [];
  mandatory: boolean = false;

  constructor(cubeContents?: CubeContentsModel) {
    super();
    if (cubeContents) {
      const description = new Descriptions(cubeContents.description);
      const reportFileBox = new ReportFileBox(cubeContents.reportFileBox);
      const operator = new PatronKey(cubeContents.operator);
      const registrantName = new PolyglotModel(cubeContents.registrantName);
      const terms = cubeContents.terms && cubeContents.terms.map((term) => new CubeTermModel(term));
      Object.assign(this, { ...cubeContents, description, reportFileBox, operator, registrantName, terms });
    }
  }
}

decorate(CubeContentsModel, {
  difficultyLevel: observable,
  description: observable,
  reportFileBox: observable,
  instructors: observable,
  operator: observable,
  registrantName: observable,
  organizerId: observable,
  otherOrganizerName: observable,
  tests: observable,
  terms: observable,
  tags: observable,
  tag: observable,
  surveyId: observable,
  fileBoxId: observable,
  commentFeedbackId: observable,
  reviewFeedbackId: observable,
  surveyTitle: observable,
  surveyDesignerName: observable,
  mandatory: observable,
});
