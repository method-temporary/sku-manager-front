export class UserExcelUploadResponse {
  //
  failedEmails: string[] = [];
  requestCount: number = 0;
  successCount: number = 0;

  constructor(skProfileExcelUploadResponse?: UserExcelUploadResponse) {
    if (skProfileExcelUploadResponse) {
      Object.assign(this, { ...skProfileExcelUploadResponse });
    }
  }
}
