export class ExcelReadCountRdoModel {
  //
  studentCdosCount: number = 0;
  successCount: number = 0;
  failed: string [] = [];


  constructor(excelReadCountRdo: ExcelReadCountRdoModel) {
    //
    if (excelReadCountRdo) {
      this.studentCdosCount = excelReadCountRdo.studentCdosCount;
      this.successCount = excelReadCountRdo.successCount;
      this.failed = excelReadCountRdo.failed;
    }
  }
}
