import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal } from 'semantic-ui-react';
import { baseUrl } from 'Routes';
import { reactAlert } from '@nara.platform/accent';
import { AutoEncourageExcludedStudentCdo } from '_data/lecture/autoEncourageExcludedStudents/model/AutoEncourageExcludedStudentCdo';
import XLSX from 'xlsx';
import { WorkBook } from 'xlsx';
import { useUploadByExcel } from '../exclusionManagementTab.hooks';

interface dataType {
  Email: string;
  __rowNum__: number;
}

interface Params {
  cardId: string;
}

export const ExclusionExcelModal = () => {
  const { mutate: excelUploadMutate } = useUploadByExcel();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams<Params>();
  const { cardId } = params;

  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [excludeStudentCdo, setExcludeStudentCdo] = useState<AutoEncourageExcludedStudentCdo[]>();

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onSelectedFile = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onChangeExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files && uploadFile(e.target.files[0], cardId);
  };

  const checkEmail = (email: string) => {
    const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(email)) {
      return false;
    } else {
      return true;
    }
  };

  const uploadFile = (file: File, cardId: string) => {
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      let binary = '';

      const data = new Uint8Array(e.target.result);
      const length = data.byteLength;

      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }

      const workbook: WorkBook = XLSX.read(binary, { type: 'binary' });

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json<dataType>(workbook.Sheets[item]);

        if (jsonArray.length === 0) {
          return;
        }

        // 공백 확인
        const excelData = jsonArray
          .map((data) => {
            return data.Email.replace('\n', '').trim();
          })
          .filter((a) => a !== '');

        const checkedEmails = excelData.filter((data) => checkEmail(data));

        if (excelData.length !== checkedEmails.length) {
          reactAlert({
            title: '제외대상 일괄등록',
            message: '엑셀에 이메일 형식으로 입력해주세요.',
          });
          return;
        }

        const confirmList = checkedEmails.map((email) => {
          return { cardId, email };
        });

        setExcludeStudentCdo(confirmList);
        setFileName(file.name);
      });
    };

    if (file && file instanceof File) {
      fileReader.readAsArrayBuffer(file);
    }
  };

  const onRegisterExcel = () => {
    if (excludeStudentCdo === undefined) {
      reactAlert({
        title: '자동독려 제외대상 추가',
        message: '엑셀 파일을 선택해주세요.',
      });
      return;
    }

    excelUploadMutate(excludeStudentCdo);
    setFileName('');
    setExcludeStudentCdo([]);
    onClose();
  };

  return (
    <>
      <Modal
        size="tiny"
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        trigger={<Button type="button">제외대상 엑셀 일괄등록</Button>}
      >
        <Modal.Header>자동독려 제외대상 일괄등록</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>엑셀 양식 다운로드 후, 양식에 알맞게 정보를 입력합니다.</p>
            <p>양식에 맞지 않을 경우 제외대상 등록이 누락될 수 있습니다.</p>
            <Button primary as="a" download href={baseUrl + 'resources/자동독려_일괄등록_엑셀양식.xlsx'}>
              양식 다운로드
            </Button>
            <div>
              <br />
            </div>
            <Button
              basic
              type="button"
              fluid
              content={fileName || '파일 선택'}
              labelPosition="left"
              icon="file"
              onClick={onSelectedFile}
            />
            <input
              id="file"
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              onChange={onChangeExcelUpload}
              hidden
            />
          </Modal.Description>
        </Modal.Content>

        <Modal.Actions>
          <Button onClick={onRegisterExcel} type="button">
            확인
          </Button>
          <Button onClick={onClose} type="button">
            취소
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
