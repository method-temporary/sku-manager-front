import React, { useRef, useCallback } from 'react';
import { FormTable, Image } from 'shared/components';
import { Button, Form } from 'semantic-ui-react';
import { PortletContentItem } from './portletContentCreate.models';

interface PortletContentCreateViewProps {
  content: PortletContentItem;
  onChangeImage: (contentNo: number, file: File) => void;
  onChangeDescription: (contentNo: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeLinkUrl: (contentNo: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddContent: (contentNo: number) => void;
  onRemoveContent: (contentNo: number) => void;
  removeDisabled: boolean;
}

export function PortletContentCreateView({
  content,
  onChangeImage,
  onChangeDescription,
  onChangeLinkUrl,
  onAddContent,
  onRemoveContent,
  removeDisabled,
}: PortletContentCreateViewProps) {
  const imageRef = useRef<HTMLInputElement>(null);

  const onClickImageButton = useCallback(() => {
    if (imageRef && imageRef.current) {
      imageRef.current.click();
    }
  }, [imageRef]);

  return (
    <>
      <FormTable.Row name="이미지">
        {
          <>
            <Button
              className="file-select-btn"
              content={content.imageUrl || '파일 선택'}
              labelPosition="left"
              icon="file"
              onClick={onClickImageButton}
            />
            <input
              type="file"
              ref={imageRef}
              onChange={e => e.currentTarget.files && onChangeImage(content.contentNo, e.currentTarget.files[0])}
              hidden
            />
            {content.imageUrl !== '' && <Image src={content.imageUrl} />}
            <p className="info-text-gray">- JPG, GIF, PNG 파일을 등록하실 수 있습니다.</p>
            <p className="info-text-gray">- 파일 등록 시, 160x94 크기의 파일을 등록해 주세요.</p>
            <p className="info-text-gray">- 최대 300kb 용량의 파일을 등록하실 수 있습니다.</p>
            <p className="info-text-gray" style={{ color: 'red', fontWeight: 'bold' }}>- toktok 은 124x69 크기, 최대 100kb 용량의 파일을 등록할 수 있습니다.</p>
          </>
        }
      </FormTable.Row>
      <FormTable.Row required name="내용/링크">
        {
          <>
            <Form.Input
              placeholder="내용을 입력해 주세요."
              value={content.description}
              onChange={(e) => onChangeDescription(content.contentNo, e)}
            />
            <Form.Group>
              <Form.Input
                width={16}
                placeholder="링크를 입력해 주세요."
                value={content.linkUrl}
                onChange={(e) => onChangeLinkUrl(content.contentNo, e)}
              />
              <Form.Button
                icon="plus"
                size="mini"
                basic
                onClick={() => onAddContent(content.contentNo)}
              />
              {removeDisabled === false && (
                <Form.Button
                  icon="minus"
                  size="mini"
                  basic
                  onClick={() => onRemoveContent(content.contentNo)}
                />
              )}
            </Form.Group>
          </>
        }
      </FormTable.Row>
    </>
  );
}