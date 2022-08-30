import { decorate, observable } from 'mobx';
import { IdName } from 'shared/model';
import { TestModel } from '../../../card/card/model/vo/TestModel';

export class CubeContentsModel {
  type: string = '';
  contents: IdName = new IdName();
  lengthInMinute: number = 0;

  surveyId: string = '';
  surveyCaseId: string = '';
  surveyTitle: string = '';
  surveyDesignerName: string = '';

  examId: string = '';
  examTitle: string = '';
  examAuthorName: string = '';
  paperId: string = '';

  fileBoxId: string = '';
  tests: TestModel[] = [];

  constructor(cubeContents?: CubeContentsModel) {
    if (cubeContents) {
      const contents = (cubeContents.contents && new IdName(cubeContents.contents)) || this.contents;
      const tests: TestModel[] = [];
      if (cubeContents.tests != null) {
        cubeContents.tests.forEach((tst, index) => {
          if (tst.testId != null && tst.testId != '') {
            const reTest = new TestModel();
            reTest.testId = tst.testId;
            reTest.paperId = tst.paperId;
            reTest.successPoint = tst.successPoint;
            reTest.examTitle = tst.examTitle;

            tests.push(reTest);
          }
        });
      }
      Object.assign(this, { ...cubeContents, contents, tests });
      this.type = (cubeContents.type && cubeContents.type) || '';
    }
  }
}

decorate(CubeContentsModel, {
  type: observable,
  contents: observable,
  surveyId: observable,
  surveyCaseId: observable,
  surveyTitle: observable,
  surveyDesignerName: observable,
  examId: observable,
  examTitle: observable,
  examAuthorName: observable,
  paperId: observable,
  lengthInMinute: observable,
  fileBoxId: observable,
  tests: observable,
});
