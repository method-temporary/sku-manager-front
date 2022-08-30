import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Segment, Button } from 'semantic-ui-react';
import { Image } from 'shared/components';

interface Props {
  uploadFile: (file: File) => void;
  resetImage: () => void;
  imageUrl?: string;
  fileName: string;
}

@observer
@reactAutobind
export default class QuestionImageAddView extends React.Component<Props> {
  //
  private fileInputRef = React.createRef<HTMLInputElement>();

  render() {
    const { uploadFile, resetImage, imageUrl, fileName } = this.props;
    /* const { fileName } = this.state; */
    return (
      <>
        <Button
          className="file-select-btn"
          content={fileName || '파일 선택'}
          labelPosition="left"
          icon="file"
          onClick={() => {
            if (this.fileInputRef && this.fileInputRef.current) {
              this.fileInputRef.current.value = '';
              this.fileInputRef.current.click();
            }
          }}
        />
        <input
          id="file"
          type="file"
          ref={this.fileInputRef}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files[0])}
          hidden
        />
        <p className="info-text-gray">- JPG, GIF, PNG, SVG 파일을 등록하실 수 있습니다.</p>
        <p className="info-text-gray">- 최대 300KB 용량의 파일을 등록하실 수 있습니다.</p>
        {imageUrl ? (
          <Segment.Inline>
            <Image src={imageUrl} size="small" verticalAlign="bottom" />
            <Button onClick={() => resetImage()} type="button">
              Icon 초기화
            </Button>
          </Segment.Inline>
        ) : null}
      </>
    );
  }
}
