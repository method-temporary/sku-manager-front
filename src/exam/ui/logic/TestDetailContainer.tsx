import React from 'react';
import { onClickDelete, onClickList, onClickModify } from 'exam/handler/TestDetailHandler';
import { Button, Container } from 'semantic-ui-react';
import { PageTitle } from 'shared/components';
import { TestSheetContainer } from './TestSheetContainer';
import { useParams } from 'react-router';
import { TestDetailParams } from 'exam/viewmodel/TestDetailParams';

export function TestDetailContainer() {
  const params = useParams<TestDetailParams>();

  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb}>시험지 상세(미리보기)</PageTitle>
      <TestSheetContainer />
      <div className="btn-group">
        <div className="fl-right">
          <Button onClick={() => onClickModify(params.testId)}>수정</Button>
          {/* <Button onClick={() => onClickDelete(params.testId)}>시험지 삭제</Button> */}
          <Button onClick={onClickList}>목록</Button>
        </div>
      </div>
    </Container>
  );
}

const breadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'TestManagement', content: 'Test 관리', link: true },
  { key: 'TestDetail', content: '시험지 상세(미리보기)', active: true },
];
