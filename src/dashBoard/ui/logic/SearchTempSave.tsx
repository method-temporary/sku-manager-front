import { useDashBoardSentenceText } from 'dashBoard/service/useDashBoardSentenceText';
import React from 'react';
import { Form, Input } from 'semantic-ui-react';

function SearchTempSave() {
  const [value, setValue] = useDashBoardSentenceText();

  return (
    <Form.Field control={Input} width={10} placeholder="검색어를 입력해주세요." value={value} onChange={setValue} />
  );
}

export default SearchTempSave;
