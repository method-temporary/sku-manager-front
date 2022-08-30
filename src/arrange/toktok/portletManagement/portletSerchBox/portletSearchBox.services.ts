import { useEffect, useState } from 'react';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import UserWorkspaceApi from 'userworkspace/present/apiclient/UserWorkspaceApi';

type Option = { key: string; value: string; text: string };

export function useCineroomOptions() {
  const [cineroomOptions, setCineroomOptions] = useState<Option[]>([]);

  useEffect(() => {
    const userWorkspaceApi = UserWorkspaceApi.instance;
    userWorkspaceApi.findAllWorkspace().then((workspaces) => {
      if (workspaces === null) {
        return;
      }
      const cineroomOptions = workspaces.map((workspace) => {
        return {
          key: workspace.id,
          value: getPolyglotToAnyString(workspace.name),
          text: getPolyglotToAnyString(workspace.name),
        };
      });
      setCineroomOptions([{ key: 'all', value: '', text: '전체' }, ...cineroomOptions]);
    });
  }, [setCineroomOptions]);

  return cineroomOptions;
}
