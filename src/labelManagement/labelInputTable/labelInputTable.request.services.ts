import { modifyResource } from '../../_data/arrange/i18nResource/api/i18nResourceApi';
import { modifyResourcePaths } from '_data/arrange/i18nResourcePath/api/i18nResourcePathApi';

import { requestLabelTree, requsetFindResource } from 'labelManagement/labelTree/labelTree.request.servies';
import { getLabelInputTable, initLabelInputTable } from './labelInputTable.services';
import { NameValues } from '../model/NameValues';

export async function requestModifyResource() {
  const labelInputTable = getLabelInputTable() || initLabelInputTable();

  const { id, name, memo, content, isParent, i18nResourcePathId } = labelInputTable;

  const params: NameValues[] = [
    {
      name: 'name',
      value: name,
    },
    {
      name: 'memo',
      value: memo,
    },
  ];

  if (isParent) {
    await modifyResourcePaths(id, params);
    await requestLabelTree();

    // 해당 id로 api 호출 후 변경 사항 객체에 적용.
    return;
  }

  params.push({
    name: 'content',
    value: JSON.stringify(content),
  });

  await modifyResource(id, params);
  i18nResourcePathId && (await requsetFindResource(i18nResourcePathId));
}
