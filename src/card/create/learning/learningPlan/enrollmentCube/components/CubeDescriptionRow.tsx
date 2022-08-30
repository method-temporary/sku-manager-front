import * as React from 'react';
import { Polyglot } from '../../../../../../shared/components';
import { observer } from 'mobx-react';
import { PolyglotModel } from '../../../../../../shared/model';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { Table } from 'semantic-ui-react';

interface props {
  readonly?: boolean;
}
export const CubeDescriptionRow = observer(({ readonly }: props) => {
  //
  const { description, setDescription } = EnrollmentCubeStore.instance;

  const onChangeProps = (value: PolyglotModel) => {
    setDescription(value);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        교육 내용<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        <Polyglot.Editor
          name={'description'}
          languageStrings={description}
          onChangeProps={(name: string, value: PolyglotModel) => onChangeProps(value)}
          maxLength={3000}
          placeholder="내용을 입력해주세요. (3,0000자까지 입력가능)"
          readOnly={readonly}
        />
      </Table.Cell>
    </Table.Row>
  );
});
