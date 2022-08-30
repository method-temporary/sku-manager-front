import { PageModel } from '../model';

export const setOffsetLimit = (changeFn: (name: string, value: any) => void, pageModel: PageModel) => {
  //
  changeFn('offset', pageModel.offset);
  changeFn('limit', pageModel.limit);
};
