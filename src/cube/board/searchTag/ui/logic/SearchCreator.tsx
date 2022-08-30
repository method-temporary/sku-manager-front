import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import { useSearchTagRdoCreator } from '../../service/useSearchTagRdoCreator';

function SearchCreator() {
  const [value, setValue] = useSearchTagRdoCreator();

  return (
    <Form.Field control={Input} width={10} placeholder="검색어를 입력해주세요." value={value} onChange={setValue} />
  );
}

export default SearchCreator;
