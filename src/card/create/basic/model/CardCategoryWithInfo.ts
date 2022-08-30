import { CardCategory, PolyglotModel } from 'shared/model';
import { Category } from '../../../../_data/college/model';

export interface CardCategoryWithInfo extends CardCategory {
  //
  parentId: string;
  displayOrder: number;
  name: PolyglotModel;
}

export function getInitCardCategoryWithInfo(): CardCategoryWithInfo {
  //
  return {
    ...new CardCategory(),
    parentId: '',
    displayOrder: 0,
    name: new PolyglotModel(),
  };
}

export function getMainCategoryByCardCategory(cardCategory: CardCategory): CardCategoryWithInfo {
  //
  return {
    ...cardCategory,
    parentId: '',
    displayOrder: 0,
    name: new PolyglotModel(),
  };
}

export function getMainCategoryByCategory(category: Category): CardCategoryWithInfo {
  //
  return {
    ...category,
    parentId: '',
    displayOrder: 0,
    name: new PolyglotModel(),
  };
}

export function getSubCategoriesByCardCategories(cardCategories: CardCategory[]): CardCategoryWithInfo[] {
  //
  return cardCategories
    .filter((cardCategory) => !cardCategory.mainCategory)
    .map(
      (cardCategory) =>
        ({
          ...cardCategory,
          parentId: '',
          displayOrder: 0,
          name: new PolyglotModel(),
        } as CardCategoryWithInfo)
    );
}
