import { decorate, observable } from 'mobx';
import { ReportFileBox as ReportFileBoxIF } from '_data/lecture/cards/model/vo';
import { PolyglotModel } from './PolyglotModel';

export class ReportFileBox implements ReportFileBoxIF {
  //
  fileBoxId: string = '';
  report: boolean = false;
  reportName: PolyglotModel = new PolyglotModel();
  reportQuestion: PolyglotModel = new PolyglotModel();

  constructor(reportFileBox?: ReportFileBox) {
    if (reportFileBox) {
      const reportName = new PolyglotModel(reportFileBox.reportName);
      const reportQuestion = new PolyglotModel(reportFileBox.reportQuestion);
      Object.assign(this, { ...reportFileBox, reportName, reportQuestion });
    }
  }
}

decorate(ReportFileBox, {
  fileBoxId: observable,
  report: observable,
  reportName: observable,
  reportQuestion: observable,
});
