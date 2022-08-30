export interface RelatedUrl {
  title: string;
  url: string;
}

function initialize(): RelatedUrl {
  return {
    title: '',
    url: '',
  };
}

export const RelatedUrlFunc = { initialize };
