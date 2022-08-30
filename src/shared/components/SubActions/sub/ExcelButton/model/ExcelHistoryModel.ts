export interface Result {
  message: string;
}

export interface ExcelHistoryModel {
  downloadReason: string;
  fileName: string;
  searchParam: any;
  workType: string;
}

export function initExcelHistory(): any {
  return {
    searchUrl: '',
    searchParam: '',
    workType: null
  };
}
