import { SupportType } from '../vo/SupportType';
import { PolyglotModel } from 'shared/model';

export default class CategoryCdo {
  //
  supportType: SupportType = SupportType.QNA;
  name: PolyglotModel = new PolyglotModel();
  parentId: string | null = null;
  displayOrder: number = 0;
}
