import React from 'react';
import { Input } from 'semantic-ui-react';
import { Row } from './MenuInputView';
import { ChangeName } from '../../service/useSelectedMenu';

interface CategoryMenuInputViewProps {
  name: string;
  changeName: ChangeName;
}

const CategoryMenuInputView: React.FC<CategoryMenuInputViewProps> = function CategoryMenuInputView({
  name,
  changeName,
}) {
  return (
    <Row title="카테고리명">
      <Input fluid placeholder="카테고리명을 입력해주세요." value={name} onChange={changeName} />
    </Row>
  );
};

export default CategoryMenuInputView;
