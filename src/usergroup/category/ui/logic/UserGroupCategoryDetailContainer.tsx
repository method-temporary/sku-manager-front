import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Container } from 'semantic-ui-react';

import { SharedService } from 'shared/present';
import { SelectType } from 'shared/model';
import { PageTitle, SubActions } from 'shared/components';

import { UserGroupCategoryService } from '../../../index';
import UserGroupCategoryDetailView from '../view/UserGroupCategoryDetailView';
import Polyglot from 'shared/components/Polyglot';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  userGroupCategoryId: string;
}

interface State {}

interface Injected {
  userGroupCategoryService: UserGroupCategoryService;
  sharedService: SharedService;
}

@inject('userGroupCategoryService', 'sharedService')
@observer
@reactAutobind
class UserGroupCategoryCreateAndDetailContainer extends ReactComponent<Props, State, Injected> {
  //
  componentDidMount() {
    //
    this.findUserGroupCategory();
  }

  async findUserGroupCategory() {
    //
    this.injected.userGroupCategoryService.clearUserGroupCategory();
    await this.injected.userGroupCategoryService.findUserGroupCategoryById(this.props.match.params.userGroupCategoryId);
  }

  routeToUserGroupCategoryList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup-category/user-group-category-list`
    );
  }

  routeToUserGroupCategoryModify(userGroupCategoryId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup-category/user-group-category-modify/${userGroupCategoryId}`
    );
  }

  render() {
    //
    const userGroupCategory = this.injected.userGroupCategoryService.userGroupCategory;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.userGroupCategory} />

        <Polyglot languages={userGroupCategory.langSupports}>
          <UserGroupCategoryDetailView userGroupCategory={userGroupCategory} />

          <SubActions form>
            <SubActions.Left>
              {userGroupCategory.cineroomId === this.props.match.params.cineroomId && (
                <Button type="button" onClick={() => this.routeToUserGroupCategoryModify(userGroupCategory.id)}>
                  수정
                </Button>
              )}
            </SubActions.Left>
            <SubActions.Right>
              <Button basic onClick={this.routeToUserGroupCategoryList} type="button">
                목록
              </Button>
            </SubActions.Right>
          </SubActions>
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(UserGroupCategoryCreateAndDetailContainer);
