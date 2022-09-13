import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import CourseSetInfoForApprovalView from '../view/CourseSetInfoForApprovalView';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { FormTable } from 'shared/components';
import { CardService } from '../../../../card';
import { CollegeService } from '../../../../college';

interface Injected {
  cardService: CardService;
  collegeService: CollegeService;
}

interface Props extends RouteComponentProps<Params> {
  cubeId: string;
}

interface Params {}

@inject('cardService', 'collegeService')
@observer
@reactAutobind
class CreateCourseSetInfoContainer extends ReactComponent<Props, {}, Injected> {
  //
  componentDidMount() {
    // 최초에만 실행
  }

  // CreateCourseSetInfoContainer() {
  //   //this.props.coursePlanService = CoursePlanService.instance;
  // }

  // addDiscussionClick(feedbackId?: string) {
  //   this.setState({ open: true });
  //   feedbackId && this.setState({ feedbackId });
  //
  //   // this.addDiscussionSet(new DiscussionModel());
  // }

  closeDiscussionPopup() {
    this.setState({
      open: false,
      feedbackId: '',
    });
  }

  findCollegeName(collegeId: string): string | undefined {
    //
    const { collegeService } = this.injected;
    return collegeService.collegesMap.get(collegeId);
  }

  findChannelName(channelId: string): string | undefined {
    //
    const { collegeService } = this.injected;
    return collegeService.channelMap.get(channelId);
  }

  render() {
    //
    const { cardService } = this.injected;
    const { cards } = cardService;

    return (
      <>
        {/* <FormTable title="Mapping Card 정보">
          <CourseSetInfoForApprovalView
            findCollegeName={this.findCollegeName}
            findChannelName={this.findChannelName}
            cards={cards}
          />
        </FormTable> */}
        {/*<DiscussionModal*/}
        {/*  discussionModalOpen={this.state.open}*/}
        {/*  closeDiscussionPopup={this.closeDiscussionPopup}*/}
        {/*  courseSetInfoDescriptionQuillRef={null}*/}
        {/*  feedbackId={this.state.feedbackId}*/}
        {/*  detail={true}*/}
        {/*/>*/}
      </>
    );
  }
}

export default withRouter(CreateCourseSetInfoContainer);
