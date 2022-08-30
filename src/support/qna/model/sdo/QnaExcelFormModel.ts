export class QnaExcelFormModel {
  //
  No: string = '';
  '접수채널': string = '';
  '카테고리': string = '';
  '세부카테고리': string = '';
  '과정명': string = '';
  '문의자 소속': string = '';
  '문의자 부서': string = '';
  '문의자 이름': string = '';
  '문의자 이메일': string = '';
  '문의 제목': string = '';
  '문의 내용': string = '';
  '문의일자': string = '';
  '처리상태': string = '';
  '담당조직': string = '';
  '답변담당자': string = '';
  '답변담당자 이메일': string = '';
  '답변 내용': string = '';
  '답변 일자': string = '';
  '만족도': string = '';
  '만족도 답변': string = '';

  constructor(qnaXlsx: QnaExcelFormModel) {
    //
    if (qnaXlsx) {
      Object.assign(this, { ...qnaXlsx });
    }
  }
}
