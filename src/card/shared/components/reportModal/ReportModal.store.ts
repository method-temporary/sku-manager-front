import { action, observable } from 'mobx';
import { PolyglotModel } from 'shared/model';
import { ReportFileBox } from '_data/lecture/cards/model/vo';

class ReportModalStore {
  //
  static instance: ReportModalStore;

  @observable
  reportName: PolyglotModel = new PolyglotModel();

  @observable
  reportQuestion: PolyglotModel = new PolyglotModel();

  @observable
  fileBoxId: string = '';

  @observable
  report: boolean = false;

  @action.bound
  setReportName(reportName: PolyglotModel) {
    this.reportName = reportName;
  }

  @action.bound
  setReportQuestion(reportQuestion: PolyglotModel) {
    this.reportQuestion = reportQuestion;
  }

  @action.bound
  setFileBoxId(fileBoxId: string) {
    this.fileBoxId = fileBoxId;
  }

  @action.bound
  setReportStore(reportFileBox: ReportFileBox) {
    this.reportName = reportFileBox.reportName;
    this.reportQuestion = reportFileBox.reportQuestion;
    this.fileBoxId = reportFileBox.fileBoxId;
    this.report = reportFileBox.report;
  }

  @action.bound
  reset() {
    this.reportName = new PolyglotModel();
    this.reportQuestion = new PolyglotModel();
    this.fileBoxId = '';
    this.report = false;
  }
}

ReportModalStore.instance = new ReportModalStore();
export default ReportModalStore;
