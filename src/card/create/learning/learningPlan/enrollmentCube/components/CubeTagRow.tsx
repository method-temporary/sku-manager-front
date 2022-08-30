import * as React from 'react';
import { Polyglot } from '../../../../../../shared/components';
import { observer } from 'mobx-react';
import { PolyglotModel } from '../../../../../../shared/model';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { Table } from 'semantic-ui-react';

interface props {
  readonly?: boolean;
}
export const CubeTagRow = observer(({ readonly }: props) => {
  //
  const { tags, setTags } = EnrollmentCubeStore.instance;

  const onChangeProps = (value: PolyglotModel) => {
    setTags(value);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">Tag 정보</Table.Cell>
      <Table.Cell>
        <Polyglot.Input
          languageStrings={tags}
          name={'tags'}
          onChangeProps={(name: string, value: PolyglotModel) => onChangeProps(value)}
          placeholder={'Tag와 Tag는 쉼표(",")로 구분하며, 최대 10개까지 입력하실 수 있습니다.'}
          readOnly={readonly}
        />
      </Table.Cell>
    </Table.Row>
  );
});
