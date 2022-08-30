import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import { useSearchTagRdoUpdater } from '../../service/useSearchTagRdoUpdater';

function SearchUpdater() {
  const [value, setValue] = useSearchTagRdoUpdater();

  return (
    <Form.Field control={Input} width={10} placeholder="검색어를 입력해주세요." value={value} onChange={setValue} />
  );
}

export default SearchUpdater;
