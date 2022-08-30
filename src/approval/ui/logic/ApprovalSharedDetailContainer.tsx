import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Breadcrumb, Button, Container, Header } from 'semantic-ui-react';

import { mobxHelper, reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { Loader, Polyglot } from 'shared/components';
import { ALL_LANGUAGES } from 'shared/components/Polyglot';

import { learningManagementUrl } from '../../../Routes';
import ApprovalCubeService from '../../present/logic/ApprovalCubeService';
import ApprovalDetailBasicInfoView from '../view/ApprovalDetailBasicInfoView';

interface Props
  extends RouteComponentProps<{
    studentId: string;
    cineroomId: string;
  }> {
  approvalCubeService?: ApprovalCubeService;
}

@inject(mobxHelper.injectFrom('approvalCubeService'))
@observer
@reactAutobind
class ApprovalSharedDetailContainer extends React.Component<Props> {
  routeToApprovalList() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/approves/approve-management/paid-course`
    );
  }

  render() {
    const { studentId } = this.props.match.params;

    return (
      <Container fluid>
        <Polyglot languages={ALL_LANGUAGES}>
          <div>
            <Breadcrumb icon="right angle" sections={SelectType.paidCourseSections} />
            <Header as="h2">유료과정</Header>
          </div>

          <Loader>
            <ApprovalDetailBasicInfoView studentId={studentId} />
          </Loader>
          <div className="btn-group">
            <div className="fl-right">
              <Button basic onClick={this.routeToApprovalList} type="button">
                목록
              </Button>
            </div>
          </div>
        </Polyglot>
      </Container>
    );
  }
}
export default withRouter(ApprovalSharedDetailContainer);
