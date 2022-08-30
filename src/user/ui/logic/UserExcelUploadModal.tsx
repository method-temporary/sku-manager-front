import React from 'react';
import { Button } from 'semantic-ui-react';
import { Modal } from 'shared/components';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

interface Props {
  fileName: string;
  uploadFile: (file: any, failFn?: () => void) => boolean | void;
  onCancel: () => void;
  onOk: (close: () => void) => void;
}

@observer
@reactAutobind
class UserExcelUploadModal extends React.Component<Props> {
  //
  fileInputRef = React.createRef<HTMLInputElement>();

  cancel(close: () => void) {
    //
    const { onCancel } = this.props;

    onCancel();

    close();
  }

  upload(file: File) {
    //
    const { uploadFile } = this.props;

    uploadFile(file, this.resetFile);
  }

  ok(close: () => void) {
    //
    const { onOk } = this.props;

    onOk(close);
  }

  resetFile() {
    //
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }
  }

  render() {
    //
    const { fileName } = this.props;

    return (
      <>
        <Modal
          size="tiny"
          trigger={
            <Button type="button" className="margin-right3">
              엑셀 업로드
            </Button>
          }
        >
          <Modal.Header>엑셀 업로드</Modal.Header>
          <Modal.Content>
            <p>구성원 엑셀 다운로드 후, 양식에 알맞게 정보를 입력합니다.</p>
            <p>&#10071; 사용자 그룹명을 바꾸지 말고 입력해주세요.</p>
            <p>&#10071; 사용자 그룹 할당 값은 1(숫자)로 입력해주세요.</p>
            <p>사용자 그룹명이 일치하지 않는 경우 등록이 누락될 수 있습니다.</p>
            <p>엑셀 파일을 업로드하면 학습자의 사용자 그룹이 일괄 등록됩니다.</p>
            <p>사용자 그룹을 등록할 구성원이 많으면 오래 걸릴 수 있습니다.</p>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && this.upload(e.target.files[0])}
              hidden
            />
          </Modal.Content>
          <Modal.Actions>
            <Modal.CloseButton basic onClickWithClose={(e, close) => this.cancel(close)} type="button">
              취소
            </Modal.CloseButton>
            <Modal.CloseButton primary onClickWithClose={(e, close) => this.ok(close)} type="button">
              확인
            </Modal.CloseButton>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default UserExcelUploadModal;
