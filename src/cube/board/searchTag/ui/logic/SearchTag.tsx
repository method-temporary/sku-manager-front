import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import { useSearchTagRdoTag } from '../../service/useSearchTagRdoTag';

function SearchTag() {
  const [value, setValue] = useSearchTagRdoTag();

  return (
    <Form.Field control={Input} width={10} placeholder="검색어를 입력해주세요." value={value} onChange={setValue} />
  );
}

export default SearchTag;
