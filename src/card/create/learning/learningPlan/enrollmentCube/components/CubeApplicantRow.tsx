import * as React from 'react';
import { FormTable, Polyglot } from '../../../../../../shared/components';
import { observer } from 'mobx-react';
import { PolyglotModel } from '../../../../../../shared/model';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { Table } from 'semantic-ui-react';

interface props {
  readonly?: boolean;
}
export const CubeApplicantRow = observer(({ readonly }: props) => {
  //
  const { applicants, setApplicants } = EnrollmentCubeStore.instance;

  const onChangeProps = (value: PolyglotModel) => {
    setApplicants(value);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        교육대상<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        <Polyglot.Input
          languageStrings={applicants}
          name={'applicants'}
          onChangeProps={(name: string, value: PolyglotModel) => onChangeProps(value)}
          maxLength="300"
          placeholder="교육대상을 입력해주세요.(300자까지 입력가능)"
          readOnly={readonly}
        />
      </Table.Cell>
    </Table.Row>
  );
});
