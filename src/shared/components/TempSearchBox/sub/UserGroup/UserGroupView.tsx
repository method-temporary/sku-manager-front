import React from 'react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { GroupBasedAccessRule, UserGroupRuleModel } from '../../../../model';
import { AccessRuleService } from '../../../../present';

import { TempSearchBox } from '../../../index';
import { UserGroupSelectModal } from '../../../UserGroupSelect';
import TempSearchBoxService from '../../logic/TempSearchBoxService';

interface Props {
  fieldName: string;
  onSaveAccessRule?: (accessRules: UserGroupRuleModel[]) => void;
  clearAccessRule?: () => void;
  onChange?: (value: number[]) => void;
}

interface State {
  ruleStrings: string;
}

interface Injected {
  tempSearchBoxService: TempSearchBoxService;
  accessRuleService: AccessRuleService;
}

@inject('tempSearchBoxService', 'accessRuleService')
@reactAutobind
class UserGroupView extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    ruleStrings: '',
  };

  onSaveAccessRule(accessRoles: UserGroupRuleModel[]) {
    //
    const { fieldName, onSaveAccessRule, onChange } = this.props;
    const { accessRuleService, tempSearchBoxService } = this.injected;

    if (onSaveAccessRule) {
      onSaveAccessRule(accessRoles);
      return;
    }

    const accessRuleList = accessRoles.map((accessRole) => accessRole.seq);

    this.setState({ ruleStrings: GroupBasedAccessRule.getRuleValueString(accessRoles) });

    accessRuleService.clearGroupBasedAccessRule();
    accessRuleService.changeGroupBasedAccessRuleProp(
      `groupAccessRoles[${accessRuleService.groupBasedAccessRule.accessRules.length}].accessRoles`,
      accessRuleService.accessRules
    );

    const groupSequences = [...accessRuleList.map((sequence) => sequence)];

    tempSearchBoxService.setIsSearch(false);
    onChange ? onChange(groupSequences) : tempSearchBoxService.changePropsFn(fieldName, groupSequences);
  }

  clearGroupBasedAccessRule() {
    //
    const { fieldName, clearAccessRule, onChange } = this.props;
    const { tempSearchBoxService, accessRuleService } = this.injected;
    const { clearGroupBasedAccessRule } = accessRuleService;
    const { changePropsFn } = tempSearchBoxService;

    if (clearAccessRule) {
      clearAccessRule();
      return;
    }

    onChange && onChange([]);
    clearGroupBasedAccessRule();
    changePropsFn(fieldName, []);
    this.setState({ ruleStrings: '' });
  }

  render() {
    //
    const { ruleStrings } = this.state;

    return (
      <TempSearchBox.Group name="????????? ??????">
        <div className="field">
          <UserGroupSelectModal
            multiple
            onConfirm={this.onSaveAccessRule}
            button="??????"
            title="????????? ?????? ??????"
            description="????????? ????????? ??????????????????."
          />
        </div>
        <TempSearchBox.Input
          value={ruleStrings}
          fieldName=""
          width={6}
          readOnly
          placeholder="????????? ????????? ???????????????."
        />
        <TempSearchBox.FieldButton onClick={this.clearGroupBasedAccessRule}>?????? ??????</TempSearchBox.FieldButton>
      </TempSearchBox.Group>
    );
  }
}

export default UserGroupView;
