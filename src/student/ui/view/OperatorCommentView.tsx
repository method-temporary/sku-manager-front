import React, { useRef, useCallback } from 'react';
import { Table } from 'semantic-ui-react';
import ReactQuill from 'react-quill';

import { SelectType } from 'shared/model';

import { useReactQuill } from 'student/present/logic/useReactQuill';
import { getReportViewModel, setReportViewModel } from 'student/store/ReportStore';
import { useResultManagementViewModel } from 'student/store/ResultManagementStore';

interface OperatorCommentViewProps {
  comment: string;
}

export function OperatorCommentView({ comment }: OperatorCommentViewProps) {
  const reactQuillRef = useRef<ReactQuill>(null);
  useReactQuill(reactQuillRef.current);

  const resultManagementViewModel = useResultManagementViewModel();
  const reportFinished = resultManagementViewModel !== undefined ? resultManagementViewModel.reportFinished : false;

  const onChangeComment = useCallback((content: string) => {
    if (content === '<p><br></p>') {
      content = '';
    }

    const reportViewModel = getReportViewModel();

    if (reportViewModel === undefined) {
      return;
    }

    setReportViewModel({
      ...reportViewModel,
      homeworkOperatorComment: content,
    });
  }, []);

  return (
    <Table.Row>
      <Table.Cell className="tb-header">내용</Table.Cell>
      <Table.Cell>
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          modules={SelectType.modules}
          formats={SelectType.formats}
          value={comment}
          onChange={onChangeComment}
          readOnly={reportFinished}
        />
      </Table.Cell>
    </Table.Row>
  );
}
