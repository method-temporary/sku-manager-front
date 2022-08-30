import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Select } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { FormTable, SubActions } from 'shared/components';
import { SelectTypeModel } from 'shared/model';

interface Props {
  onChangeSelectedUserWorkspaceId: (id: string) => void;
  findMembershipStatistics: (id?: string) => Promise<void>;
  onChangeSelectedYear: (id: string) => void;
  workspaceOptions: SelectTypeModel[];
  selectedUserWorkspaceId: string;
  year: string;
  years: SelectTypeModel[];
}

interface States {}

@observer
@reactAutobind
class StatisticsByUserWorkspaceSelectView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { onChangeSelectedUserWorkspaceId, onChangeSelectedYear, findMembershipStatistics } = this.props;
    const { workspaceOptions, selectedUserWorkspaceId, year, years } = this.props;

    return (
      <FormTable title="사용자 조직 선택">
        <FormTable.Row name="사용자 조직">
          <SubActions>
            <SubActions.Left>
              <Select
                className="small-border m0 sub-actions"
                options={years}
                value={year}
                onChange={(event: any, data: any) => onChangeSelectedYear(data.value)}
              />
              <Select
                className="small-border m0 sub-actions"
                options={workspaceOptions}
                placeholder="선택해주세요"
                value={selectedUserWorkspaceId}
                onChange={(event: any, data: any) => onChangeSelectedUserWorkspaceId(data.value)}
                disabled={workspaceOptions.length === 1}
              />
              <Button style={{ marginLeft: 10 }} onClick={() => findMembershipStatistics(selectedUserWorkspaceId)}>
                불러오기
              </Button>
            </SubActions.Left>
          </SubActions>
        </FormTable.Row>
      </FormTable>
    );
  }
}
export default StatisticsByUserWorkspaceSelectView;
