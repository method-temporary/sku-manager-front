import { Category } from '../../../../college/model';

export interface CardCategory extends Category {}

export function getInitCardCategory() {
  //
  return {
    mainCategory: false,
    channelId: '',
    collegeId: '',
  } as CardCategory;
}
