import React from 'react';
import { observer } from 'mobx-react';
import { Image, Segment, Button } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import { getDepotFileBaseUrl } from 'shared/helper';

interface Props {
  uploadFile: (file: File, index: number) => void;
  resetImage: (index: number) => void;
  imageUrl?: string;
  //fileName: string;
  index: number;
}

@observer
@reactAutobind
export default class CollegeBannerImageAddView extends React.Component<Props> {
  //
  private fileInputRef = React.createRef<HTMLInputElement>();

  render() {
    const { uploadFile, resetImage, imageUrl, index } = this.props;
    /* const { fileName } = this.state; */
    return (
      <>
        <Button
          className="file-select-btn"
          content="파일 선택"
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files[0], index)}
          hidden
        />
        <p className="info-text-gray">- JPG, GIF, PNG, SVG 파일을 등록하실 수 있습니다.</p>
        <p className="info-text-gray">- 최대 300KB 용량의 파일을 등록하실 수 있습니다.</p>
        {imageUrl ? (
          <Segment.Inline>
            <Image src={`${getDepotFileBaseUrl()}${imageUrl}`} size="small" verticalAlign="bottom" />
            <Button onClick={() => resetImage(index)} type="button">
              Icon 초기화
            </Button>
          </Segment.Inline>
        ) : null}
      </>
    );
  }
}
