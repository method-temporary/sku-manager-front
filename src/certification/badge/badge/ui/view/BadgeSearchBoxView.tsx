import React from 'react';

import { SelectType, UserGroupRuleModel, SelectTypeModel } from 'shared/model';
import { SearchBox, UserGroupSelectModal } from 'shared/components';
import { castToSelectTypeModel, addSelectTypeBoxAllOption } from 'shared/helper';

import { BadgeQueryModel } from '../../model/BadgeQueryModel';

interface Props {
  findBadges: () => void;
  queryModel: BadgeQueryModel;
  changeBadgeQueryProp: (name: string, value: any) => void;
  paginationKey: string;
  userWorkspaceSelect: SelectTypeModel[];
  selectTypeBadgeCategories: SelectTypeModel[];
  onSaveAccessRule: (userGroupRules: UserGroupRuleModel[]) => void;
  onClickCancelUserGroups: () => void;
  modal?: boolean;
  cineroomId: string;
  selectTypeBadgeCategory: (data: string) => void;
}

class BadgeSearchBoxView extends React.Component<Props> {
  //
  render() {
    //
    const {
      findBadges,
      queryModel,
      changeBadgeQueryProp,
      paginationKey,
      userWorkspaceSelect,
      selectTypeBadgeCategories,
      onSaveAccessRule,
      onClickCancelUserGroups,
      modal,
      cineroomId,
      selectTypeBadgeCategory,
    } = this.props;

    return (
      <SearchBox
        onSearch={findBadges}
        changeProps={changeBadgeQueryProp}
        queryModel={queryModel}
        name={paginationKey}
        modal={modal}
      >
        <SearchBox.Group name="등록일자">
          <SearchBox.DatePicker
            startFieldName="period.startDateMoment"
            endFieldName="period.endDateMoment"
            searchButtons
          />
        </SearchBox.Group>
        <SearchBox.Group name="분야">
          <SearchBox.Select placeholder="전체" fieldName="categoryId" options={selectTypeBadgeCategories} />
          <SearchBox.Select
            name="유형"
            placeholder="전체"
            fieldName="type"
            options={castToSelectTypeModel(SelectType.badgeType)}
          />
        </SearchBox.Group>
        <SearchBox.Group name="Level">
          <SearchBox.Select
            placeholder="전체"
            fieldName="level"
            options={castToSelectTypeModel(SelectType.badgeDifficulty)}
          />
          <SearchBox.Select
            name="발급구분"
            placeholder="전체"
            fieldName="issueAutomatically"
            options={castToSelectTypeModel(SelectType.badgeIssueType)}
          />
        </SearchBox.Group>
        <SearchBox.Group name="추가발급 요건">
          <SearchBox.Select
            placeholder="전체"
            fieldName="additionalRequirementsNeeded"
            options={castToSelectTypeModel(SelectType.badgeAdditionTermsType)}
          />
          <SearchBox.Select
            name="공개여부"
            placeholder="전체"
            fieldName="searchable"
            options={castToSelectTypeModel(SelectType.badgeSearchableType)}
          />
        </SearchBox.Group>
        <SearchBox.Query
          name="검색어"
          placeholders={['전체', '검색어를 입력하세요.']}
          options={addSelectTypeBoxAllOption(SelectType.searchPartForBadgeNotAll)}
          searchWordDisabledKey="searchPart"
          searchWordDisabledValues={['', '전체']}
        />
        {!modal && (
          <>
            <SearchBox.Group name="사용처">
              <SearchBox.Select
                placeholder="전체"
                fieldName="cineroomId"
                options={addSelectTypeBoxAllOption(userWorkspaceSelect)}
                onChange={(event, data) => selectTypeBadgeCategory(data.value)}
                disabled={cineroomId !== 'ne1-m2-c2'}
              />
              <SearchBox.Select
                name="Badge 상태"
                placeholder="전체"
                fieldName="state"
                options={castToSelectTypeModel(SelectType.badgeState)}
              />
            </SearchBox.Group>
            <SearchBox.Group name="사용자 그룹">
              <UserGroupSelectModal
                multiple
                onConfirm={onSaveAccessRule}
                button="선택"
                title="사용자 그룹 추가"
                description="사용자 그룹을 선택해주세요."
              />
              <SearchBox.Input width={6} fieldName="ruleStrings" readOnly placeholder="사용자 그룹을 선택하세요." />
              <SearchBox.FieldButton onClick={onClickCancelUserGroups}>선택 취소</SearchBox.FieldButton>
            </SearchBox.Group>
          </>
        )}
      </SearchBox>
    );
  }
}

export default BadgeSearchBoxView;
