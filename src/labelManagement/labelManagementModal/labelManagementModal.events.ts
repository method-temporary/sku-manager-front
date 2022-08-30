import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';

import { reactAlert } from '@nara.platform/accent';

import { registerResource } from '_data/arrange/i18nResource/api/i18nResourceApi';
import { registerResourcePaths } from '_data/arrange/i18nResourcePath/api/i18nResourcePathApi';
import { Resource } from '_data/arrange/i18nResource/model';
import { ResourcePathCdo } from '_data/arrange/i18nResourcePath/model';

import { getLabelInputTable, initLabelInputTable } from 'labelManagement/labelInputTable/labelInputTable.services';
import { requestLabelTree, requsetFindResource } from 'labelManagement/labelTree/labelTree.request.servies';
import { InitLabelManagementModal, LabelManagementModal } from './labelManagementModal.models';
import {
  setLabelResourcePathIsOpen,
  setLabelResourceIsOpen,
  setLabelManagementModalInput,
  getLabelManagementModalInput,
} from './labelManagementModal.services';

export function onOpenResourcePath() {
  setLabelResourcePathIsOpen(true);
}

export function onCloseResourcePath() {
  setLabelManagementModalInput(InitLabelManagementModal());
  setLabelResourcePathIsOpen(false);
}

export function onOpenResource() {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();
  const labelInputTable = getLabelInputTable() || initLabelInputTable();
  setLabelManagementModalInput({
    ...labelModalInputTable,
    i18nResourcePathId: labelInputTable.isParent ? labelInputTable.id : labelInputTable.i18nResourcePathId,
  });

  setLabelResourceIsOpen(true);
}

export function onCloseResource() {
  setLabelManagementModalInput(InitLabelManagementModal());
  setLabelResourceIsOpen(false);
}

export function onChangeModalInputLabel(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();
  const next: LabelManagementModal = {
    ...labelModalInputTable,
    name: data.value,
  };

  setLabelManagementModalInput({ ...next });
}

export function onChangeModalInputCode(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();
  const next: LabelManagementModal = {
    ...labelModalInputTable,
    id: data.value,
  };

  setLabelManagementModalInput({ ...next });
}

export function onChangeModalResourcePathCode(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();
  const next: LabelManagementModal = {
    ...labelModalInputTable,
    i18nResourcePathId: data.value,
  };

  setLabelManagementModalInput({ ...next });
}

export function onChangeKo(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();
  const next: LabelManagementModal = {
    ...labelModalInputTable,
    content: {
      ko: data.value,
      zh: labelModalInputTable.content?.zh || '',
      en: labelModalInputTable.content?.en || '',
    },
  };

  setLabelManagementModalInput({ ...next });
}

export function onChangeZh(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();
  const next: LabelManagementModal = {
    ...labelModalInputTable,
    content: {
      ko: labelModalInputTable.content?.ko || '',
      zh: data.value,
      en: labelModalInputTable.content?.en || '',
    },
  };

  setLabelManagementModalInput({ ...next });
}

export function onChangeEn(_: React.ChangeEvent, data: InputOnChangeData) {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();
  const next: LabelManagementModal = {
    ...labelModalInputTable,
    content: {
      ko: labelModalInputTable.content?.ko || '',
      zh: labelModalInputTable.content?.zh || '',
      en: data.value,
    },
  };

  setLabelManagementModalInput({ ...next });
}

export function onChangeModalInputMemo(_: React.FormEvent, data: TextAreaProps) {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();
  const next: LabelManagementModal = {
    ...labelModalInputTable,
    memo: data.value as string,
  };

  setLabelManagementModalInput({ ...next });
}

export async function onConfirmResourcePath() {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();

  if (labelModalInputTable.id === '') {
    reactAlert({
      title: '코드 미입력',
      message: '코드를 입력해 주세요 ',
    });
    return;
  }

  const parselabelModalInputTable: ResourcePathCdo = {
    ...labelModalInputTable,
  };

  await registerResourcePaths(parselabelModalInputTable);
  await requestLabelTree();
  onCloseResourcePath();
}

export async function onConfirmResource() {
  const labelModalInputTable = getLabelManagementModalInput() || InitLabelManagementModal();

  if (labelModalInputTable.i18nResourcePathId === undefined || labelModalInputTable.i18nResourcePathId === '') {
    reactAlert({
      title: '필수 입력 요소',
      message: '화면 코드를 입력해주세요',
    });
    return;
  }

  if (labelModalInputTable.id === undefined || labelModalInputTable.id === '') {
    reactAlert({
      title: '필수 입력 요소',
      message: '화면요소 코드를 입력해주세요',
    });
    return;
  }

  const parseLabelModalInputTable: Resource = {
    ...labelModalInputTable,
    i18nResourcePathId: labelModalInputTable.i18nResourcePathId,
    content: {
      ko: labelModalInputTable.content?.ko || '',
      en: labelModalInputTable.content?.en || '',
      zh: labelModalInputTable.content?.zh || '',
    },
    exposureType: 'PC',
  };

  await registerResource(parseLabelModalInputTable);
  await requsetFindResource(labelModalInputTable.i18nResourcePathId);
  onCloseResource();
}
