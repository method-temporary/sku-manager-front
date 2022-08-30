import React from 'react';
import { Input } from 'semantic-ui-react';
import { Row } from './MenuInputView';
import { ChangeName, ChangeUrl } from '../../service/useSelectedMenu';

interface LinkMenuInputViewProps {
  name: string;
  changeName: ChangeName;
  url: string;
  changeUrl: ChangeUrl;
}

const LinkMenuInputView: React.FC<LinkMenuInputViewProps> = function LinkMenuInputView({
  name,
  url,
  changeName,
  changeUrl,
}) {
  return (
    <>
      <Row title="메뉴명">
        <Input fluid placeholder="메뉴명을 입력해주세요." value={name} onChange={changeName} />
      </Row>
      <Row title="URL">
        <Input placeholder="URL을 입력해주세요." fluid value={url} onChange={changeUrl} />
      </Row>
    </>
  );
};

export default LinkMenuInputView;
