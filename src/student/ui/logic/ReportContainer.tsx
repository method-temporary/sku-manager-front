import React from 'react';
import { HomeworkView } from '../view/HomeworkView';
import { HomeworkOperatorView } from '../view/HomeworkOperatorView';
import { useReportViewModel } from 'student/store/ReportStore';

export default function ReportContainer() {
  const reportViewModel = useReportViewModel();

  return (
    <>
      {reportViewModel !== undefined && (
        <>
          <HomeworkView homework={reportViewModel.homework} />
          <HomeworkOperatorView
            homeworkOperatorComment={reportViewModel.homeworkOperatorComment}
            homeworkScore={reportViewModel.homeworkScore}
            homeworkState={reportViewModel.homeworkState}
            homeworkOperatorFileBoxId={reportViewModel.homeworkOperatorFileBoxId}
          />
        </>
      )}
    </>
  );
}
