import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Button, Container } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { GroupAccessRule, SelectType, UserGroupRuleModel, GroupBasedAccessRuleModel } from 'shared/model';
import { AccessRuleService } from 'shared/present';
import { AccessRuleSettings, PageTitle, SubActions, alert, AlertModel } from 'shared/components';

import { PageElementType } from '_data/arrange/pageElements/model/vo';

import { displayManagementUrl } from '../../../Routes';
import { UserGroupService } from '../../../usergroup';
import { getPageElementNameValues } from '../../shared/util';
import { ElementManagementService } from '../../index';
import ElementManagementCreateBasicInfoView from '../view/ElementManagementCreateBasicInfoView';

interface Props extends RouteComponentProps<Params> {}

interface Injected {
  elementManagementService: ElementManagementService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
}
interface Params {
  cineroomId: string;
  pageElementId: string;
}

interface States {
  isUpdatable: boolean;
}

@inject('elementManagementService', 'accessRuleService', 'userGroupService')
@observer
@reactAutobind
class CreateElementManagementContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      isUpdatable: false,
    };
  }

  async componentDidMount() {
    const { pageElementId } = this.props.match.params;

    if (pageElementId) {
      // pageElementId값이 있으면 상세보기 페이지로 이동, 없으면 생성화면이기 때문에 있다면 데이터 조회
      await this.findPageElementById(pageElementId);
      await this.findGroupBasedAccessRules();
    } else {
      this.setState({ isUpdatable: true });
    }
  }

  async findPageElementById(pageElementId: string) {
    //
    const { elementManagementService } = this.injected;
    elementManagementService.clearPageElement();
    await elementManagementService.findPageElementById(pageElementId);
  }

  async findGroupBasedAccessRules(): Promise<void> {
    //
    const { elementManagementService, accessRuleService, userGroupService } = this.injected;
    await userGroupService.findUserGroupMap();

    const accessRules: GroupAccessRule[] = elementManagementService.pageElement.groupBasedAccessRule.accessRules.map(
      (accessRule): GroupAccessRule => {
        return new GroupAccessRule(
          accessRule.groupSequences
            .map((groupSequence): UserGroupRuleModel => {
              const userGroup = userGroupService.userGroupMap.get(groupSequence);
              return new UserGroupRuleModel(
                userGroup?.categoryId,
                userGroup?.categoryName,
                userGroup?.userGroupId,
                userGroup?.userGroupName,
                userGroup?.seq
              );
            })
            .filter((userGroupRuleModel) => userGroupRuleModel.categoryId !== '')
        );
      }
    );
    const groupBasedAccessRuleModel = new GroupBasedAccessRuleModel();

    groupBasedAccessRuleModel.useWhitelistPolicy =
      elementManagementService.pageElement.groupBasedAccessRule.useWhitelistPolicy;
    groupBasedAccessRuleModel.accessRules = accessRules;

    accessRuleService.setGroupBasedAccessRule(groupBasedAccessRuleModel);
  }

  init() {}

  onChangePostQueryProps(name: string, value: string): void {
    // selectbox 선택
    const { elementManagementService } = this.injected;
    elementManagementService.changePageElementProps(name, value);
    if (name === 'position') {
      // console.log(name);
      elementManagementService.changePageElementProps('type', '');
    }
  }

  onChangePageElementProps(name: string, value: string | any | {} | []): void {
    // pageElement property 입력이벤트 관련 로직
    const { elementManagementService } = this.injected;
    elementManagementService.changePageElementProps(name, value);
  }

  clearAccessRule(): void {
    // AccessRule 초기화 (빈 객체로)
    const { elementManagementService } = this.injected;

    elementManagementService.clearAccessRule();
  }

  onInputChange(name: string, value: any): void {
    // input 관련 내용 처리 함수
    const { elementManagementService } = this.injected;
    elementManagementService.changePageElementProps(name, value);
  }

  async onSavePageElement(): Promise<void> {
    // 화면에 결졍된 PageElement(화면요소) 데이터를 서버로 저장
    const { elementManagementService, accessRuleService } = this.injected;
    const { pageElement } = elementManagementService;
    const { pageElementId } = this.props.match.params;

    elementManagementService.changePageElementProps('creator', this.props.match.params.cineroomId);

    elementManagementService.changePageElementProps(
      'groupBasedAccessRule',
      GroupBasedAccessRuleModel.asGroupBasedAccessRule(accessRuleService.groupBasedAccessRule)
    );
    if (this.pageElementValidationCheck()) {
      if (pageElementId) {
        await elementManagementService.modifyPageElement(pageElement.id, getPageElementNameValues(pageElement));
      } else {
        await elementManagementService.registerPageElement(pageElement);
      }
      elementManagementService.clearPageElement();

      alert(AlertModel.getSaveSuccessAlert());
      this.routeToListPage();
    }
  }

  pageElementValidationCheck(): boolean {
    //
    const { pageElement } = this.injected.elementManagementService;
    let validation = false;

    // position validation
    if (pageElement.position != null) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredInputAlert('구분'));
      return validation;
    }

    // type validation
    if (pageElement.type != null && pageElement.type !== PageElementType.Default) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredInputAlert('타입'));
      return validation;
    }

    if (pageElement.groupBasedAccessRule.accessRules.length > 0) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('접근제어 정보 규칙'));
      return validation;
    }
    return validation;
  }

  routeToListPage(): void {
    // pageElement 리스트 페이지로 이동
    const { elementManagementService } = this.injected;

    elementManagementService.clearPageElements();
    elementManagementService.clearPageElement();

    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/pageElement/pageElement-list`
    );
  }

  setAccessRuleValues(accessRules: UserGroupRuleModel[]): void {
    //
    const { elementManagementService } = this.injected;
    elementManagementService.setAccessRules(accessRules);
  }

  changeModifyMode(val: boolean) {
    this.setState({ isUpdatable: val });
    if (!val) {
      this.findPageElementById(this.props.match.params.pageElementId);
      this.findGroupBasedAccessRules();
    }
  }

  render() {
    //
    const { pageElement } = this.injected.elementManagementService;
    const { pageElementId } = this.props.match.params;
    const { isUpdatable } = this.state;

    return (
      <Container fluid>
        <div>
          <PageTitle breadcrumb={SelectType.pageElementManagement} />
        </div>
        <SubActions form>
          <ElementManagementCreateBasicInfoView
            onChangePostQueryProps={this.onChangePostQueryProps}
            pageElement={pageElement}
            isUpdatable={false}
          />
          <AccessRuleSettings readOnly={!isUpdatable} ruleOnly={true} multiple={false} />
          <SubActions.Left>
            {(pageElementId &&
              ((!isUpdatable && <Button onClick={() => this.changeModifyMode(true)}> 수정 </Button>) || (
                <Button onClick={() => this.changeModifyMode(false)}> 취소 </Button>
              ))) ||
              null}
          </SubActions.Left>

          <SubActions.Right>
            <Button basic onClick={this.routeToListPage}>
              목록
            </Button>
            <Button primary disabled={!isUpdatable} onClick={this.onSavePageElement}>
              저장
            </Button>
          </SubActions.Right>
        </SubActions>
      </Container>
    );
  }
}

export default withRouter(CreateElementManagementContainer);
