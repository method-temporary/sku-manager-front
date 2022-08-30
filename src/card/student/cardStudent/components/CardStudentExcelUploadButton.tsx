import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Container } from 'semantic-ui-react';
import ExcelReadModal from '../../ui/logic/ExcelReadModal';
import CardStudentUploadResultListModal from '../../ui/logic/CardStudentUploadResultListModal';
import XLSX from 'xlsx';
import { useParams } from 'react-router';
import CardStudentStore from '../CardStudent.store';
import { useFindCardStudentForAdminStudent } from '../CardStudent.hooks';
import { useQuery, useQueryClient } from 'react-query';
import { queryKeys } from '../../../../query/queryKeys';
import { LoaderService } from '../../../../shared/components/Loader';

export const CardStudentExcelUploadButton = observer(() => {
  //
  const params = useParams<{ cardId: string }>();
  const queryClient = useQueryClient();

  const [isOpenExcelReadModal, setOpenExcelReadModal] = useState<boolean>(false);
  const [isOpenExcelReadFailedListModal, setOpenExcelReadFailedListModal] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [excelEmailList, setExcelEmailList] = useState<string[]>([]);

  const { uploadFailedList, cardStudentParams, setParams } = CardStudentStore.instance;

  const { data: students, isLoading, refetch, isRefetching } = useFindCardStudentForAdminStudent(cardStudentParams);

  const clearExcelUpload = () => {
    // const { clearExcelUpload } = this.injected.studentService;
    // clearExcelUpload();

    setOpenExcelReadModal(false);
    setOpenExcelReadFailedListModal(false);
    setFileName('');
    setResultText('');
  };

  const onOpenExcelUpload = () => {
    clearExcelUpload();
    setOpenExcelReadModal(!isOpenExcelReadModal);
    setOpenExcelReadFailedListModal(false);
  };

  const onReadExcel = async () => {
    //
    const { registerCardStudents, cardStudentQuery } = CardStudentStore.instance;

    const { cardId: targetCardId } = params;

    /* eslint-disable no-await-in-loop */
    LoaderService.instance.openPageLoader(true);
    for (let i = 0; i < excelEmailList.length; i++) {
      //
      const email = excelEmailList[i];
      await registerCardStudents(targetCardId, email, cardStudentQuery.round);
    }
    const { uploadFailedList } = CardStudentStore.instance;

    const resultText = `총 ${excelEmailList.length}건 중 ${
      excelEmailList.length - (uploadFailedList && uploadFailedList.length)
    }건 성공 / ${uploadFailedList && uploadFailedList.length}건 실패`;

    setResultText(resultText);
    onClickOpenExcelUploadFailedList();

    setExcelEmailList([]);
    LoaderService.instance.closeLoader(true);
  };

  const uploadFile = (file: File) => {
    //
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      let binary = '';
      let readList: any[] = [];
      const data = new Uint8Array(e.target.result);
      const length = data.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const workbook: any = XLSX.read(binary, { type: 'binary' });

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[item]);
        if (jsonArray.length === 0) {
          return;
        }
        readList = jsonArray;
        readList = readList.map((data) => data.email);
      });

      setExcelEmailList(readList);
      setFileName(file.name);
    };

    fileReader.readAsArrayBuffer(file);
  };

  const onClickOpenExcelUploadFailedList = () => {
    setOpenExcelReadModal(false);
    setOpenExcelReadFailedListModal(true);
  };

  const onCloseModal = () => {
    //
    const { setUploadFailedList } = CardStudentStore.instance;

    setOpenExcelReadFailedListModal(false);
    setOpenExcelReadModal(false);
    setUploadFailedList([]);
    queryClient.invalidateQueries(queryKeys.findCardStudentForAdmin_Student(cardStudentParams));
    setParams();
    // queryClient.refetchQueries(queryKeys.findCardStudentForAdmin_Student(cardStudentParams));
  };

  return (
    <>
      <Button type="button" className="button" onClick={onOpenExcelUpload}>
        엑셀 일괄 업로드
      </Button>
      <ExcelReadModal
        open={isOpenExcelReadModal}
        fileName={fileName}
        onChangeOpen={onOpenExcelUpload}
        uploadFile={uploadFile}
        onReadExcel={onReadExcel}
        targetText="엑셀 파일을 업로드하면 Card 및 하위 Cube에 학습자가 추가됩니다."
      />
      <CardStudentUploadResultListModal
        open={isOpenExcelReadFailedListModal}
        text={resultText}
        failedEmailList={uploadFailedList}
        onClosed={onCloseModal}
      />
    </>
  );
});
