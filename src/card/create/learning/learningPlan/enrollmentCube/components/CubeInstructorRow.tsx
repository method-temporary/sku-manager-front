import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Table } from 'semantic-ui-react';
import InstructorModal from '../../../../../../instructor/instructor/shared/components/instructorModal/InstructorModal';
import { CubeInstructorTable } from './CubeInstructorTable';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { InstructorWithOptional } from '../../../../../../instructor/instructor/shared/components/instructorModal/model/InstructorWithOptional';

interface props {
  readonly?: boolean;
}
export const CubeInstructorRow = observer(({ readonly }: props) => {
  //
  const { instructors, setInstructor, isInstructorNullCheck, setIsInstructorNullCheck } = EnrollmentCubeStore.instance;

  const onClickOkInModal = (instructors: InstructorWithOptional[]) => {
    setInstructor(instructors);
    setIsInstructorNullCheck(instructors.length <= 0);
  };

  const onClickIsNullCheck = (value: boolean) => {
    setIsInstructorNullCheck(value);
    value && setInstructor([]);
  };

  const nullCheckField = () => {
    return (
      <Form.Field
        control={Checkbox}
        label="강사 없음"
        checked={isInstructorNullCheck}
        onChange={(e: any, data: any) => onClickIsNullCheck(data.checked)}
        disabled={readonly}
      />
    );
  };

  const getInstructorTable = () => {
    return instructors && instructors.length > 0 && <CubeInstructorTable readonly={readonly} />;
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        강사 정보 <span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        {!readonly ? (
          <>
            <Form.Group>
              <InstructorModal instructors={instructors} onOk={onClickOkInModal} />
              {nullCheckField()}
            </Form.Group>
            {getInstructorTable()}
          </>
        ) : (
          (instructors && instructors.length > 0 && getInstructorTable()) || nullCheckField()
        )}
      </Table.Cell>
    </Table.Row>
  );
});
