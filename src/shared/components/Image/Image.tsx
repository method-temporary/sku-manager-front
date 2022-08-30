import React from 'react';
import { includes } from 'lodash';

interface Props extends Record<string, any> {
  src: string;
}

export function srcParser(src: string) {
  if (
    src === null ||
    src === undefined ||
    includes(src, 'base64') ||
    includes(src, 'http') ||
    includes(src, '/static/') ||
    includes(src, '/profile/photo/')
  ) {
    return src;
  }

  // if (includes(src, 'files')) {
  //   return `https://mysuni.sk.com${src}`;
  // }

  if (includes(src, 'files')) {
    if (window.location.host.includes('stg-star')) {
      return `https://stg.mysuni.sk.com${src}`;
    }
    if (window.location.host.includes('ma-star')) {
      return `https://ma.mysuni.sk.com${src}`;
    }
    return `https://mysuni.sk.com${src}`;
  }

  let next = src.startsWith('/') ? src.substring(1) : src;

  if (!next.startsWith('suni-asset')) {
    next = `suni-asset/${next}`;
  }

  if (window.location.host === 'mysuni.sk.com') {
    next = `http://image.mysuni.sk.com/${next}`;
  } else {
    next = `/${next}`;
  }
  // 나머지는 상대경로 그대로 return
  return next;
}

function Image({ src, alt, className }: Props) {
  if (src === null || src === undefined || src === '') {
    return null;
  }

  return <img src={srcParser(src)} alt={alt} className={className} />;
}

export default Image;
