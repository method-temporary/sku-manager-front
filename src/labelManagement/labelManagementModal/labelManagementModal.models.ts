import { LabelInputTable } from 'labelManagement/labelInputTable/labelInputTable.models';

export interface LabelManagementModal extends Omit<LabelInputTable, 'isParent' | 'modifiedTime'> {}

export function InitLabelManagementModal(): LabelManagementModal {
  return {
    id: '',
    name: '',
    memo: '',
    i18nResourcePathId: '',
    content: { ko: '', en: '', zh: '' },
  };
}
