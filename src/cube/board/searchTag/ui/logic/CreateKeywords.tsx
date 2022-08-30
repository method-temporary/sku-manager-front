import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import { useSearchTagCdoKeywords } from '../../service/useSearchTagCdoKeywords';

function CreateKeywords() {
  const [value, setValue] = useSearchTagCdoKeywords();

  return (
    <Form.Field
      control={TextArea}
      width={10}
      placeholder=""
      value={value}
      onChange={setValue}
    />
  );
}

export default CreateKeywords;
