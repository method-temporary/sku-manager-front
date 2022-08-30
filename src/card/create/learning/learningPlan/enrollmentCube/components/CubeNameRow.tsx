import * as React from 'react';
import { Polyglot } from '../../../../../../shared/components';
import { observer } from 'mobx-react';
import { PolyglotModel } from '../../../../../../shared/model';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { Table } from 'semantic-ui-react';

interface props {
  readonly?: boolean;
}
export const CubeNameRow = observer(({ readonly }: props) => {
  //
  const { name, setName } = EnrollmentCubeStore.instance;

  const onChangeProps = (value: PolyglotModel) => {
    setName(value);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        Cube 이름<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        <Polyglot.Input
          languageStrings={name}
          name={'name'}
          onChangeProps={(name: string, value: PolyglotModel) => onChangeProps(value)}
          maxLength="200"
          placeholder="Cube명을 입력해주세요.(200자까지 입력가능)"
          readOnly={readonly}
        />
      </Table.Cell>
    </Table.Row>
  );
});
