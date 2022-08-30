import React from 'react';
import { useTestListViewModel } from 'exam/store/TestListStore';
import { TestListHeaderView } from '../view/TestListHeaderView';
import { TestListView } from '../view/TestListView';
import { getInitialTestListLimit, useTestListLimit } from 'exam/store/TestListLimitStore';
import { onClickCopyTest, onClickTestDetail } from 'exam/handler/TestListHandler';
import { useRequestTestList } from 'exam/hooks/useRequestTestList';
import { onChangeLimit, onClickCreate } from 'exam/handler/TestListHeaderHandler';
import { getTestListPage } from 'exam/store/TestListPageStore';
import { UserWorkspaceService } from 'userworkspace';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

export function TestListContainer() {
  useRequestTestList();
  const testListViewModel = useTestListViewModel();
  const testLimit = useTestListLimit() || getInitialTestListLimit();
  const pageNo = getTestListPage() || 1;

  let workspaces: { key: string; value: string; text: string }[] = [];
  if (UserWorkspaceService) {
    const { allUserWorkspaces } = UserWorkspaceService.instance;
    workspaces = allUserWorkspaces.map((workspace) => {
      return {
        key: workspace.id,
        value: workspace.id,
        text: getPolyglotToAnyString(workspace.name),
      };
    });
  }

  return (
    <>
      <TestListHeaderView testLimit={testLimit} onChangeLimit={onChangeLimit} onClickCreate={onClickCreate} />
      {testListViewModel !== undefined && (
        <TestListView
          totalCount={testListViewModel.totalCount}
          testList={testListViewModel.testList}
          pageNo={pageNo}
          limit={testLimit}
          onClickCopyTest={onClickCopyTest}
          onClickTestDetail={onClickTestDetail}
          workspaces={workspaces}
        />
      )}
    </>
  );
}
