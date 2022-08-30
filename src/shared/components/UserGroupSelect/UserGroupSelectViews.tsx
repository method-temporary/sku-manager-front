import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import UserGroupRuleModel from '../../model/UserGroupRuleModel';

interface SettingsTableProps {
  children: React.ReactNode;
  selectedCount: number;
  renderTable?: (selectedCount: number, children: React.ReactNode) => React.ReactElement;
}

export function SettingsTable(props: SettingsTableProps) {
  //
  const { selectedCount, renderTable, children } = props;

  if (typeof renderTable === 'function') {
    return renderTable(selectedCount, children);
  }

  return (
    <div className="channel-change">
      <div className="table-css">
        <div className="row head">
          <div className="cell v-middle">
            <span className="text01">사용자 그룹 분류 </span>
          </div>
          <div className="cell v-middle">
            <span className="text01">사용자 그룹</span>
          </div>
          <div className="cell v-middle">
            <span className="text01">
              선택
              {selectedCount > 0 && (
                <span className="count">
                  <span className="text01 add"> {selectedCount}</span>
                  <span className="text02">개</span>
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="row">{children}</div>
      </div>
    </div>
  );
}

interface SelectSectionProps {
  children: React.ReactNode;
}

export function SelectSection(props: SelectSectionProps) {
  //
  const { children } = props;

  return (
    <div className="cell vtop">
      <div className="select-area">
        <div className="scrolling-60vh">{children}</div>
      </div>
    </div>
  );
}

interface SelectedItem {
  readonly?: boolean;
  item: UserGroupRuleModel;
  onClick: () => void;
}

export function SelectedItem(props: SelectedItem) {
  //
  const { item, onClick, readonly } = props;

  return (
    <span className="select-item">
      <Button className="del no-clickable" disabled={readonly}>
        {item.categoryName} &gt; {item.userGroupName}
        <div className="fl-right clickable" onClick={onClick}>
          <Icon name="times" />
        </div>
      </Button>
    </span>
  );
}
