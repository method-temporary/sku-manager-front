import React from 'react';
import { Input } from 'semantic-ui-react';
import { Row } from './MenuInputView';
import { ChangeName } from '../../service/useSelectedMenu';

interface BoardMenuInputViewProps {
  name: string;
  changeName: ChangeName;
}

const BoardMenuInputView: React.FC<BoardMenuInputViewProps> = function BoardMenuInputView({ name, changeName }) {
  return (
    <Row title="메뉴명">
      <Input fluid placeholder="메뉴명을 입력하세요" value={name} onChange={changeName} />
    </Row>
  );
};

export default BoardMenuInputView;
