export class PostListViewXlsxModel {
  //
  No: string = '';
  카테고리: string = '';
  제목: string = '';
  등록일자: string = '';
  작성자: string = '';
  소속사: string = '';
  Email: string = '';
  처리상태: string = '';

  constructor(postXlsx: PostListViewXlsxModel) {
    //
    if (postXlsx) {
      Object.assign(this, { ...postXlsx });
    }
  }
}
