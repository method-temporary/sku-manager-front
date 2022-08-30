import HomeType from './HomeType';
import Home from './Home';

export default interface HomeCdo {
  communityId?: string;
  type?: HomeType;
  introduce?: string;
  thumbnailId?: string;
  html?: string;
  draft?: number;
}

export function getEmptyHomeCdo(): HomeCdo {
  return {};
}

export function fromHome(home: Home): HomeCdo {
  const { communityId, type, introduce, thumbnailId, html, draft } = home;
  return { communityId, type, introduce, thumbnailId, html, draft };
}