import React, { useCallback } from 'react';
import { Table } from 'semantic-ui-react';
import { PatronType } from '@nara.platform/accent';
import { FileBox, ValidationType } from '@nara.drama/depot';
import { duplicationValidator } from 'shared/ui';
import { getReportViewModel, setReportViewModel } from 'student/store/ReportStore';
import { useResultManagementViewModel } from 'student/store/ResultManagementStore';

interface HomeworkFileViewProps {
  fileBoxId: string;
  readonly?: boolean;
}

export function HomeworkFileView({ fileBoxId, readonly }: HomeworkFileViewProps) {
  const resultManagementViewModel = useResultManagementViewModel();
  const reportFinished = (resultManagementViewModel && resultManagementViewModel.reportFinished) || false;

  const onChangeFileBoxId = useCallback((fileBoxId: string) => {
    const reportViewModel = getReportViewModel();

    if (reportViewModel === undefined) {
      return;
    }

    setReportViewModel({
      ...reportViewModel,
      homeworkOperatorFileBoxId: fileBoxId,
    });
  }, []);

  return (
    <Table.Row>
      <Table.Cell className="tb-header">첨부파일</Table.Cell>
      <Table.Cell>
        <FileBox
          id={fileBoxId}
          vaultKey={{
            keyString: 'sku-depot',
            patronType: PatronType.Pavilion,
          }}
          patronKey={{
            keyString: 'sku-denizen',
            patronType: PatronType.Denizen,
          }}
          validations={[
            {
              type: ValidationType.Duplication,
              validator: duplicationValidator,
            },
          ]}
          options={{
            readonly: readonly || reportFinished,
          }}
          onChange={onChangeFileBoxId}
        />
        <p className="info-text-gray">- DOC,PDF,EXL 파일을 등록하실 수 있습니다.</p>
        <p className="info-text-gray">- 최대 10MB 용량의 파일을 등록하실 수 있습니다.</p>
      </Table.Cell>
    </Table.Row>
  );
}
