import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import CubeInstructorModal from '../logic/CubeInstructorModal';
import { Button, Form, Icon, Input, Radio, Table } from 'semantic-ui-react';
import { CubeModel } from '../../model/CubeModel';
import CubeInstructorModel from '../../CubeInstructorModel';

interface Props {
  onChangeTargetInstructor: (index: number, name: string, value: any) => void;
  onSelectInstructor: (index: number, name: string, value: boolean) => void;
  onDeleteInstructor: (index: number) => void;

  cube: CubeModel;
  cubeInstructors: CubeInstructorModel[];
  readonly?: boolean;
  round: number;
}

interface States {}

@observer
@reactAutobind
class CreateInstructorInfoView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const { onChangeTargetInstructor, onSelectInstructor, onDeleteInstructor } = this.props;
    const { cubeInstructors, readonly, round } = this.props;

    return (
      <>
        {readonly ? null : <CubeInstructorModal multiple round={round} />}
        {cubeInstructors.length > 0 ? (
          <Table celled>
            <colgroup>
              <col width="9%" />
              <col width="20%" />
              <col width="10%" />
              <col width="30%" />
              <col width="13%" />
              <col width="13%" />
              <col width="5%" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">대표강사 지정</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">강의시간</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">학습인정시간</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {cubeInstructors
                .filter((target) => target.round === round)
                .map((instructor, index) => {
                  const company = instructor.department || instructor.company || '-';
                  const name = instructor.name || '-';
                  const email = instructor.email || '-';

                  return (
                    <Table.Row key={index}>
                      <Table.Cell textAlign="center">
                        <Form.Field
                          control={Radio}
                          checked={instructor.representative}
                          onChange={() => onChangeTargetInstructor(index, 'representative', true)}
                          disabled={readonly}
                        />
                      </Table.Cell>
                      <Table.Cell>{company}</Table.Cell>
                      <Table.Cell>{name}</Table.Cell>
                      <Table.Cell>{email}</Table.Cell>
                      <Table.Cell>
                        {readonly ? (
                          <span>{instructor && instructor.lectureTime}</span>
                        ) : (
                          <Form.Field
                            control={Input}
                            value={instructor.lectureTime}
                            type="number"
                            name={instructor.usid}
                            onChange={(e: any, data: any) => onChangeTargetInstructor(index, 'lectureTime', data.value)}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {readonly ? (
                          <span>{instructor && instructor.instructorLearningTime}</span>
                        ) : (
                          <Form.Field
                            control={Input}
                            value={instructor.instructorLearningTime}
                            type="number"
                            name={instructor.usid}
                            onChange={(e: any, data: any) =>
                              onSelectInstructor(index, 'instructorLearningTime', data.value)
                            }
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {readonly ? null : (
                          <Button size="mini" basic name={instructor.usid} onClick={() => onDeleteInstructor(index)}>
                            <Icon name="minus" />
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        ) : null}
      </>
    );
  }
}

export default CreateInstructorInfoView;
