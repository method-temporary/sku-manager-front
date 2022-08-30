import * as React from 'react';
import { Polyglot } from '../../../../../../shared/components';
import { observer } from 'mobx-react';
import { PolyglotModel } from '../../../../../../shared/model';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { Table } from 'semantic-ui-react';

interface props {
  readonly?: boolean;
}
export const CubeCompletionTermRow = observer(({ readonly }: props) => {
  //
  const { completionTerms, setCompletionTerms } = EnrollmentCubeStore.instance;

  const onChangeProps = (name: string, value: PolyglotModel) => {
    setCompletionTerms(value);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">이수조건</Table.Cell>
      <Table.Cell>
        <Polyglot.TextArea
          name="completionTerms"
          languageStrings={completionTerms}
          onChangeProps={onChangeProps}
          placeholder="이수조건을 입력해주세요(1,000자까지 입력가능)"
          maxLength={1000}
          readOnly={readonly}
        />
      </Table.Cell>
    </Table.Row>
  );
});
