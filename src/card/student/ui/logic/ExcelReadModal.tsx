import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';

export const baseUrl = `${process.env.NODE_ENV}` === 'development' ? '/' : '/manager/';

interface Props {
  open: boolean;
  fileName: string;
  onChangeOpen: () => void;
  uploadFile: (file: any) => void;
  onReadExcel: () => Promise<void>;
  targetText?: string;
}

@reactAutobind
class ExcelReadModal extends React.Component<Props> {
  //
  private fileInputRef = React.createRef<HTMLInputElement>();

  async onReadExcel(): Promise<void> {
    //
    await LoaderService.instance.loadingCallback(this.props.onReadExcel);
  }

  render() {
    const { open, fileName, onChangeOpen, uploadFile, targetText } = this.props;
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
            <p>엑셀 양식 다운로드를 통해 양식에 맞게 정보를 입력해주세요. </p>
            <p>&#10071;이메일 정보가 정확하지 않으면 등록이 누락됩니다. </p>
            <Button primary as="a" download href={baseUrl + 'resources/cardStudentUpload.xlsx'}>
              양식 다운로드
            </Button>
            {/*<Button basic*/}
            {/*  fluid*/}
            {/*  content="양식 다운로드"*/}
            {/*  labelPosition="left"*/}
            {/*  icon="file"*/}
            {/*  onClick={downloadForm}*/}
            {/*/>*/}
            <p>{` ${(targetText && targetText) || '엑셀 파일을 업로드하면 학습자가 일괄 등록됩니다.'}`}</p>
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

export default ExcelReadModal;
