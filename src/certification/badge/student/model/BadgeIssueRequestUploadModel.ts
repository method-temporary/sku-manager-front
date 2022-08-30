/* excel 일괄발급 업로드 model */
export class BadgeIssueRequestUploadModel {
  email: string = '';

  constructor(student?: BadgeIssueRequestUploadModel) {
    if (student) {
      Object.assign(this, student);
    }
  }
}
