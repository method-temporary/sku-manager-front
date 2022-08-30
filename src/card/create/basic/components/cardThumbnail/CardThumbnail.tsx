import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Segment, Image, Form, RadioProps } from 'semantic-ui-react';
import { getImagePath } from 'shared/helper';
import { RadioGroup } from 'shared/components';
import CardThumbnailStore, { CardThumbnailRadio } from './cardThumbnail.store';
import { isEmpty } from 'lodash';
import { ThumbnailSet } from './components/ThumbnailSet';
import { CardImageUpload } from './components/CardImageUpload';
import CardCreateStore from 'card/create/CardCreate.store';

interface CardThumbnailProps {
  readonly?: boolean;
}

export const CardThumbnail = observer(({ readonly }: CardThumbnailProps) => {
  const { cardThumbnailRadio, setCardThumbnailRadio, initCardThumbnaelState } = CardThumbnailStore.instance;
  const { thumbnailImagePath } = CardCreateStore.instance;

  useEffect(() => {
    return () => {
      initCardThumbnaelState();
    };
  }, []);

  const onChangeRadio = (_: React.FormEvent, data: RadioProps) => {
    setCardThumbnailRadio(data.value as CardThumbnailRadio);
  };

  if (readonly) {
    return (
      <Segment.Inline>
        {!isEmpty(thumbnailImagePath) && (
          <Image src={getImagePath() + thumbnailImagePath} size="small" verticalAlign="bottom" />
        )}
      </Segment.Inline>
    );
  }

  return (
    <>
      <Form.Group>
        <RadioGroup
          value={cardThumbnailRadio || 'thumbnailSet'}
          values={['thumbnailSet', 'upload']}
          labels={['썸네일 Set', '직접 등록']}
          onChange={onChangeRadio}
        />
      </Form.Group>
      {cardThumbnailRadio === 'thumbnailSet' && <ThumbnailSet />}
      {cardThumbnailRadio === 'upload' && <CardImageUpload />}
    </>
  );
});
