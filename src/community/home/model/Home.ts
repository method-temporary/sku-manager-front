import HomeType from './HomeType';

export default interface Home {
  id?: string;
  communityId?: string;
  type: HomeType;
  introduce?: string;
  thumbnailId?: string;
  html?: string;
  draft?: number;
  color?: string;
}

export function getEmptyHome(): Home {
  return {
    id: '',
    communityId: '',
    type: "BASIC",
    introduce: '',
    thumbnailId: '',
    html: '',
    draft: 0,
    color: '',
  };
}