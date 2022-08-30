import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Container } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, PolyglotModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { PageTitle, SubActions, alert, AlertModel, Polyglot } from 'shared/components';
import { isPolyglotEmpty } from 'shared/components/Polyglot';

import { UserGroupCategoryService } from '../../../index';
import { UserGroupService } from '../../../index';
import UserGroupCreateView from '../view/UserGroupCreateView';
import { UserGroupQueryModel } from '../../model';

interface Props extends RouteComponentProps<Param> {}

interface Param {
  cineroomId: string;
  userGroupId?: string;
}

interface States {
  userGroupName: PolyglotModel;
  userGroupCategoryId: string;
}

interface Injected {
  userGroupService: UserGroupService;
  userGroupCategoryService: UserGroupCategoryService;
  sharedService: SharedService;
}

@inject('userGroupService', 'userGroupCategoryService', 'sharedService')
@observer
@reactAutobind
class UserGroupCreateContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      userGroupName: new PolyglotModel(),
      userGroupCategoryId: '',
    };
  }

  componentDidMount() {
    //
    this.init();
  }

  async init() {
    //
    const { userGroupCategoryService } = this.injected;

    await this.findUserGroup();

    if (userGroupCategoryService.userGroupCategoryList.length === 0) {
      alert(
        AlertModel.getCustomAlert(
          true,
          '사용자 그룹 분류 없음',
          '사용자 그룹 분류가 없습니다. 사용자 그룹 분류를 먼저 추가해주세요.',
          '확인',
          () => {
            this.props.history.goBack();
          }
        )
      );
    }
  }

  async findUserGroup() {
    //
    const { userGroupService, userGroupCategoryService } = this.injected;

    if (this.props.match.params.userGroupId) {
      await userGroupService.findUserGroupById(this.props.match.params.userGroupId);

      await this.setState({
        userGroupName: userGroupService.userGroup.name,
        userGroupCategoryId: userGroupService.userGroup.categoryId,
      });
    }
    await userGroupCategoryService.findAllCineroomUserGroupCategoriesEnabled(true);
  }

  routeToUserGroupList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup/user-group-list`
    );
  }

  routeToUserGroupDetail(userGroupId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/usergroup/user-group-detail/${userGroupId}`
    );
  }

  async onClickRegisterUserGroup() {
    //
    const { userGroupService } = this.injected;
    const { userGroupName, userGroupCategoryId } = this.state;
    const userGroupId = this.props.match.params.userGroupId;

    const { userGroup } = userGroupService;

    // 유효성 검사
    if (isPolyglotEmpty(userGroupName)) {
      alert(AlertModel.getRequiredInputAlert(`"사용자 그룹명"`));
      return;
    }

    if (userGroupCategoryId === '') {
      alert(AlertModel.getRequiredChoiceAlert(`"사용자 그룹 분류"`));
      return;
    }

    if (userGroupId && userGroup.name === userGroupName && userGroup.categoryId === userGroupCategoryId) {
      this.saveUsrGroup(userGroupId);
      return;
    }

    // TODO 사용자 그룹 명 중복 체크
    // const offsetElementList = await userGroupService.findUserGroupByName(userGroupName);
    //
    // if (!offsetElementList.empty) {
    //   const userGroup = offsetElementList.results && offsetElementList.results[0];
    //
    //   // TODO 이름 + 사용자 그룹 분류 ID로 동일 그룹 분류에 동일 이름이 있는지 확인 추가
    //   if (userGroup.id !== userGroupId) {
    //     alert(AlertModel.getOverlapAlert(`"사용자 그룹명"`));
    //     return;
    //   }
    // }

    userGroupService.changeUserGroupQueryProp('name', userGroupName);
    userGroupService.changeUserGroupQueryProp('categoryId', userGroupCategoryId);

    if (userGroupId) {
      await userGroupService.modifyUserGroup(
        userGroupId,
        UserGroupQueryModel.asNameValues(userGroupService.userGroupQuery)
      );

      await this.saveUsrGroup(userGroupId);
    } else {
      const responseId = await userGroupService.registerUserGroup(userGroupService.userGroupQuery);

      await this.saveUsrGroup(responseId);
    }
  }

  saveUsrGroup(userGroupId: string) {
    //
    const { userGroupService } = this.injected;

    userGroupService.clearUserGroupQuery();
    alert(AlertModel.getSaveSuccessAlert(() => this.routeToUserGroupDetail(userGroupId)));
  }

  onClickModifiedCancel() {
    this.props.history.goBack();
  }

  render() {
    //
    const { userGroupCategoryService, userGroupService } = this.injected;
    const { userGroupName, userGroupCategoryId } = this.state;
    const { userGroupQuery } = userGroupService;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.userGroup} />

        <Polyglot languages={userGroupQuery.langSupports}>
          <UserGroupCreateView
            userGroupName={userGroupName}
            setUserGroupName={(name: string, value: PolyglotModel) => this.setState({ userGroupName: value })}
            userGroupCategoryId={userGroupCategoryId}
            setRadioGroupCategoryId={(id: string) => this.setState({ userGroupCategoryId: id })}
            userGroupCategoryList={userGroupCategoryService.userGroupCategoryList}
          />

          <SubActions form>
            {this.props.match.params.userGroupId && (
              <SubActions.Left>
                <Button onClick={this.onClickModifiedCancel} type="button">
                  취소
                </Button>
              </SubActions.Left>
            )}
            <SubActions.Right>
              <Button basic onClick={this.routeToUserGroupList} type="button">
                목록
              </Button>
              <Button primary onClick={this.onClickRegisterUserGroup} type="button">
                저장
              </Button>
            </SubActions.Right>
          </SubActions>
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(UserGroupCreateContainer);
