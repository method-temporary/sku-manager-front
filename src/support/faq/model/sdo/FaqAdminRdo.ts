import { PolyglotModel } from 'shared/model';

export default class FaqAdminRdo {
  //
  startDate: number = 0;
  endDate: number = 0;

  categoryId: string = '';
  title: PolyglotModel = new PolyglotModel();
  registrantName: PolyglotModel = new PolyglotModel();

  limit: number = 0;
  offset: number = 0;
}
