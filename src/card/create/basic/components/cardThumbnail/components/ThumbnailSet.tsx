import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { List, Radio, Segment, Image, Form, Select, DropdownProps } from 'semantic-ui-react';
import { useFindCubePanoptoIdsMutation, useFindIconGroups, useFindIcons } from '../cardThumbnail.hook';
import CardThumbnailStore from '../cardThumbnail.store';
import { getPanoptoThumbnailUrl, getSelectOption, getThumbnailSetUrl } from '../cardThumbnail.utils';
import { CardPreview } from './CardPreview';
import CardCreateStore from 'card/create/CardCreate.store';
import LearningContentsStore from 'card/create/learning/learningPlan/LearningContents/LearningContents.store';
import { isEmpty } from 'lodash';

export const ThumbnailSet = observer(() => {
  const { thumbnailImageUrl, setThumbnailImageUrl } = CardThumbnailStore.instance;
  const { thumbnailImagePath } = CardCreateStore.instance;
  const { learningContents } = LearningContentsStore.instance;

  const [groupId, setGroupId] = useState<string>('');

  const { data: iconGroupData } = useFindIconGroups('CARD_THUMB');
  const { data: iconsData } = useFindIcons(groupId);
  const { mutate: findCubePanoptoIdsMutation, data: panoptoData } = useFindCubePanoptoIdsMutation();

  useEffect(() => {
    if (thumbnailImagePath !== '') {
      setThumbnailImageUrl(thumbnailImagePath);
    } else {
      iconsData && !isEmpty(iconsData) && setThumbnailImageUrl(iconsData[0].fileUri);
    }
  }, [iconsData]);

  useEffect(() => {
    if (iconGroupData) {
      setGroupId(iconGroupData[0].id);
    }
  }, [iconGroupData]);

  // 판옵토 목록을 선택 했을 시 판옵토 이미지를 가져온다.
  useEffect(() => {
    if (groupId === 'panopto') {
      const cubeIds: string[] = [];

      learningContents.map((card) => {
        if (card.learningContentType === 'Chapter' && card.children) {
          card.children.map((childrenCard) => cubeIds.push(childrenCard.contentId));
        }

        cubeIds.push(card.contentId);
      });

      if (cubeIds !== undefined && !isEmpty(cubeIds)) {
        findCubePanoptoIdsMutation(cubeIds);
      }
    }
  }, [groupId]);

  const onChangeGroupId = (_: React.SyntheticEvent, data: DropdownProps) => {
    setGroupId(data.value as string);
  };

  const onClickThumbnailUrl = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setThumbnailImageUrl(e.currentTarget.id);
  };

  const onClickPanoptoThumbnailUrl = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setThumbnailImageUrl(e.currentTarget.id);
  };

  return (
    <>
      <Form.Field>
        <Select
          placeholder="썸네일 Set을 선택해 주세요"
          options={getSelectOption(iconGroupData)}
          onChange={onChangeGroupId}
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
                {groupId.includes('THUMB') &&
                  iconsData?.map((thumbnail) => (
                    <div
                      key={thumbnail.fileUri}
                      id={thumbnail.fileUri}
                      onClick={onClickThumbnailUrl}
                      style={{ margin: '5px', display: 'inline-flex' }}
                    >
                      <Radio checked={thumbnail.fileUri === thumbnailImageUrl} />
                      <Image
                        src={getThumbnailSetUrl(thumbnail.fileUri)}
                        style={{ width: '185px', marginLeft: '5px' }}
                      />
                    </div>
                  ))}
                {groupId === 'panopto' &&
                  panoptoData?.map((thumbnail) => (
                    <div
                      key={thumbnail.panoptoSessionId}
                      id={thumbnail.panoptoSessionId}
                      onClick={onClickPanoptoThumbnailUrl}
                      style={{ margin: '5px', display: 'inline-flex' }}
                    >
                      <Radio checked={thumbnailImageUrl === thumbnail.panoptoSessionId} />
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
      <CardPreview url={thumbnailImageUrl} />
    </>
  );
});
