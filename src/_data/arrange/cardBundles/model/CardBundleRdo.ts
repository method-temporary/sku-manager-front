import { CardBundleType } from './vo';

export default interface CardBundleRdo {
  //
  enabled?: boolean;
  offset: number;
  limit: number;

  groupSequences: number[];
  types: CardBundleType[];

  keyword: string;
}
