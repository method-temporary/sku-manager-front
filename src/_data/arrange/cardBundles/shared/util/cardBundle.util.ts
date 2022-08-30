import { CardBundleRdo } from '../../model';

export const getInitCardBundleRdo = (): CardBundleRdo => ({
  enabled: undefined,
  offset: 0,
  limit: 20,

  groupSequences: [],
  types: [],
  keyword: '',
});
