import { PolyglotModel } from '../../../../../shared/model';

export interface ReportFileBox {
  //
  fileBoxId: string;
  report: boolean; // Report 존재 여부
  reportName: PolyglotModel;
  reportQuestion: PolyglotModel;
}

export function getInitReportFileBox(): ReportFileBox {
  //
  return {
    reportName: new PolyglotModel(),
    reportQuestion: new PolyglotModel(),
    fileBoxId: '',
    report: false,
  };
}
