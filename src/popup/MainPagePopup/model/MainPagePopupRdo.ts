import { PageModel } from 'shared/model';
import { MainPagePopupQueryModel } from './MainPagePopupQueryModel';

export class MainPagePopupRdo {
  //
  startDate: number = 0; // 조회시작일자
  endDate: number = 0; // 조회종료일자.
  title: string = ''; // 제목

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: MainPagePopupQueryModel, pageModel?: PageModel) {
    //
    if (searchModel && pageModel) {
      Object.assign(this, {
        startDate: searchModel.period.startDateLong,
        endDate: searchModel.period.endDateLong,
        title: searchModel.title,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default MainPagePopupRdo;
