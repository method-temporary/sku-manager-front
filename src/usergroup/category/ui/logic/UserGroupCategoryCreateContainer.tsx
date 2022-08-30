import * as React from 'react';
import { Button, Container } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, PolyglotModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { PageTitle, SubActions, Polyglot, alert, AlertModel } from 'shared/components';
import { isPolyglotEmpty } from 'shared/components/Polyglot';

import { UserGroupCategoryService } from '../../../index';
import UserGroupCategoryCreateView from '../view/UserGroupCategoryCreateView';
import { UserGroupCategoryQueryModel } from '../../model';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  userGroupCategoryId?: string;
}

interface State {
  userGroupCategoryName: PolyglotModel;
}

interface Injected {
  userGroupCategoryService: UserGroupCategoryService;
  sharedService: SharedService;
}

@inject('userGroupCategoryService', 'sharedService')
@observer
@reactAutobind
class UserGroupCategoryCreateContainer extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    userGroupCategoryName: new PolyglotModel(),
  };

  componentDidMount() {
    //
    this.findUserGroupCategory();
  }

  async findUserGroupCategory() {
    //
    const { userGroupCategoryId } = this.props.match.params;

    if (userGroupCategoryId) {
      const { userGroupCategoryService } = this.injected;

      await userGroupCategoryService.findUserGroupCategoryById(userGroupCategoryId);

      await this.setState({
        userGroupCategoryName: userGroupCategoryService.userGroupCategory.name,
      });
    }
  }

  routeToGroupCategoryList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup-category/user-group-category-list`
    );
  }

  routeToGroupCategoryDetail(userGroupCategoryId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup-category/user-group-category-detail/${userGroupCategoryId}`
    );
  }

  async onClickRegisterGroupCategory() {
    //
    const { userGroupCategoryService } = this.injected;
    const { userGroupCategoryName } = this.state;
    const userGroupCategoryId = this.props.match.params.userGroupCategoryId || '';
    const { userGroupCategory } = userGroupCategoryService;

    if (isPolyglotEmpty(userGroupCategoryName)) {
      alert(AlertModel.getRequiredInputAlert(`"사용자 그룹 분류명"`));
      return;
    }

    if (userGroupCategoryId && userGroupCategory.name === userGroupCategoryName) {
      this.saveUserGroupCategory(userGroupCategoryId);
      return;
    }

    // TODO UserGroup Category 명 중복 체크
    // const offsetElementList = await userGroupCategoryService.findUserGroupCategoryByName(userGroupCategoryName);

    // if (!offsetElementList.empty) {
    //   const userGroupCategory = offsetElementList.results && offsetElementList.results[0];
    //
    //   if (userGroupCategory.id !== userGroupCategoryId) {
    //     alert(AlertModel.getOverlapAlert(`"UserGroup Category Name"`));
    //     return;
    //   }
    // }

    userGroupCategoryService.changeUserGroupCategoryQueryProp('name', userGroupCategoryName);

    // 수정, 추가 구분
    if (userGroupCategoryId) {
      // 수정
      await userGroupCategoryService.modifyUserGroupCategory(
        userGroupCategoryId,
        UserGroupCategoryQueryModel.asNameValues(userGroupCategoryService.userGroupCategoryQuery)
      );

      await this.saveUserGroupCategory(userGroupCategoryId);
    }
    // 추가
    else {
      const responseId = await userGroupCategoryService.registerUserGroupCategory(
        userGroupCategoryService.userGroupCategoryQuery
      );

      await this.saveUserGroupCategory(responseId);
    }
  }

  async saveUserGroupCategory(userGroupCategoryId: string) {
    //
    const { userGroupCategoryService } = this.injected;

    userGroupCategoryService.clearUserGroupCategoryQuery();
    alert(AlertModel.getSaveSuccessAlert(() => this.routeToGroupCategoryDetail(userGroupCategoryId)));
  }

  async onClickRemoveGroupCategory() {
    const { userGroupCategoryService } = this.injected;
    const { removeUserGroupCategory } = userGroupCategoryService;
    const groupCategoryId = this.props.match.params.userGroupCategoryId || '';

    await removeUserGroupCategory(UserGroupCategoryQueryModel.asIdValues(groupCategoryId));
    this.routeToGroupCategoryList();
  }

  onClickModifiedCancel() {
    this.props.history.goBack();
  }

  render() {
    //
    const { userGroupCategoryQuery } = this.injected.userGroupCategoryService;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.userGroupCategory} />

        <Polyglot languages={userGroupCategoryQuery.langSupports}>
          <UserGroupCategoryCreateView
            userGroupCategoryName={this.state.userGroupCategoryName}
            setGroupCategoryName={(name: string, value: PolyglotModel) =>
              this.setState({ userGroupCategoryName: value })
            }
          />

          <SubActions form>
            {this.props.match.params.userGroupCategoryId && (
              <SubActions.Left>
                <Button onClick={this.onClickModifiedCancel} type="button">
                  취소
                </Button>
              </SubActions.Left>
            )}
            <SubActions.Right>
              <Button basic onClick={this.routeToGroupCategoryList} type="button">
                목록
              </Button>
              <Button primary onClick={this.onClickRegisterGroupCategory} type="button">
                저장
              </Button>
            </SubActions.Right>
          </SubActions>
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(UserGroupCategoryCreateContainer);
