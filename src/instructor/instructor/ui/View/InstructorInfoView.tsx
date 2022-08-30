import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Table, Segment } from 'semantic-ui-react';

import { InstructorWithUserIdentity } from '../../model/InstructorWithUserIdentity';

import { Image } from 'shared/components';
import Polyglot from 'shared/components/Polyglot';

interface Props {
  instructor: InstructorWithUserIdentity;
  collegesMap: Map<string, string>;
}

@observer
@reactAutobind
class InstructorInfoView extends React.Component<Props> {
  //
  fileInputRef = React.createRef<HTMLInputElement>();

  render() {
    //
    const {
      instructor: { instructor, user },
      collegesMap,
    } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="10%" />
          <col width="40%" />
          <col width="10%" />
          <col width="40%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={4} className="title-header">
              강사 정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">지원 언어</Table.Cell>
            <Table.Cell colSpan={3}>
              <Polyglot.Languages onChangeProps={() => {}} readOnly />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">기본 언어</Table.Cell>
            <Table.Cell colSpan={3}>
              <Polyglot.Default onChangeProps={() => {}} readOnly />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell className="tb-header">강사구분</Table.Cell>
            <Table.Cell>{instructor.internal ? '사내' : '사외'}</Table.Cell>
            <Table.Cell className="tb-header">강의활동 여부</Table.Cell>
            <Table.Cell>{instructor.resting ? '비활동' : '활동'}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">Category</Table.Cell>
            <Table.Cell colSpan={3}>{collegesMap.get(instructor.collegeId)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>사번</Table.Cell>
            <Table.Cell>{user.employeeId || ''}</Table.Cell>
            <Table.Cell>이름</Table.Cell>
            <Table.Cell>
              <Polyglot.Input
                name="name"
                languageStrings={instructor.internal ? user.name : instructor.name}
                readOnly
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">직위</Table.Cell>
            <Table.Cell>
              <Polyglot.Input name="Position" languageStrings={instructor.position} readOnly />
            </Table.Cell>
            <Table.Cell className="tb-header">소속기관/부서</Table.Cell>
            <Table.Cell>
              <Polyglot.Input
                name="Department"
                languageStrings={instructor.internal ? user.departmentName : instructor.organization}
                readOnly
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>E-mail</Table.Cell>
            <Table.Cell colSpan={3}>{instructor.internal ? user.email : instructor.email}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>연락처</Table.Cell>
            <Table.Cell colSpan={3}>{instructor.internal ? user.phone : instructor.phone}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>태그</Table.Cell>
            <Table.Cell colSpan={3}>
              <Polyglot.Input name="tag" languageStrings={instructor.tag} readOnly />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell className="tb-header">이미지</Table.Cell>
            <Table.Cell colSpan={3}>
              {instructor.photoFilePath && (
                <div className="profile-img size110 line">
                  <Segment.Inline>
                    <Image src={instructor.photoFilePath} size="small" verticalAlign="bottom" />
                  </Segment.Inline>
                </div>
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>세부 강의 분야</Table.Cell>
            <Table.Cell colSpan={3}>
              <span className="white-space-pre">
                <Polyglot.TextArea name="lectureField" languageStrings={instructor.lectureField} readOnly />
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>경력</Table.Cell>
            <Table.Cell colSpan={3}>
              <Polyglot.TextArea name="career" languageStrings={instructor.career} readOnly />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>강사임용일</Table.Cell>
            <Table.Cell colSpan={3}>{instructor.appointmentDate}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default InstructorInfoView;
