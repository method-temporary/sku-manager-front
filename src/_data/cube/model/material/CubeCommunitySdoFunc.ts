import { CubeCommunity } from './CubeCommunity';

export interface CubeCommunitySdo {
  communityId: string;
}

function fromCommunity(community: CubeCommunity): CubeCommunitySdo {
  return {
    ...community,
  };
}

export const CubeCommunitySdoFunc = { fromCommunity };
