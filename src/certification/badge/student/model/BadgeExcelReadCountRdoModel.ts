export class BadgeExcelReadCountRdoModel {
  //
  studentsCount: number = 0;
  successCount: number = 0;
  failed: string[] = [];

  constructor(excelReadCountRdo: BadgeExcelReadCountRdoModel) {
    //
    if (excelReadCountRdo) {
      this.studentsCount = excelReadCountRdo.studentsCount;
      this.successCount = excelReadCountRdo.successCount;
      this.failed = excelReadCountRdo.failed;
    }
  }
}
