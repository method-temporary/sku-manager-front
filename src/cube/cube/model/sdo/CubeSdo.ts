import { decorate, observable } from 'mobx';
import { CubeType, PolyglotModel, ReportFileBox, Test, PatronKey } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

import { CubeMaterialSdo } from './CubeMaterialSdo';
import { CubeTermModel } from '../CubeTermModel';

import { Category } from '../vo/Category';
import { DifficultyLevel } from '../vo/DifficultyLevel';
import { Descriptions } from '../vo/Descriptions';
import { Instructor } from '../vo/Instructor';

export class CubeSdo {
  //
  name: PolyglotModel = new PolyglotModel();
  type: CubeType = CubeType.Audio;
  categories: Category[] = [];
  sharingCineroomIds: string[] = [];

  learningTime: number = 0;

  difficultyLevel: DifficultyLevel = DifficultyLevel.Basic;
  description: Descriptions = new Descriptions();
  reportFileBox: ReportFileBox = new ReportFileBox();

  instructors: Instructor[] = [];

  surveyId: string = '';
  fileBoxId: string = '';
  tests: Test[] = [];

  operator: PatronKey = new PatronKey();
  organizerId: string = '';
  otherOrganizerName: string = '';
  mandatory: boolean = false;

  tags: PolyglotModel = new PolyglotModel();
  terms: CubeTermModel[] = [];

  materialSdo: CubeMaterialSdo = new CubeMaterialSdo();

  langSupports: LangSupport[] = [];

  constructor(cubeSdo?: CubeSdo) {
    //
    if (cubeSdo) {
      const name = new PolyglotModel(cubeSdo.name);
      const description = new Descriptions(cubeSdo.description);
      const reportFileBox = new ReportFileBox(cubeSdo.reportFileBox);
      const operator = new PatronKey(cubeSdo.operator);
      Object.assign(this, { ...cubeSdo, name, description, reportFileBox, operator });
    }
  }
}

decorate(CubeSdo, {
  name: observable,
  type: observable,
  categories: observable,
  sharingCineroomIds: observable,

  learningTime: observable,

  difficultyLevel: observable,
  description: observable,
  reportFileBox: observable,

  instructors: observable,

  surveyId: observable,
  fileBoxId: observable,
  tests: observable,

  operator: observable,
  organizerId: observable,
  otherOrganizerName: observable,
  mandatory: observable,

  tags: observable,

  materialSdo: observable,
});
