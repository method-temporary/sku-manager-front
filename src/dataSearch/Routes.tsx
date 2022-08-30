import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { DataSearchSideBarLayout } from 'shared/ui';
import DataBadgeListContainer from './badgeCompany/ui/logic/DataBadgeListContainer';
import DataChannelListContainer from './Channel/ui/logic/DataChannelListContainer';
import DataCommunityListContainer from './CommunityMember/ui/logic/DataCommunityListContainer';
import DataFavoritesListContainer from './Favorites/ui/logic/DataFavoritesListContainer';
import DataLearningCubeListContainer from './learningCube/ui/logic/DataLearningCubeListContainer';
import DataCardMappingListContainer from './cardMappingList/ui/logic/DataCardMappingListContainer';
import DataMetaCardListContainer from './metaCard/ui/logic/DataMetaCardListContainer';
import DataCardInstructorListContainer from './cardInstructor/ui/logic/DataCardInsturctorListContainer';
import DataCardPermittedListContainer from './cardPermitted/ui/logic/DataCardPermittedListContainer';
import DataCardPrerequisiteListContainer from './cardPrerequisite/ui/logic/DataCardPrerequisiteListContainer';
import DataMetaCubeListContainer from './metaCube/ui/logic/DataMetaCubeListContainer';
import DataCubeInstructorListContainer from './cubeInstructor/ui/logic/DataCubeInsturctorListContainer';
import DataMetaBadgeListContainer from './metaBadge/ui/logic/DataMetaBadgeListContainer';
import DataCubeClassroomListContainer from './cubeClassroom/ui/logic/DataCubeClassroomListContainer';
import DataTaskCubeListContainer from './taskCube/ui/logic/DataTaskCubeListContainer';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <DataSearchSideBarLayout>
              <Route exact path={`${match.path}/data/badge-list`} component={DataBadgeListContainer} />
              <Route exact path={`${match.path}/data/channel-interest`} component={DataChannelListContainer} />
              <Route exact path={`${match.path}/data/community-member`} component={DataCommunityListContainer} />
              <Route exact path={`${match.path}/data/favorites`} component={DataFavoritesListContainer} />
              <Route exact path={`${match.path}/data/learning-cube`} component={DataLearningCubeListContainer} />
              <Route exact path={`${match.path}/data/card-meta`} component={DataMetaCardListContainer} />
              <Route exact path={`${match.path}/data/card-instructor`} component={DataCardInstructorListContainer} />
              <Route exact path={`${match.path}/data/card-permitted`} component={DataCardPermittedListContainer} />
              <Route exact path={`${match.path}/data/card-prerequisite`} component={DataCardPrerequisiteListContainer} />
              <Route exact path={`${match.path}/data/cube-meta`} component={DataMetaCubeListContainer} />
              <Route exact path={`${match.path}/data/cube-instructor`} component={DataCubeInstructorListContainer} />
              <Route exact path={`${match.path}/data/meta-badge`} component={DataMetaBadgeListContainer} />
              <Route exact path={`${match.path}/data/cube-classroom`} component={DataCubeClassroomListContainer} />
              <Route exact path={`${match.path}/data/task-cube`} component={DataTaskCubeListContainer} />
              <Route exact path={`${match.path}/data/card-cube-mapping`} component={DataCardMappingListContainer} />
            </DataSearchSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
