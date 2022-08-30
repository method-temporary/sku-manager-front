import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Checkbox, Dropdown, Form, Header, Input, Radio, Segment, Table } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { Modal, Pagination } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import CubeService from '../../present/logic/CubeService';
import { InstructorService } from '../../../../instructor/instructor';
import { InstructorWithUserIdentity } from '../../../../instructor/instructor/model/InstructorWithUserIdentity';
import CubeInstructorModel from '../../CubeInstructorModel';
import { CollegeService } from '../../../../college';
import { setState } from '../../../../dashBoard/store/DashBoardSentenceRdoStore';

interface Props {
  setInstructorInClassroom?: (selectedInstructor: InstructorWithUserIdentity, type: string) => void;
  type?: string;
  multiple?: boolean;
  readonly?: boolean;
  selectedInstructors?: CubeInstructorModel[];
  round: number;
}

interface States {}

interface Injected {
  cubeService: CubeService;
  instructorService: InstructorService;
  sharedService: SharedService;
  collegeService: CollegeService;
}

@inject('cubeService', 'instructorService', 'sharedService', 'collegeService')
@observer
@reactAutobind
class CubeInstructorModal extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'CubeInstructor';

  componentDidMount() {
    // this.findAllInstructors();
  }

  onMount() {
    this.injected.instructorService.clearInstructorSdoForModal();

    this.findAllInstructors();
    if (this.props.selectedInstructors) {
      const selectedInstructorWiths = this.props.selectedInstructors.map((cubeInstructor) =>
        InstructorWithUserIdentity.asInstructorWithUserIdentityByCubeInstructor(cubeInstructor)
      );

      this.injected.instructorService.setSelectedInstructors([...selectedInstructorWiths]);
    } else {
      this.injected.instructorService.setSelectedInstructors([]);
    }
  }

  findAllInstructors() {
    //
    const { instructorService, sharedService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    pageModel.limit = 10;
    instructorService.findAllInstructors(pageModel, instructorService.instructorSdoForModal).then((totalCount) => {
      sharedService.setCount(this.paginationKey, totalCount);
    });
  }

  handleOnSearch(internal: string, name: string) {
    //
    const { instructorService } = this.injected;

    instructorService.changeInstructorSdoForModalProps('internal', internal);
    instructorService.changeInstructorSdoForModalProps('searchPart', '성명');
    instructorService.changeInstructorSdoForModalProps('searchWord', name);
    this.findAllInstructors();
  }

  onChangeInstructorProps(name: string, value: string | boolean | number) {
    //
    const { instructorService } = this.injected;
    instructorService.changeInstructorProps(name, value);
  }

  selectInstructorRow(selectedInstructorWiths: InstructorWithUserIdentity, select?: boolean) {
    //
    const { instructor, user } = selectedInstructorWiths;
    const { multiple } = this.props;
    const { instructorService } = this.injected;
    if (multiple === true) {
      const { appendSelectedInstructor, removeSelectedInstructor } = instructorService;
      if (select === true) {
        appendSelectedInstructor(selectedInstructorWiths);
      } else {
        removeSelectedInstructor(instructor.id);
      }
    } else {
      this.onChangeInstructorProps('id', instructor.id);
      this.onChangeInstructorProps('usid', instructor.id);
      this.onChangeInstructorProps('employeeId', user.employeeId);
      this.onChangeInstructorProps('memberSummary.email', user.email);
      this.onChangeInstructorProps('memberSummary.name', getPolyglotToAnyString(user.name));
      this.onChangeInstructorProps('memberSummary.department', getPolyglotToAnyString(user.departmentName));
      // this.onChangeInstructorProps('specialtyEnName', selectedInstructor.specialtyEnName);
      this.onChangeInstructorProps('internal', instructor.internal);
    }
  }

  handleSetInstructorInClassroom(selectedInstructor: InstructorWithUserIdentity, type: string) {
    const { setInstructorInClassroom } = this.props;
    if (setInstructorInClassroom) {
      setInstructorInClassroom(selectedInstructor, type);
    }
  }

  handleSetInstructorsInCube(selectedInstructors: InstructorWithUserIdentity[]) {
    this.setInstructorInCube(selectedInstructors);
  }

  handleSetInstructorInCube(selectedInstructor: InstructorWithUserIdentity) {
    this.setInstructorInCube([selectedInstructor]);
  }

  setInstructorInCube(selectedInstructors: InstructorWithUserIdentity[]) {
    //
    const { cubeService } = this.injected;
    // 비교하여 추가삭제
    const oriCubeInstructor = [...cubeService.cubeInstructors];
    selectedInstructors.forEach((selectedInstructor) => {
      const { instructor, user } = selectedInstructor;

      const thisRound = cubeService.cubeInstructors.filter((item) => item.round === this.props.round);
      if (JSON.stringify(thisRound).indexOf(instructor.id) < 0) {
        // 부모에 추가
        const cubeInstructor = new CubeInstructorModel();
        cubeInstructor.id = instructor.id;
        cubeInstructor.company =
          getPolyglotToAnyString(user.departmentName) || getPolyglotToAnyString(instructor.organization);
        cubeInstructor.name = getPolyglotToAnyString(user.name) || getPolyglotToAnyString(instructor.name);
        cubeInstructor.email = user.email || instructor.email;
        cubeInstructor.round = this.props.round;
        cubeInstructor.internal = instructor.internal;
        oriCubeInstructor.push(cubeInstructor); // 부모에 추가
      }
    });
    cubeService.setCubeInstructors(oriCubeInstructor);

    return oriCubeInstructor;
  }

  render() {
    //
    const { type, multiple, readonly } = this.props;
    const { instructors, instructor: selectedInstructor, selectedInstructors } = this.injected.instructorService;
    const { collegesMap } = this.injected.collegeService;

    return (
      <Modal
        size="small"
        trigger={<>{readonly ? null : <Button type="button">강사 선택</Button>}</>}
        onMount={this.onMount}
      >
        <InstrcutorListModalHeaderView onSearch={this.handleOnSearch} />
        <Modal.Content className="fit-layout">
          <Form>
            <Table>
              <colgroup>
                <col width="11%" />
                <col width="14%" />
                <col width="10%" />
                <col width="30%" />
                <col width="35%" />
              </colgroup>

              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">Select</Table.HeaderCell>
                  <Table.HeaderCell>성명</Table.HeaderCell>
                  <Table.HeaderCell>사내/사외</Table.HeaderCell>
                  <Table.HeaderCell>소속정보</Table.HeaderCell>
                  <Table.HeaderCell>카테고리</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(instructors &&
                  instructors.length &&
                  instructors.map((result, index) => {
                    const { instructor, user } = result;

                    let checked = instructor.id === selectedInstructor.instructor.id;
                    if (multiple === true) {
                      checked = selectedInstructors.some((c) => c.instructor.id === instructor.id);
                    }
                    const onSelect = () => {
                      if (multiple === true) {
                        this.selectInstructorRow(result, !checked);
                      } else {
                        this.selectInstructorRow(result);
                      }
                    };
                    return (
                      <Table.Row key={index}>
                        <Table.Cell textAlign="center">
                          <Form.Field
                            control={multiple === true ? Checkbox : Radio}
                            value="1"
                            checked={checked}
                            onChange={onSelect}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {getPolyglotToAnyString(user.name) || getPolyglotToAnyString(instructor.name)}
                        </Table.Cell>
                        <Table.Cell textAlign="center">{instructor.internal ? '사내' : '사외'}</Table.Cell>
                        <Table.Cell>
                          {getPolyglotToAnyString(user.departmentName) ||
                            getPolyglotToAnyString(instructor.organization)}
                        </Table.Cell>
                        <Table.Cell>
                          {collegesMap.get(instructor.collegeId)}
                          {/*&nbsp; &gt; &nbsp;*/}
                          {/*{result.category && result.category.channel && result.category.channel.name}*/}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })) ||
                  null}
              </Table.Body>
            </Table>
          </Form>
          <Pagination name={this.paginationKey} onChange={this.findAllInstructors}>
            <Pagination.Navigator />
          </Pagination>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton className="w190 d" type="button">
            Cancel
          </Modal.CloseButton>
          {type === 'classroom' ? (
            <Modal.CloseButton
              className="w190 p"
              primary
              onClick={() => this.handleSetInstructorInClassroom(selectedInstructor, 'classroom')}
              type="button"
            >
              OK
            </Modal.CloseButton>
          ) : multiple ? (
            <Modal.CloseButton
              className="w190 p"
              onClick={() => this.handleSetInstructorsInCube(selectedInstructors)}
              type="button"
            >
              OK
            </Modal.CloseButton>
          ) : (
            <Modal.CloseButton
              className="w190 p"
              onClick={() => this.handleSetInstructorInCube(selectedInstructor)}
              type="button"
            >
              OK
            </Modal.CloseButton>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

interface InstructorListModalHeaderViewProps {
  onSearch: (internal: string, name: string) => void;
}

const InstrcutorListModalHeaderView = ({ onSearch }: InstructorListModalHeaderViewProps) => {
  const [internal, setInternal] = React.useState('');
  const [name, setName] = React.useState('');
  const handleInternalDivisionChange = (e: any, data: any) => {
    setInternal(data.value);
  };
  const handleSearchKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearch(internal === '*' ? '' : internal, name);
    }
  };
  const handleSearchKeyChange = (e: any, data: any) => {
    setName(data.value);
  };

  return (
    <Segment vertical clearing style={{ padding: '1rem 1rem 0 1.5rem' }}>
      <Header as="h5" floated="right">
        <Form.Field inline>
          <Dropdown
            selection
            options={SelectType.instructorInternalDivision}
            defaultValue="*"
            onChange={handleInternalDivisionChange}
          />
          <Input
            icon="search"
            width={2}
            placeholder="Search..."
            onChange={handleSearchKeyChange}
            onKeyDown={handleSearchKeyDown}
          />
        </Form.Field>
      </Header>
      <Header floated="left" aligned="center" style={{ paddingTop: '0.5rem' }}>
        강사 선택
      </Header>
    </Segment>
  );
};

export default CubeInstructorModal;
