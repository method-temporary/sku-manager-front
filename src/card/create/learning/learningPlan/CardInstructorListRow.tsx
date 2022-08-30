import React from 'react';
import LearningStore from '../Learning.store';
import { Form, Radio, Table } from 'semantic-ui-react';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import { InstructorWithOptional } from '../../../../instructor/instructor/shared/components/instructorModal/model/InstructorWithOptional';
import { observer } from 'mobx-react';

interface props {
  readonly?: boolean;
}

export const CardInstructorListRow = observer(({ readonly }: props) => {
  //
  const { instructors, setInstructors } = LearningStore.instance;

  const onClickRepresentedButton = (id: string) => {
    const newInstructorList: InstructorWithOptional[] = instructors.map((instructor) => {
      return { ...instructor, representative: instructor.instructor.id === id };
    });

    setInstructors(newInstructorList);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">강사 정보</Table.Cell>
      <Table.Cell colSpan={3}>
        {instructors.length > 0 && (
          <Table celled>
            <colgroup>
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">대표강사 지정</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {instructors.map(({ instructor, user, invitation, representative }, index) => (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">
                    <Form.Field
                      control={Radio}
                      value="1"
                      disabled={readonly}
                      checked={(representative && true) || false}
                      onChange={() => onClickRepresentedButton(instructor.id)}
                    />
                  </Table.Cell>

                  <Table.Cell>
                    {getPolyglotToAnyString(
                      instructor.internal ? instructor.organization || user.companyName : instructor.organization
                    ) || '-'}
                  </Table.Cell>
                  <Table.Cell>
                    {getPolyglotToAnyString(instructor.internal ? instructor.name || user.name : instructor.name)}
                  </Table.Cell>
                  <Table.Cell>{instructor.internal ? instructor.email || user.email : instructor.email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Table.Cell>
    </Table.Row>
  );
});
