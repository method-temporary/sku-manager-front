import React from 'react';
import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';

import { getTestCreateFormViewModel, setTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';

export const onChangeTitle = (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm !== undefined) {
    let title = data.value;

    if (title.length > 80) {
      title = title.substr(0, 80);
    }

    setTestCreateFormViewModel({
      ...testCreateForm,
      title,
    });
  }
};

export const onChangeLanguage = (language: string) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm !== undefined) {
    setTestCreateFormViewModel({
      ...testCreateForm,
      language,
    });
  }
};

export const onChangeDescription = (_: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm !== undefined) {
    let description = data.value ? data.value.toString() : '';

    if (description.length > 5000) {
      description = description.substr(0, 5000);
    }

    setTestCreateFormViewModel({
      ...testCreateForm,
      description,
    });
  }
};

export const onChangeApplyLimit = (value: string) => {
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm !== undefined) {
    let applyLimit = value;

    if (applyLimit.includes('.')) {
      applyLimit = applyLimit.substring(0, applyLimit.indexOf('.'));
    }

    if (applyLimit === '') {
      applyLimit = '0';
    } else if (applyLimit.startsWith('0') && applyLimit !== '0') {
      applyLimit = applyLimit.substr(1);
    } else if (Number(applyLimit) > 999) {
      applyLimit = '999';
    }

    setTestCreateFormViewModel({
      ...testCreateForm,
      applyLimit,
    });
  }
};
