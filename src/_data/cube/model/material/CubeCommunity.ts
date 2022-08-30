import { DramaEntity } from '@nara.platform/accent';
import { PatronKey } from '../../../../shared/model';

export interface CubeCommunity extends DramaEntity {
  communityId: string;
}

export function getInitCubeCommunity(): CubeCommunity {
  //
  return {
    communityId: '',
    id: '',
    patronKey: new PatronKey(),
    entityVersion: 0,
  };
}
