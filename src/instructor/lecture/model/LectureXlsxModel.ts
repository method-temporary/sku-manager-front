export class LectureXlsxModel {
  //
  No: string = '';
  과정명: string = '';
  교육형태: string = '';
  Channel: string = '';
  교육기관?: string = '';
  학습인원?: number = 0;
  이수인원?: number = 0;
  강의시간?: number = 0;
  인정학습시간?: number = 0;
  등록일자: string = '';

  constructor(lectureXlsxModel: LectureXlsxModel) {
    //
    if (lectureXlsxModel) {
      Object.assign(this, { ...lectureXlsxModel });
    }
  }
}
