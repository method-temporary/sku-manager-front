import React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Container, Tab, Form } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, confirm, ConfirmModel, PageTitle, SubActions, Loader } from 'shared/components';

import { CollegeService } from '../../../../college';
import { LectureQueryModel } from '../../../lecture/model/LectureQueryModel';
import { findInstructorCubesForAdmin } from '../../../lecture/api/LectureApi';
import LectureListContainer from '../../../lecture/ui/logic/LectureListContainer';
import { InstructorCubeAdminRdo } from '../../../../cube/cube/model/sdo/InstructorCubeAdminRdo';

import InstructorService from '../../present/logic/InstructorService';

import InstructorInfoView from '../View/InstructorInfoView';
import Polyglot from 'shared/components/Polyglot';

interface Params {
  cineroomId: string;
  instructorId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface State {
  activeIndex: number;
}

interface Injected {
  sharedService: SharedService;
  instructorService: InstructorService;
  collegeService: CollegeService;
}

@inject('sharedService', 'instructorService', 'collegeService')
@observer
@reactAutobind
class InstructorDetailContainer extends ReactComponent<Props, {}, Injected> {
  //
  state: State = {
    activeIndex: 0,
  };

  constructor(props: Props) {
    super(props);

    const { instructorId } = this.props.match.params;

    if (instructorId) {
      this.findInstructor(instructorId);
    } else {
      this.routeToInstructorList();
    }
  }

  getOpenedPanes() {
    //
    const { instructorId } = this.props.match.params;
    const { instructorService, collegeService } = this.injected;
    const { instructor } = instructorService;
    const { collegesMap } = collegeService;

    const menuItems: { menuItem: string; render: () => JSX.Element }[] = [];

    menuItems.push(
      {
        menuItem: '강사 정보',
        render: () => (
          <Tab.Pane>
            <Loader>
              <Polyglot languages={instructor.instructor.langSupports}>
                <InstructorInfoView instructor={instructor} collegesMap={collegesMap} />
              </Polyglot>
            </Loader>
          </Tab.Pane>
        ),
      },
      {
        menuItem: '강의 관리',
        render: () => (
          <Tab.Pane>
            <LectureListContainer instructorId={instructorId} />
          </Tab.Pane>
        ),
      }
    );

    return menuItems;
  }

  async findInstructor(instructorId: string) {
    //
    await this.injected.instructorService.findInstructorById(instructorId);
  }

  onTabChange(e: any, data: any) {
    //
    this.setState({ activeIndex: data.activeIndex });
  }

  async onClickInstructorRemove() {
    //

    if (await this.checkInstructorCubes()) {
      alert(AlertModel.getCustomAlert(false, '삭제 불가 안내', '매핑된 강좌 정보가 존재합니다.', '확인'));
      return;
    }

    confirm(ConfirmModel.getRemoveConfirm(this.removeInstructor));
  }

  async removeInstructor() {
    //
    const { removeInstructor } = this.injected.instructorService;
    await removeInstructor(this.props.match.params.instructorId);

    await alert(AlertModel.getRemoveSuccessAlert(this.routeToInstructorList));
  }

  async checkInstructorCubes() {
    //
    const lectureQueryModel = new LectureQueryModel();
    lectureQueryModel.instructorId = this.props.match.params.instructorId;
    lectureQueryModel.period.startDateMoment = moment(new Date('1970-01-01'));
    let lectureCount = 0;
    await findInstructorCubesForAdmin(
      InstructorCubeAdminRdo.InstructorCubeAdminRdoByInstructorId(lectureQueryModel.instructorId)
    ).then((response) => {
      lectureCount = response.totalCount;
    });

    if (lectureCount > 0) {
      return true;
    }
    return false;
  }

  routeToInstructorList() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/instructors/instructor-list`
    );
  }

  routeToInstructorModify() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/instructors/instructor-modify/${this.props.match.params.instructorId}`
    );
  }

  render() {
    //
    return (
      <Container fluid>
        <Form>
          <PageTitle breadcrumb={SelectType.instructorSections} />
          <Tab
            panes={this.getOpenedPanes()}
            menu={{ secondary: true, pointing: true }}
            className="styled-tab tab-wrap"
            onTabChange={(e: any, data: any) => this.onTabChange(e, data)}
          />

          <SubActions form>
            <SubActions.Left>
              {this.state.activeIndex === 0 && (
                <>
                  <Button onClick={this.routeToInstructorModify} type="button">
                    수정
                  </Button>
                  <Button primary onClick={this.onClickInstructorRemove} type="button">
                    삭제
                  </Button>
                </>
              )}
            </SubActions.Left>
            <SubActions.Right>
              <Button onClick={this.routeToInstructorList} type="button">
                목록
              </Button>
            </SubActions.Right>
          </SubActions>
        </Form>
      </Container>
    );
  }
}

export default InstructorDetailContainer;
