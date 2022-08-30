import { initExcelHistory } from '../model/ExcelHistoryModel';
import { createStore } from 'shared/store/store';

export interface ExcelHistoryParams {
  searchUrl: any;
  searchParam: any;
  workType: string;
}

const [
  setExcelHistoryParams,
  onExcelHistoryParams,
  getExcelHistoryParams,
  useExcelHistoryParams,
] = createStore<ExcelHistoryParams>(initExcelHistory());

export { 
  setExcelHistoryParams,
  onExcelHistoryParams,
  getExcelHistoryParams,
  useExcelHistoryParams,
};