import { SelectTypeModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserWorkspaceService } from '../../index';

export function getCompanySelectOptions(userWorkspaceService: UserWorkspaceService) {
  //
  const { userWorkspaces } = userWorkspaceService;

  const companySelectOptions: SelectTypeModel[] = [];

  userWorkspaces &&
    userWorkspaces.forEach((userWorkspace) => {
      if (!userWorkspace.hasChildren && userWorkspace.id !== 'ne1-m2-c2') {
        // TODO userWorkspace.name.kr --> 다국어 변경시 변경
        companySelectOptions.push(
          new SelectTypeModel(userWorkspace.usid, getPolyglotToAnyString(userWorkspace.name), userWorkspace.usid)
        );
      }
    });

  return companySelectOptions;
}
