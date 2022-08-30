import React from 'react';
import CardInstructorsModel from '../../model/vo/CardInstructorsModel';
import { Table, Form, Radio } from 'semantic-ui-react';

interface Props {
  isUpdatable: boolean;
  instructors: CardInstructorsModel[];
  onChangeRepresentativeInstructor: (seq: number) => void;
}

class CardInstructorListView extends React.Component<Props> {
  //
  render() {
    //
    const { isUpdatable, instructors, onChangeRepresentativeInstructor } = this.props;

    return (
      <>
        {instructors.length > 0 && (
          <Table celled>
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              {/*<col width="13%" />*/}
              {/*<col width="13%" />*/}
              {/*<col width="5%" />*/}
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
              {instructors.map((instructor, index) => (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">
                    <Form.Field
                      control={Radio}
                      value="1"
                      disabled={!isUpdatable}
                      checked={instructor.representative}
                      onChange={() => onChangeRepresentativeInstructor(index)}
                    />
                  </Table.Cell>
                  <Table.Cell>{(instructor.company && instructor.company) || '-'}</Table.Cell>
                  <Table.Cell>{(instructor.name && instructor.name) || '-'}</Table.Cell>
                  <Table.Cell>{(instructor.email && instructor.email) || '-'}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </>
    );
  }
}

export default CardInstructorListView;
