import React, { useRef } from 'react';
import ReactQuill from 'react-quill';

import { SelectType } from 'shared/model';

import { useResultManagementViewModel } from 'student/store/ResultManagementStore';
import { useReactQuill } from 'student/present/logic/useReactQuill';
import { getGradeSheetViewModel, setGradeSheetViewModel } from 'exam/store/GradeSheetStore';

interface GraderCommentViewProps {
  graderComment?: string;
}

export function GraderCommentView({ graderComment }: GraderCommentViewProps) {
  const reactQuillRef = useRef<ReactQuill>(null);
  useReactQuill(reactQuillRef.current);

  const resultManagementViewModel = useResultManagementViewModel();
  const gradeFinished = resultManagementViewModel !== undefined ? resultManagementViewModel.gradeFinished : false;

  const onChangeComment = (content: string): void => {
    if (content === '<p><br></p>') {
      content = '';
    }

    const gradeSheetViewModel = getGradeSheetViewModel();

    if (gradeSheetViewModel === undefined) {
      return;
    }

    setGradeSheetViewModel({
      ...gradeSheetViewModel,
      graderComment: content,
    });
  };

  return (
    <>
      <span>코멘트를 작성하세요.</span>
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        modules={SelectType.modules}
        formats={SelectType.formats}
        value={graderComment}
        onChange={onChangeComment}
        readOnly={gradeFinished}
      />
    </>
  );
}
