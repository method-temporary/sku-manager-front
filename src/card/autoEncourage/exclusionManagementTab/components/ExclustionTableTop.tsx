import React from 'react';
import { DropdownProps, Grid, Select } from 'semantic-ui-react';
import {
  useFindAutoEncourageExcludedStudent,
  useRegisterAutoEncourageExcludeStudent,
} from '../exclusionManagementTab.hooks';
import ExclusionManagementTabStore from '../exclusionManagementTab.store';
import { MemberViewModel } from '@nara.drama/approval';
import ManagerListModalView from '../../../../cube/cube/ui/view/ManagerListModal';
import { ExclusionExcelModal } from './ExclusionExcelModal';
import AutoEncourageStore from 'card/autoEncourage/autoEncourage.store';

const LIMIT_OPTIONS = [
  { key: '1', text: '20개씩 보기', value: 20 },
  { key: '2', text: '50개씩 보기', value: 50 },
  { key: '3', text: '100개씩 보기', value: 100 },
];

export const ExclusionTableTop = () => {
  const { limit, autoEncourageExcludedStudentParams, setLimit } = ExclusionManagementTabStore.instance;

  const { data: excludeStudent } = useFindAutoEncourageExcludedStudent(autoEncourageExcludedStudentParams);
  const { mutate: registerExclusionStudentMutate } = useRegisterAutoEncourageExcludeStudent();

  const onChangeLimit = (_: React.SyntheticEvent, data: DropdownProps) => {
    setLimit(data.value as number);
  };

  const onRegisterExcludeStudent = (member: MemberViewModel) => {
    const cardId = AutoEncourageStore.instance.cardId;
    const emailFormat = member.email;

    registerExclusionStudentMutate({ cardId, emailFormat });
  };

  return (
    <Grid className="list-info">
      <Grid.Row
        style={{
          padding: '10px 0 0 0',
          justifyContent: 'end',
        }}
      ></Grid.Row>
      <Grid.Row>
        <Grid.Column width={3}>
          <span>{`자동독려 제외대상 전체 ${excludeStudent?.totalCount || 0}명`}</span>
        </Grid.Column>
        <Grid.Column style={{ width: '80%' }}>
          <div className="fl-right">
            <Select
              className="ui small-border dropdown m0"
              value={limit}
              control={Select}
              options={LIMIT_OPTIONS}
              onChange={onChangeLimit}
            />
            <ExclusionExcelModal />
            <ManagerListModalView handleOk={onRegisterExcludeStudent} buttonName="제외대상 추가" multiSelect={false} />
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
