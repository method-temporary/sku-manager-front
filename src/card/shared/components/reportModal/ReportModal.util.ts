import { PolyglotModel } from 'shared/model';
import ReportModalStore from './ReportModal.store';

export const onChangeReportModalPolyglot = (name: string, value: PolyglotModel) => {
  //
  const { setReportName, setReportQuestion } = ReportModalStore.instance;

  if (name === 'reportName') {
    // Report 명
    setReportName(value as PolyglotModel);
  } else if (name === 'reportQuestion') {
    // 작성 가이드
    setReportQuestion(value as PolyglotModel);
  }
};
