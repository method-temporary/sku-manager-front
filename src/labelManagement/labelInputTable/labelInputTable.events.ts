import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { LabelInputTable } from './labelInputTable.models';
import { requestModifyResource } from './labelInputTable.request.services';
import { getLabelInputTable, setLabelInputTable, initLabelInputTable } from './labelInputTable.services';

export function onChangeLabel(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelInputTable = getLabelInputTable() || initLabelInputTable();
  const next: LabelInputTable = {
    ...labelInputTable,
    name: data.value,
  };

  setLabelInputTable({ ...next });
}

export function onChangeCode(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelInputTable = getLabelInputTable() || initLabelInputTable();
  const next: LabelInputTable = {
    ...labelInputTable,
    id: data.value,
  };

  setLabelInputTable({ ...next });
}

export function onChangeKo(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelInputTable = getLabelInputTable() || initLabelInputTable();
  const next: LabelInputTable = {
    ...labelInputTable,
    content: {
      ko: data.value,
      zh: labelInputTable.content?.zh || '',
      en: labelInputTable.content?.en || '',
    },
  };

  setLabelInputTable({ ...next });
}

export function onChangeZh(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelInputTable = getLabelInputTable() || initLabelInputTable();
  const next: LabelInputTable = {
    ...labelInputTable,
    content: {
      ko: labelInputTable.content?.ko || '',
      zh: data.value,
      en: labelInputTable.content?.en || '',
    },
  };

  setLabelInputTable({ ...next });
}

export function onChangeEn(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelInputTable = getLabelInputTable() || initLabelInputTable();
  const next: LabelInputTable = {
    ...labelInputTable,
    content: {
      ko: labelInputTable.content?.ko || '',
      zh: labelInputTable.content?.zh || '',
      en: data.value,
    },
  };

  setLabelInputTable({ ...next });
}

export function onChangeMemo(_: React.FormEvent, data: TextAreaProps) {
  const labelInputTable = getLabelInputTable() || initLabelInputTable();
  const next: LabelInputTable = {
    ...labelInputTable,
    memo: data.value as string,
  };

  setLabelInputTable({ ...next });
}

export function onConfirm() {
  requestModifyResource();
}
