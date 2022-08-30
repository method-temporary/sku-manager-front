import { createStore } from 'shared/store';
import { ReportViewModel } from '../viewModel/ReportViewModel';

const [setReportViewModel, onReportViewModel, getReportViewModel, useReportViewModel] = createStore<ReportViewModel>();

export { setReportViewModel, onReportViewModel, getReportViewModel, useReportViewModel };
