import { PageElementType, PageElementPosition } from './vo';

export class PageElementRdo {
  //
  position: PageElementPosition = PageElementPosition.Select;
  type: PageElementType | undefined = undefined;
  groupSequences: number[] = [];
  offset: number = 0;
  limit: number = 0;
}
