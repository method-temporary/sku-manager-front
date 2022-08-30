import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { LoaderService } from '../../Loader/present/logic/LoaderService';
import { Button, Modal } from 'semantic-ui-react';
import { baseUrl } from '../../../../Routes';
import React from 'react';

interface Props {
  open: boolean;
  onChangeOpen: () => void;
  fileName: string;
  uploadFile: (file: any) => void;
  onReadExcel: () => Promise<void>;
  resourceFileName: string;
}

interface States {}

@observer
@reactAutobind
class PolyglotExcelUploadModal extends ReactComponent<Props, States> {
  //
  private fileInputRef = React.createRef<HTMLInputElement>();

  async onReadExcel(): Promise<void> {
    //
    await LoaderService.instance.loadingCallback(this.props.onReadExcel);
  }

  render() {
    const { open, onChangeOpen, fileName, uploadFile, resourceFileName } = this.props;
    return (
      <>
        <Modal size="tiny" open={open}>
          <Modal.Header>
            엑셀 업로드
            <div className="fl-right" onClick={onChangeOpen}>
              <i className="material-icons">clear</i>
            </div>
          </Modal.Header>
          <Modal.Content>
            <p>Bulk 엑셀 양식 다운로드 후, 양식에 알맞게 정보를 입력합니다.</p>
            <p>&#10071;알맞는 ID 값을 입력해주세요.</p>
            <p>ID가 일치하지 않는 경우 수정이 누락뒬 수 있습니다.</p>
            <Button primary as="a" download href={baseUrl + 'resources/' + resourceFileName}>
              양식 다운로드
            </Button>
            <Button
              basic
              type="button"
              fluid
              content={fileName || '파일 선택'}
              labelPosition="left"
              icon="file"
              onClick={() => {
                if (this.fileInputRef && this.fileInputRef.current) {
                  this.fileInputRef.current.click();
                }
              }}
            />
            <input
              id="file"
              type="file"
              ref={this.fileInputRef}
              accept=".xlsx, .xls"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files[0])}
              hidden
            />
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={onChangeOpen} type="button">
              취소
            </Button>
            <Button primary onClick={this.onReadExcel} type="button">
              확인
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default PolyglotExcelUploadModal;
