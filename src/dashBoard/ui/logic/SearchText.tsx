import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import { useDashBoardSentenceText } from '../../service/useDashBoardSentenceText';

function SearchText() {
  const [value, setValue] = useDashBoardSentenceText();
  return (
    <Form.Field
      control={Input}
      width={10}
      placeholder="검색어를 입력해주세요."
      value={value || ''}
      onChange={setValue}
    />
  );
}

export default SearchText;
