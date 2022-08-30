import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import { useSearchTagCdoTag } from '../../service/useSearchTagCdoTag';

function CreateTag() {
  const [value, setValue] = useSearchTagCdoTag();

  return (
    <Form.Field
      control={Input}
      width={10}
      placeholder=""
      value={value}
      onChange={setValue}
    />
  );
}

export default CreateTag;
