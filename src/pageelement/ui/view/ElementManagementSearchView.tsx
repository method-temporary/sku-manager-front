import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import * as React from 'react';
import ElementManagementService from '../../present/logic/ElementManagementService';
import { PageElementQueryModel } from '../../model/PageElementQueryModel';
import { SelectType, UserGroupRuleModel, GroupBasedAccessRuleModel } from 'shared/model';
import { UserGroupSelectModal } from 'shared/components';
import { SearchBox } from 'shared/components';

interface Props {
  elementManagementService?: ElementManagementService;
  onChangePageElementQueryProps: (name: string, value: string) => void;
  onClickSearchButton: () => void;
  onSaveAccessRule: (accessRoles: UserGroupRuleModel[]) => void;
  clearGroupBasedAccessRule: () => void;

  pageElementQuery: PageElementQueryModel;
  groupBasedAccessRole: GroupBasedAccessRuleModel;
  paginationKey: string;
}

@observer
@reactAutobind
class ElementManagementSearchView extends ReactComponent<Props> {
  //
  componentDidMount(): void {}

  onChangePosition(event?: any, data?: any) {
    //
    this.props.onChangePageElementQueryProps('position', data.value);
  }

  render() {
    //
    const {
      onChangePageElementQueryProps,
      onClickSearchButton,
      pageElementQuery,
      onSaveAccessRule,
      clearGroupBasedAccessRule,
      paginationKey,
    } = this.props;

    return (
      <SearchBox
        onSearch={onClickSearchButton}
        changeProps={onChangePageElementQueryProps}
        queryModel={pageElementQuery}
        name={paginationKey}
      >
        <SearchBox.Group name="구분">
          <SearchBox.Select
            fieldName="position"
            onChange={this.onChangePosition}
            options={SelectType.pageElementPosition}
            placeholder="Select"
          />
        </SearchBox.Group>
        <SearchBox.Group name="사용자 그룹">
          <div className="field">
            <UserGroupSelectModal
              multiple
              onConfirm={onSaveAccessRule}
              button="선택"
              title="사용자 그룹 추가"
              description="사용자 그룹을 선택해주세요."
            />
          </div>
          <SearchBox.Input width={6} fieldName="ruleStrings" readOnly placeholder="사용자 그룹을 선택하세요." />
          <SearchBox.FieldButton onClick={clearGroupBasedAccessRule}>선택 취소</SearchBox.FieldButton>
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default ElementManagementSearchView;
