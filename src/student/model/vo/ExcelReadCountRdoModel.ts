export class ExcelReadCountRdoModel {
  //
  requestCount: number = 0;
  successCount: number = 0;
  failed: string[] = [];

  constructor(excelReadCountRdo: ExcelReadCountRdoModel) {
    //
    if (excelReadCountRdo) {
      this.requestCount = excelReadCountRdo.requestCount;
      this.successCount = excelReadCountRdo.successCount;
      this.failed = excelReadCountRdo.failed;
    }
  }
}
