import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import { CardPreview } from './CardPreview';
import { CardthumbnailSizeValidator, extensionValidator } from 'shared/ui';
import CardThumbnailStore from '../cardThumbnail.store';
import CardCreateStore from 'card/create/CardCreate.store';
import { useThumbnailUploadMutation } from '../cardThumbnail.hook';

export const CardImageUpload = observer(() => {
  const { uploadImageUrl, uploadImageFile, setUploadImageUrl, setUploadImageFile } = CardThumbnailStore.instance;

  const inputRef = useRef<HTMLInputElement>(null);

  const onClickFileUpload = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  const onInitUploadThumbnailUrl = () => {
    setUploadImageUrl('');
    setUploadImageFile(undefined);
  };

  function onReadUploadThumbnailUrl(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files === null) {
      return;
    }

    const file = e.target.files[0];
    if (file === undefined) {
      return;
    }

    if (!CardthumbnailSizeValidator(file) || !extensionValidator(file)) {
      e.target.value = '';
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setUploadImageUrl(fileReader.result as string);
      setUploadImageFile(file);
    };
  }

  return (
    <>
      <div>
        <Button
          className="file-select-btn"
          content={uploadImageFile?.name || '파일 선택'}
          labelPosition="left"
          icon="file"
          onClick={onClickFileUpload}
        />
        {uploadImageUrl !== '' && (
          <Button
            icon="cancel"
            style={{ marginBottom: '0.5rem', fontSize: '1rem' }}
            onClick={onInitUploadThumbnailUrl}
          />
        )}
      </div>
      <input id="file" type="file" ref={inputRef} onChange={onReadUploadThumbnailUrl} hidden />
      {uploadImageUrl !== '' && <CardPreview url={uploadImageUrl} />}
      <p className="info-text-gray">- JPG, PNG, GIF 파일을 등록하실 수 있습니다.</p>
      <p className="info-text-gray">- 최대 300KB 용량의 파일을 등록하실 수 있습니다.</p>
      <p className="info-text-gray">- 학습카드 썸네일의 경우 560x320의 사이즈를 추천합니다. (7:4 비율, 2배수)</p>
      <p className="info-text-gray">- 7:4 비율과 다를 경우 가장자리 영역이 잘려서 노출될 수 있습니다.</p>
    </>
  );
});
