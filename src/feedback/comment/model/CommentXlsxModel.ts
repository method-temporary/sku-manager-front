export class CommentXlsxModel {
  //
  No: string = '';
  소속사: string = '';
  '소속조직(팀)': string = '';
  작성자: string = '';
  Email: string = '';
  댓글내용: string = '';
  등록일: string = '';
  댓글상태: string = '';
  댓글관리: string = '';

  constructor(commentXlsx: CommentXlsxModel) {
    //
    if (commentXlsx) {
      Object.assign(this, { ...commentXlsx });
    }
  }
}
