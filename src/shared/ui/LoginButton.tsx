import React, { useCallback, useState } from 'react';
import { Menu, Select } from 'semantic-ui-react';

import { SelectTypeModel } from 'shared/model';

import { onLogin } from 'lib/common';

export function LoginButton() {
  const [loginId, setLoginId] = useState<string>('myutopia@sk.com');

  const onChangeLoginId = useCallback(
    (e: any) => {
      setLoginId(e.target.value);
    },
    [setLoginId]
  );

  const onSelectLanguage = useCallback(
    (e: any, data: any) => {
      localStorage.setItem('language', data?.value?.toString() || '');
      window.location.href = window.location.href;
    },
    [localStorage]
  );

  const language = localStorage.getItem('language') || '';

  return (
    <Menu.Item className="login-info">
      <input value={loginId} onChange={onChangeLoginId} />
      <button onClick={() => onLogin(loginId)} type="button">
        로그인
      </button>
      <Select options={getLanguageOptions()} value={language} onChange={onSelectLanguage} />
    </Menu.Item>
  );
}

function getLanguageOptions() {
  const options: SelectTypeModel[] = [];

  options.push(new SelectTypeModel('1', 'Korean', 'Korean'));
  options.push(new SelectTypeModel('2', 'English', 'English'));
  options.push(new SelectTypeModel('3', 'Chinese', 'Chinese'));

  return options;
}
