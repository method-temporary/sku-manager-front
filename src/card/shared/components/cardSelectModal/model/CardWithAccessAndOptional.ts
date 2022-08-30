import { CardWithAccessRuleResult } from '../../../../../_data/lecture/cards/model/CardWithAccessRuleResult';

export interface CardWithAccessAndOptional extends CardWithAccessRuleResult {
  //
  required?: boolean;
  relatedCardId?: string;
}
