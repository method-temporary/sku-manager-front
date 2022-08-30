import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Form, Icon, Input, Radio, Table, TableCell } from 'semantic-ui-react';
import CubeInstructorModal from '../logic/CubeInstructorModal';
import CubeInstructorModel from '../../CubeInstructorModel';

interface Props {
  onChangeTargetInstructor: (instructor: CubeInstructorModel, name: string, value: any) => void;
  onSelectInstructor: (instructor: CubeInstructorModel, name: string, value: boolean) => void;
  onDeleteInstructor: (instructor: CubeInstructorModel) => void;
  cubeInstructors: CubeInstructorModel[];
  round: number;
  readonly?: boolean;
  inClassroom?: boolean;
}

interface States {}

@observer
@reactAutobind
class CubeInstructorInfoView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const {
      onChangeTargetInstructor,
      onSelectInstructor,
      onDeleteInstructor,
      cubeInstructors,
      round,
      readonly,
      inClassroom,
    } = this.props;

    const selectedInstructor = cubeInstructors.filter((target) => target.round === round);

    return (
      <>
        <CubeInstructorModal multiple readonly={readonly} round={round} selectedInstructors={selectedInstructor} />
        {cubeInstructors.length > 0 && cubeInstructors.filter((instructor) => instructor.round === round).length > 0 ? (
          <Table celled>
            <colgroup>
              {!inClassroom ? (
                <>
                  <col width="9%" />
                  <col width="20%" />
                  <col width="10%" />
                  <col width="" />
                  <col width="13%" />
                  <col width="13%" />
                  {readonly ? null : <col width="5%" />}
                </>
              ) : (
                <>
                  <col width="20%" />
                  <col width="10%" />
                  <col width="30%" />
                  <col width="13%" />
                  <col width="13%" />
                </>
              )}
            </colgroup>
            <Table.Header>
              <Table.Row>
                {!inClassroom ? <Table.HeaderCell textAlign="center">대표강사 지정</Table.HeaderCell> : null}
                <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">강의시간</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">학습인정시간</Table.HeaderCell>
                {inClassroom ? null : readonly ? null : <Table.HeaderCell textAlign="center" />}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {cubeInstructors
                .filter((instructor) => instructor.round === round)
                .map((result, index) => {
                  const company = result.department || result.company || '-';
                  const name = result.name || '-';
                  const email = result.email || '-';

                  return (
                    <Table.Row key={index}>
                      {!inClassroom ? (
                        <Table.Cell textAlign="center">
                          <Form.Field
                            control={Radio}
                            // value={true}
                            checked={result.representative}
                            onChange={() => onSelectInstructor(result, 'representative', true)}
                            disabled={readonly}
                          />
                        </Table.Cell>
                      ) : null}
                      <Table.Cell>{company}</Table.Cell>
                      <Table.Cell>{name}</Table.Cell>
                      <Table.Cell>{email}</Table.Cell>
                      {result.internal ? (
                        readonly ? (
                          <Table.Cell>{result.lectureTime}</Table.Cell>
                        ) : (
                          <TableCell>
                            <Form.Group inline>
                              <Form.Field
                                className="inline-important"
                                control={Input}
                                value={result.lectureTime}
                                onChange={(e: any, data: any) =>
                                  onChangeTargetInstructor(result, 'lectureTime', data.value)
                                }
                                type="number"
                              />
                              <p>분</p>
                            </Form.Group>
                          </TableCell>
                        )
                      ) : (
                        <TableCell>-</TableCell>
                      )}
                      {result.internal ? (
                        readonly ? (
                          <Table.Cell>{result.instructorLearningTime}</Table.Cell>
                        ) : (
                          <TableCell>
                            <Form.Group inline>
                              <Form.Field
                                control={Input}
                                value={result.instructorLearningTime}
                                onChange={(e: any, data: any) =>
                                  onChangeTargetInstructor(result, 'instructorLearningTime', data.value)
                                }
                                type="number"
                              />
                              <p>분</p>
                            </Form.Group>
                          </TableCell>
                        )
                      ) : (
                        <TableCell>-</TableCell>
                      )}
                      {inClassroom ? null : readonly ? null : (
                        <Table.Cell>
                          <Button size="mini" basic name={result.usid} onClick={() => onDeleteInstructor(result)}>
                            <Icon name="minus" />
                          </Button>
                        </Table.Cell>
                      )}
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

export default CubeInstructorInfoView;
