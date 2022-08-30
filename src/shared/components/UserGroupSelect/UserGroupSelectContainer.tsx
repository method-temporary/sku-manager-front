import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { inject, observer } from 'mobx-react';

import { Checkbox, Form, Icon, List, Radio, Segment } from 'semantic-ui-react';
import { UserGroupCategoryService, UserGroupService } from '../../../usergroup';
import AccessRuleService from '../../present/logic/AccessRuleService';
import UserGroupRuleModel from '../../model/UserGroupRuleModel';
import { SettingsTable, SelectSection, SelectedItem } from './UserGroupSelectViews';
import { UserGroupModel } from '../../../usergroup/group/model';
import { UserGroupSelectService } from './index';
import { getPolyglotToAnyString } from '../Polyglot/logic/PolyglotLogic';

interface Props {
  readonly?: boolean;
  onChange: (selectedRules: UserGroupRuleModel[]) => void;
  multiple?: boolean;
  renderTable?: (selectedCount: number, children: React.ReactNode) => React.ReactElement;
  cineroomId?: string;
  companyCode?: string;
}

interface Injected {
  userGroupCategoryService: UserGroupCategoryService;
  userGroupService: UserGroupService;
  accessRuleService: AccessRuleService;
  userGroupSelectService: UserGroupSelectService;
}

@inject('userGroupCategoryService', 'userGroupService', 'accessRuleService', 'userGroupSelectService')
@observer
@reactAutobind
class UserGroupSelectContainer extends ReactComponent<Props, {}, Injected> {
  //
  componentDidMount() {
    //
    this.init();
  }

  componentDidUpdate(prevProps: Props) {
    //
    if (prevProps.cineroomId !== this.props.cineroomId || prevProps.companyCode !== this.props.companyCode) {
      this.init();
    }
  }

  async init() {
    //
    const { userGroupCategoryService, userGroupSelectService } = this.injected;
    const { cineroomId, companyCode } = this.props;

    userGroupSelectService.clearSelectedCategoryId();
    userGroupSelectService.clearSelectedCategoryName();

    if (cineroomId) {
      await userGroupCategoryService.findUserGroupCategoriesWithUserGroupsByUserWorkspaceId(cineroomId);
    } else if (companyCode) {
      await userGroupCategoryService.findUserGroupCategoriesWithUserGroupsByUserWorkspaceUsid(companyCode);
    } else {
      await userGroupCategoryService.findAllUserGroupCategory();
    }
  }

  async onClickUserGroupCategory(id: string, name: string) {
    //

    const { userGroupService, userGroupSelectService } = this.injected;

    userGroupSelectService.setSelectCategoryId(id);
    userGroupSelectService.setSelectCategoryName(name);

    await userGroupService.findUserGroupByCategoryId(id);
  }

  onChangeUserGroupRadio(userGroup: UserGroupModel) {
    //
    const { onChange } = this.props;
    const { accessRuleService, userGroupSelectService } = this.injected;
    const { accessRules } = accessRuleService;
    const { selectedCategoryId, selectedCategoryName } = userGroupSelectService;

    const filterList = accessRules.filter((access) => access.categoryId !== selectedCategoryId);

    filterList.push(
      new UserGroupRuleModel(
        selectedCategoryId,
        selectedCategoryName,
        userGroup.id,
        getPolyglotToAnyString(userGroup.name),
        userGroup.sequence
      )
    );
    accessRuleService.setAccessRules(filterList);
    onChange(filterList);
  }

  onChangeUserGroupCheckBox(userGroup: UserGroupModel) {
    //
    const { onChange } = this.props;
    const { accessRuleService, userGroupSelectService } = this.injected;
    const { accessRules } = accessRuleService;
    const { selectedCategoryId, selectedCategoryName } = userGroupSelectService;
    const copiedList = [...accessRules];

    if (copiedList.some((access) => access.userGroupId === userGroup.id)) {
      const filterList = copiedList.filter((access: any) => access.userGroupId !== userGroup.id);

      accessRuleService.setAccessRules(filterList);
      onChange(filterList);
    } else {
      copiedList.push(
        new UserGroupRuleModel(
          selectedCategoryId,
          selectedCategoryName,
          userGroup.id,
          getPolyglotToAnyString(userGroup.name),
          userGroup.sequence
        )
      );
      accessRuleService.setAccessRules(copiedList);
      onChange(copiedList);
    }
  }

  onDeleteSelectedAccess(index: number) {
    //
    const { onChange } = this.props;
    const { accessRuleService } = this.injected;
    const { accessRules } = accessRuleService;
    const copiedList = [...accessRules];

    copiedList.splice(index, 1);
    accessRuleService.setAccessRules(copiedList);
    onChange(copiedList);
  }

  setAccessRules(accessRules: UserGroupRuleModel[]): void {
    //
    const { accessRuleService } = this.injected;

    accessRuleService.setAccessRules(accessRules);
  }

  render() {
    //
    const { multiple, renderTable, readonly } = this.props;
    const { selectedCategoryId } = this.injected.userGroupSelectService;
    const { userGroupCategoryList } = this.injected.userGroupCategoryService;
    const { userGroupList } = this.injected.userGroupService;
    const { accessRules } = this.injected.accessRuleService;

    return (
      <SettingsTable selectedCount={accessRules.length} renderTable={renderTable}>
        <SelectSection>
          <List className="toggle-check">
            {userGroupCategoryList ? (
              userGroupCategoryList.map((userGroupCategory, index) => (
                <List.Item
                  disabled={readonly}
                  key={index}
                  className={userGroupCategory.id === selectedCategoryId ? 'active' : ''}
                >
                  <Segment
                    onClick={() =>
                      this.onClickUserGroupCategory(
                        userGroupCategory.id,
                        getPolyglotToAnyString(userGroupCategory.name)
                      )
                    }
                  >
                    {getPolyglotToAnyString(userGroupCategory.name)}
                    <div className="fl-right">
                      <Icon name="check" />
                    </div>
                  </Segment>
                </List.Item>
              ))
            ) : (
              <span>등록된 사용자 그룹 분류가 없습니다.</span>
            )}
          </List>
        </SelectSection>

        <SelectSection>
          {selectedCategoryId &&
            userGroupList &&
            userGroupList.map((userGroup, index) =>
              multiple ? (
                <Form.Field
                  key={index}
                  control={Checkbox}
                  label={getPolyglotToAnyString(userGroup.name)}
                  checked={accessRules.some((access) => access.userGroupId === userGroup.id)}
                  onChange={() => this.onChangeUserGroupCheckBox(userGroup)}
                />
              ) : (
                <Form.Field
                  key={index}
                  control={Radio}
                  label={getPolyglotToAnyString(userGroup.name)}
                  checked={accessRules.some((access) => access.userGroupId === userGroup.id)}
                  onChange={() => this.onChangeUserGroupRadio(userGroup)}
                />
              )
            )}
        </SelectSection>

        <SelectSection>
          {accessRules.map((accessRule, index) => (
            <SelectedItem
              key={index}
              readonly={readonly}
              item={accessRule}
              onClick={() => this.onDeleteSelectedAccess(index)}
            />
          ))}
        </SelectSection>
      </SettingsTable>
    );
  }
}

export default UserGroupSelectContainer;
