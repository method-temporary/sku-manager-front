import { decorate, observable } from 'mobx';

export class ReportFileBox {
  //
  fileBoxId: string = '';
  reportName: string = '';
  reportQuestion: string = '';

  constructor(reportFileBox?: ReportFileBox) {
    if (reportFileBox) {
      Object.assign(this, { ...reportFileBox });
    }
  }
}

decorate(ReportFileBox, {
  fileBoxId: observable,
  reportName: observable,
  reportQuestion: observable,
});
