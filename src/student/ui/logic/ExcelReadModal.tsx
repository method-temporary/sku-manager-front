import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { baseUrl } from '../../../Routes';

interface Props {
  open: boolean;
  onChangeOpen: () => void;
  fileName: string;
  uploadFile: (file: any) => void;
  onReadExcel: () => void;
}

class ExcelReadModal extends React.Component<Props> {
  //
  private fileInputRef = React.createRef<HTMLInputElement>();
  render() {
    const { open, onChangeOpen, fileName, uploadFile, onReadExcel } = this.props;
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
            <p>엑셀 양식 다운로드를 선택하여 엑셀 파일을 다운로드 후, 양식에 알맞게 정보를 입력합니다.</p>
            <p>&#10071;이메일 정보를 정확하게 입력해 주세요.</p>
            <p>이메일 정보가 데이터베이스와 일치하지 않는 경우 등록이 누락될 수 있습니다.</p>
            <Button primary as="a" download href={baseUrl + 'resources/학습자_등록_양식.xlsx'}>
              양식 다운로드
            </Button>
            {/*<Button basic*/}
            {/*  fluid*/}
            {/*  content="양식 다운로드"*/}
            {/*  labelPosition="left"*/}
            {/*  icon="file"*/}
            {/*  onClick={downloadForm}*/}
            {/*/>*/}
            <p>엑셀 파일을 업로드하면 학습자가 일괄 등록됩니다.</p>
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
            <Button primary onClick={onReadExcel} type="button">
              확인
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default ExcelReadModal;
