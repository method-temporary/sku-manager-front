import React, { useCallback } from 'react';
import { Table, Input } from 'semantic-ui-react';
import { getReportViewModel, setReportViewModel } from 'student/store/ReportStore';
import { useResultManagementViewModel } from 'student/store/ResultManagementStore';

interface HomeworkScoreViewProps {
  score: number;
}

export function HomeworkScoreView({ score }: HomeworkScoreViewProps) {
  const resultManagementViewModel = useResultManagementViewModel();

  const reportFinished = (resultManagementViewModel && resultManagementViewModel.reportFinished) || false;

  const onChangeScore = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextScore = (e.target.value && Number.parseInt(e.target.value)) || 0;

    if (nextScore >= 0 && nextScore <= 100) {
      const reportViewModel = getReportViewModel();

      if (reportViewModel === undefined) {
        return;
      }

      setReportViewModel({
        ...reportViewModel,
        homeworkScore: nextScore,
      });
    }
  }, []);

  return (
    <Table.Row>
      <Table.Cell className="tb-header">과제 점수</Table.Cell>
      <Table.Cell>
        {reportFinished ? (
          score
        ) : (
          <Input
            type="text"
            name="homeworkScore"
            value={score}
            placeholder="과제 점수를 입력해 주세요."
            onChange={onChangeScore}
          />
        )}
      </Table.Cell>
    </Table.Row>
  );
}
