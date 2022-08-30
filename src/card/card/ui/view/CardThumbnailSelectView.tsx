import React, { useRef, useCallback } from 'react';
import { Button, Form, Radio, Segment, Image, List, Select, Card } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

import { RadioGroup } from 'shared/components';
import { getImagePath } from 'shared/helper';

import {
  onChangeRadio,
  onInitUploadThumbnailUrl,
  onReadUploadThumbnailUrl,
  onSelectPanoptoThumbnailUrl,
  useCardSelectThumbnail,
  onChangeSelectThumbnailSet,
  useSelectedOption,
  useSelectedThumbnailSet,
  onSelectThumbnailSetUrl,
  getPanoptoThumbnailUrl,
  getThumbnailSetUrl,
  getPreviewThumbnailUrl,
  useCardThumbnail,
} from 'card/card/present/logic/CardThumbnailSelectService';

interface CardThumbnailSelectViewProps {
  isUpdatable: boolean;
}

export function CardThumbnailSelectView(props: CardThumbnailSelectViewProps) {
  useCardThumbnail();
  const { isUpdatable } = props;
  const cardSelectThmbnail = useCardSelectThumbnail();
  const selectedOption = useSelectedOption() || '';
  const selectedThumbnailSet = useSelectedThumbnailSet() || [];
  const inputRef = useRef<HTMLInputElement>(null);

  const onClickFileUpload = useCallback(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  }, [inputRef]);

  if (cardSelectThmbnail === undefined) {
    return null;
  }

  const { panoptoThumbnails, selectRadio, uploadThumbnail, thumbnailImageUrl, thumbnailSelectOptions } =
    cardSelectThmbnail;

  if (
    !isUpdatable &&
    (window.location.pathname.includes('/learning-management/cards/card-detail') ||
      window.location.pathname.includes('/learning-management/cards/card-approval-detail'))
  ) {
    return (
      <Segment.Inline>
        {!isEmpty(thumbnailImageUrl) && (
          <Image src={getImagePath() + thumbnailImageUrl} size="small" verticalAlign="bottom" />
        )}
      </Segment.Inline>
    );
  }

  return (
    <>
      <Form.Group>
        <RadioGroup
          value={selectRadio || 'thumbnailSet'}
          values={['thumbnailSet', 'upload']}
          labels={['썸네일 Set', '직접 등록']}
          onChange={onChangeRadio}
        />
      </Form.Group>
      {selectRadio === 'thumbnailSet' && (
        <>
          <Form.Field>
            <Select
              placeholder="썸네일 Set을 선택해 주세요"
              options={thumbnailSelectOptions}
              onChange={onChangeSelectThumbnailSet}
              defaultValue="THUMB_A"
            />
          </Form.Field>
          <Form.Field width={4} />
          <div
            className="filebox-icon"
            style={{
              maxHeight: '21.5rem',
              width: '475px',
              height: '21.5rem',
              display: 'inline-block',
              padding: '10px',
            }}
          >
            <div className="depot-image-box">
              <Segment attached>
                <div className="preview-list">
                  <List horizontal>
                    {selectedOption?.includes('THUMB') &&
                      selectedThumbnailSet.map((thumbnailSet, index) => (
                        <div key={index} id={thumbnailSet.url} style={{ margin: '5px', display: 'inline-flex' }}>
                          <Radio
                            checked={thumbnailSet.checked}
                            value={thumbnailSet.url}
                            onClick={onSelectThumbnailSetUrl}
                          />
                          <Image
                            src={getThumbnailSetUrl(thumbnailSet.url)}
                            style={{ width: '185px', marginLeft: '5px' }}
                          />
                        </div>
                      ))}
                    {selectedOption === 'panopto' &&
                      panoptoThumbnails.map((thumbnail) => (
                        <div id={thumbnail.panoptoSessionId} style={{ margin: '5px', display: 'inline-flex' }}>
                          <Radio
                            checked={thumbnail.checked}
                            value={thumbnail.panoptoSessionId}
                            onClick={onSelectPanoptoThumbnailUrl}
                          />
                          <Image
                            src={getPanoptoThumbnailUrl(thumbnail.panoptoSessionId)}
                            style={{ width: '185px', marginLeft: '5px' }}
                          />
                        </div>
                      ))}
                  </List>
                </div>
              </Segment>
            </div>
          </div>
          <CardView url={getPreviewThumbnailUrl()} />
        </>
      )}
      {selectRadio === 'upload' && (
        <>
          <div>
            <Button
              className="file-select-btn"
              content={uploadThumbnail.uploadThumbnailFile?.name || '파일 선택'}
              labelPosition="left"
              icon="file"
              onClick={onClickFileUpload}
            />
            {uploadThumbnail.uploadThumbnailDataUrl && (
              <Button
                icon="cancel"
                style={{ marginBottom: '0.5rem', fontSize: '1rem' }}
                onClick={onInitUploadThumbnailUrl}
              />
            )}
          </div>
          <input id="file" type="file" ref={inputRef} onChange={onReadUploadThumbnailUrl} hidden />
          {uploadThumbnail.uploadThumbnailDataUrl && <CardView url={uploadThumbnail.uploadThumbnailDataUrl} />}
          <p className="info-text-gray">- JPG, PNG, GIF 파일을 등록하실 수 있습니다.</p>
          <p className="info-text-gray">- 최대 300KB 용량의 파일을 등록하실 수 있습니다.</p>
          <p className="info-text-gray">- 학습카드 썸네일의 경우 560x320의 사이즈를 추천합니다. (7:4 비율, 2배수)</p>
          <p className="info-text-gray">- 7:4 비율과 다를 경우 가장자리 영역이 잘려서 노출될 수 있습니다.</p>
        </>
      )}
    </>
  );
}

function CardView(props: { url: string }) {
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

  return (
    <Card style={{ display: 'inline-block', marginLeft: '10px' }}>
      <Image src="/manager/images/01_sample_image.png" style={sampleImageClass} />
      <div style={imageBoxClass}>
        <div style={imageInnerClass}>
          <Image src={props.url} style={imageClass} />
        </div>
      </div>
      <Image src="/manager/images/02_sample_contents.png" />
    </Card>
  );
}
