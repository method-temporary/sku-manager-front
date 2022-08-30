import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { getPanoptoThumbnailUrl, getThumbnailSetUrl } from '../cardThumbnail.utils';

export function CardPreview(props: { url: string }) {
  const sampleImageClass = {
    position: 'absolute',
    zIndex: '1',
  };

  const imageBoxClass = {
    position: 'relative',
    height: '170px',
  } as React.CSSProperties;

  const imageInnerClass = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  } as React.CSSProperties;

  const imageClass = {
    display: 'block',
    width: 'auto',
    height: '100%',
    maxWidth: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  };

  const imagePath = () => {
    // 직접 등록의 경우imagePath
    if (props.url.includes('data')) {
      return props.url;
    }
    // 기본 이미지 또는 업로드된 이미지
    if (props.url.includes('icon' || 'thumb')) {
      return getThumbnailSetUrl(props.url);
    }
    // 판옵토 이미지
    return getPanoptoThumbnailUrl(props.url);
  };

  return (
    <Card style={{ display: 'inline-block', marginLeft: '10px' }}>
      <Image src="/manager/images/01_sample_image.png" style={sampleImageClass} />
      <div style={imageBoxClass}>
        <div style={imageInnerClass}>
          <Image src={imagePath()} style={imageClass} />
        </div>
      </div>
      <Image src="/manager/images/02_sample_contents.png" />
    </Card>
  );
}
