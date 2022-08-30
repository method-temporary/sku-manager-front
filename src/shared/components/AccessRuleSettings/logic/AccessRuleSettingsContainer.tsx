import React, { SyntheticEvent } from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer, inject } from 'mobx-react';

import { Form, Icon, Radio, RadioProps } from 'semantic-ui-react';
import { UserGroupCategoryService, UserGroupService } from '../../../../usergroup';
import AccessRuleService from '../../../present/logic/AccessRuleService';
import FormTable from '../../FormTable';
import RadioGroup from '../../RadioGroup';
import SubActions from '../../SubActions';
import { UserGroupRuleModel, GroupBasedAccessRuleModel } from '../../../model';
import { UserGroupSelectModal } from '../../UserGroupSelect';
import AccessRulesTableView from '../view/AccessRulesTableView';
import { confirm, ConfirmModel } from '../../AlertConfirm';

interface Props {
  readOnly?: boolean;
  ruleOnly?: boolean;
  defaultGroupBasedAccessRule?: GroupBasedAccessRuleModel;
  onChange?: (groupBasedAccessRule: GroupBasedAccessRuleModel) => void;
  multiple?: boolean;
  inModal?: boolean;
  form?: boolean;
}

interface State {
  open: boolean;
  updateIndex: number;
  accessType: string;
  userGroupCategoryId: string;
  userGroupCategoryName: string;
  selectedList: UserGroupRuleModel[];
}

interface Injected {
  userGroupCategoryService: UserGroupCategoryService;
  userGroupService: UserGroupService;
  accessRuleService: AccessRuleService;
}

@inject('userGroupCategoryService', 'userGroupService', 'accessRuleService')
@observer
@reactAutobind
class AccessRuleSettingsContainer extends ReactComponent<Props, State, Injected> {
  //
  static defaultProps = {
    readOnly: false,
    defaultGroupBasedAccessRule: undefined,
    onChange: () => {},
  };

  state: State = {
    open: false,
    updateIndex: -1,
    accessType: 'White',
    userGroupCategoryId: '',
    userGroupCategoryName: '',
    selectedList: Array<UserGroupRuleModel>(),
  };

  constructor(props: Props) {
    //
    super(props);

    this.injected.accessRuleService.clearGroupBasedAccessRule();
    if (props.defaultGroupBasedAccessRule) {
      this.injected.accessRuleService.setGroupBasedAccessRule(props.defaultGroupBasedAccessRule);
    }
  }

  componentDidMount() {
    //
    this.init();
  }

  async init() {
    //
    const { userGroupCategoryService } = this.injected;

    await userGroupCategoryService.findAllUserGroupCategory();
    await this.defaultUserGroupInitialize();
  }

  async defaultUserGroupInitialize() {
    //
    const { userGroupService, accessRuleService } = this.injected;
    await userGroupService.findUserGroupMap();

    if (this.injected.accessRuleService.groupBasedAccessRule.accessRules.length === 0) {
      const t = userGroupService.userGroupMap.get(0);
      const defaultUserGroup: UserGroupRuleModel = new UserGroupRuleModel(
        t?.categoryId,
        t?.categoryName,
        t?.userGroupId,
        t?.userGroupName,
        t?.seq
      );

      accessRuleService.changeGroupBasedAccessRuleProp(
        `accessRules[${accessRuleService.groupBasedAccessRule.accessRules.length}].groupRules[0]`,
        defaultUserGroup
      );
    }
  }

  initialModifyAccessRuleValues(index: number): void {
    //
    const { accessRuleService } = this.injected;

    accessRuleService.setAccessRules(accessRuleService.groupBasedAccessRule.accessRules[index].groupRules);
  }

  onClickUpdateAccess(arrayList: any[], index: number) {
    //
    this.setState({ selectedList: arrayList, open: true, updateIndex: index });
  }

  onClickDeleteAccess(index: number) {
    //
    const { accessRuleService } = this.injected;
    //
    confirm(
      ConfirmModel.getRemoveConfirm(() => {
        accessRuleService.removeAccessRuleInGroupBasedAccessRule(index);
        this.propsWithDefault.onChange(accessRuleService.groupBasedAccessRule);
      })
    );
  }

  onChangeGroupBasedAccessRoleProps(name: string, value: any) {
    //
    const { accessRuleService } = this.injected;

    accessRuleService.changeGroupBasedAccessRuleProp(name, value);
    this.propsWithDefault.onChange(accessRuleService.groupBasedAccessRule);
  }

  onChangeUseWhitelistPolicy(e: SyntheticEvent<HTMLInputElement>, data: RadioProps) {
    //
    this.onChangeGroupBasedAccessRoleProps('useWhitelistPolicy', data.value === 'White');
  }

  onConfirmUserGroupSelectModal() {
    //
    const { accessRuleService } = this.injected;

    if (
      accessRuleService.groupBasedAccessRule.accessRules.some(
        (accessRule) => JSON.stringify(accessRuleService.accessRules) === JSON.stringify(accessRule.groupRules)
      )
    ) {
      return;
    }

    accessRuleService.changeGroupBasedAccessRuleProp(
      `accessRules[${accessRuleService.groupBasedAccessRule.accessRules.length}].groupRules`,
      accessRuleService.accessRules
    );

    this.propsWithDefault.onChange(accessRuleService.groupBasedAccessRule);
  }

  onModifyAccessRule(index: number) {
    //
    const { accessRuleService } = this.injected;

    // accessRoleService.removeAccessRoleInGroupBasedAccessRole(index-1);
    accessRuleService.modifyAccessRuleInGroupBasedAccessRule(index, accessRuleService.accessRules);
    this.propsWithDefault.onChange(accessRuleService.groupBasedAccessRule);
  }

  render() {
    //
    const { readOnly, multiple, ruleOnly, inModal, form = true } = this.props;
    const { groupBasedAccessRule } = this.injected.accessRuleService;

    return (
      <div className={form ? 'ui form' : ''}>
        <FormTable title="접근 제어 정보">
          <FormTable.Row name="기본 정책" required>
            <Form.Group inline>
              <RadioGroup
                as={Form.Field}
                control={Radio}
                disabled={readOnly || ruleOnly}
                values={['White', 'Black']}
                labels={['Whitelist', 'Blacklist']}
                value={groupBasedAccessRule && groupBasedAccessRule.useWhitelistPolicy ? 'White' : 'Black'}
                onChange={this.onChangeUseWhitelistPolicy}
              />
            </Form.Group>
          </FormTable.Row>

          <FormTable.Row name="규칙" required>
            <SubActions>
              <SubActions.Right>
                <UserGroupSelectModal
                  multiple={multiple}
                  onConfirm={this.onConfirmUserGroupSelectModal}
                  modSuper={readOnly}
                  button={
                    <>
                      <Icon name="plus" />
                      규칙 추가
                    </>
                  }
                />
              </SubActions.Right>
            </SubActions>

            <AccessRulesTableView
              modSuper={readOnly}
              groupBasedAccessRole={groupBasedAccessRule}
              initialModifyAccessRoleValues={this.initialModifyAccessRuleValues}
              onClickUpdateAccess={this.onClickUpdateAccess}
              onClickDeleteAccess={this.onClickDeleteAccess}
              onModifyAccessRule={this.onModifyAccessRule}
              inModal={inModal}
            />
          </FormTable.Row>
        </FormTable>
      </div>
    );
  }
}

export default AccessRuleSettingsContainer;
