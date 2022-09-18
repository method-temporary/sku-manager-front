import React, { useEffect } from 'react';
import { TestCreateBasicInfoContainer } from './TestCreateBasicInfoContainer';
import { TestCreateQuestionContainer } from './TestCreateQuestionContainer';
import { setTestCreateFormViewModel, useTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { getInitialTestCreateFromViewModel } from 'exam/viewmodel/TestCreateFormViewModel';
import { TestCreateSelectOptionsContainer } from './TestCreateSelectOptionsContainer';
import { Button, Step } from 'semantic-ui-react';
import {
  onClickDelete,
  onClickList,
  onClickPreview,
  onClickSaveQuestions,
  onClickStep,
  onClickSubmit,
} from '../../handler/TestCreateHandler';
import { PageTitle, SubActions } from 'shared/components';
import { onAddChoice } from '../../handler/TestCreateQuestionHandler';

const breadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Learning', content: 'Learning 관리', link: true },
  { key: 'exam', content: 'Test 관리', active: true },
];

export function TestCreateFormContainer() {
  //
  const testCreateForm = useTestCreateFormViewModel();

  useEffect(() => {
    setTestCreateFormViewModel(getInitialTestCreateFromViewModel());
  }, []);

  return (
    <>
      {/* 상단 메뉴 정보 */}
      {/* <PageTitle breadcrumb={breadcrumb}>{`Test ${testCreateForm?.id ? '수정' : '등록'}`}</PageTitle>
      <Step.Group size="tiny">
        <Step active={testCreateForm?.stepIndex === 1} onClick={() => onClickStep(1)}>
          <Step.Content>
            <Step.Title>문제 설정</Step.Title>
          </Step.Content>
        </Step>
        <Step active={testCreateForm?.stepIndex === 2} onClick={() => onClickStep(2)}>
          <Step.Content>
            <Step.Title>출제방식 설정</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group> */}

      {/* 상단 버튼 */}

      <SubActions form>
        <SubActions.Right>
          <Button>엑셀 다운로드</Button>
          <Button>언어별 문항 추가</Button>
          {testCreateForm?.stepIndex === 1 && !testCreateForm?.finalCopy && (
            <Button type="button" onClick={onAddChoice}>
              문항 추가
            </Button>
          )}
          {/* <Button type="button" onClick={onClickPreview}>
            미리보기
          </Button>
          {testCreateForm?.stepIndex === 2 && (
            <Button type="button" onClick={() => onClickSubmit(false)}>
              전체 저장
            </Button>
          )}
          <Button type="button" onClick={onClickList}>
            목록
          </Button> */}
        </SubActions.Right>
      </SubActions>

      {/* 본문 화면 */}
      {testCreateForm?.stepIndex === 1 ? (
        <>
          {/* Test 정보 설정 */}
          <TestCreateBasicInfoContainer />
          {/* Test 문항 설정 */}
          <TestCreateQuestionContainer />
        </>
      ) : (
        /* Test 출제 방식 설정 */
        <TestCreateSelectOptionsContainer />
      )}

      {/* 하단 버튼 */}
      <SubActions form>
        <SubActions.Left>
          {testCreateForm?.id && !testCreateForm.finalCopy && (
            <Button type="button" onClick={() => onClickDelete(testCreateForm?.id)}>
              시험지 삭제
            </Button>
          )}
        </SubActions.Left>
        <SubActions.Center>
          {testCreateForm?.stepIndex === 1 ? (
            <>
              <Button type="button" onClick={() => onClickStep(2)}>
                등록
              </Button>
              <Button type="button" onClick={onClickSaveQuestions}>
                수정
              </Button>

              <Button type="button" onClick={onClickList}>
                목록
              </Button>
            </>
          ) : (
            <>
              <Button type="button" onClick={() => onClickStep(1)}>
                이전
              </Button>
              {!testCreateForm?.finalCopy && (
                <Button type="button" onClick={() => onClickSubmit(true)}>
                  최종본 반영
                </Button>
              )}
            </>
          )}
        </SubActions.Center>
      </SubActions>
    </>
  );
}
