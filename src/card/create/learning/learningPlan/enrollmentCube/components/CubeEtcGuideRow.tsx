import * as React from 'react';
import { Polyglot } from '../../../../../../shared/components';
import { observer } from 'mobx-react';
import { PolyglotModel } from '../../../../../../shared/model';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { Table } from 'semantic-ui-react';

interface props {
  readonly?: boolean;
}
export const CubeEtcGuideRow = observer(({ readonly }: props) => {
  //
  const { guide, setGuide } = EnrollmentCubeStore.instance;

  const onChangeProps = (value: PolyglotModel) => {
    setGuide(value);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">기타안내</Table.Cell>
      <Table.Cell>
        <Polyglot.Editor
          languageStrings={guide}
          name={'guide'}
          onChangeProps={(name: string, value: PolyglotModel) => onChangeProps(value)}
          placeholder="기타안내를 입력해주세요.(1,000자까지 입력가능)"
          maxLength={1000}
          readOnly={readonly}
        />
      </Table.Cell>
    </Table.Row>
  );
});
