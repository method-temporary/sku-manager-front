import { requsetFindResource } from './labelTree.request.servies';
import { getLabelTree, setLabelTree } from './labelTree.services';
import { Item } from 'react-simple-tree-menu';
import { setLabelInputTable } from 'labelManagement/labelInputTable/labelInputTable.services';

export function onClickLabel(treeMenuItem: Item) {
  const labelTree = getLabelTree();
  if (labelTree !== undefined) {
    const nextlabelTree = labelTree.map((c) => {
      if (c.key === treeMenuItem.key) {
        return { ...c, isOpen: c.isOpen === true ? false : true };
      }
      return c;
    });
    setLabelTree(nextlabelTree);
  }

  if (treeMenuItem.parent === '') {
    setLabelInputTable({
      id: treeMenuItem.key,
      name: treeMenuItem.name,
      memo: treeMenuItem.memo || '',
      isParent: true,
    });
  }

  if (treeMenuItem.parent !== '') {
    setLabelInputTable({
      id: treeMenuItem.id,
      name: treeMenuItem.name,
      memo: treeMenuItem.memo || '',
      content: treeMenuItem.content,
      i18nResourcePathId: treeMenuItem.i18nResourcePathId,
      modifiedTime: treeMenuItem.modifiedTime,
      isParent: false,
    });
  }

  // 열고 닫고 토글
  // cache API 호출
  if (!treeMenuItem.isOpen) {
    requsetFindResource(treeMenuItem.key);
  }
}
