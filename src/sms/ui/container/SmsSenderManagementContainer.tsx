import React from 'react';
import { Container, Grid, Select } from 'semantic-ui-react';
import { PageTitle, SubActions } from 'shared/components';
import { SelectType } from 'shared/model';
import { onChangeLimit, onDownloadExcel } from 'sms/event/smsSenderEvent';
import { useRequestSenderList } from 'sms/hooks/useRequestSenderList';
import { useSmsSenderNo } from 'sms/hooks/useSmsSenderNo';
import {
  useSmsSenderListLimit,
  useSmsSenderDisplayListViewModel,
  initSmsSenderListLimit,
} from 'sms/store/SmsSenderStore';
import { SmsSenderListView } from '../view/SmsSenderListView';
import { SmsSenderPaginationContainer } from './SmsSenderPaginationContainer';
import { SmsSenderSearchBoxContainer } from './SmsSenderSearchBoxContainer';

export function SmsSenderManagementContainer() {
  useRequestSenderList();
  const smsList = useSmsSenderDisplayListViewModel();
  const smsListLimit = useSmsSenderListLimit() || initSmsSenderListLimit;
  const smsNo = useSmsSenderNo() || 1;

  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb} />
      <SmsSenderSearchBoxContainer />
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              전체 <strong>{smsList?.totalCount}</strong> 명 승인자 등록
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              {/*<Select
                className="ui small-border dropdown m0"
                control={Select}
                options={SelectType.limit}
                value={smsListLimit}
                onChange={onChangeLimit}
              />*/}
              <SubActions.ExcelButton download onClick={onDownloadExcel} />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <SmsSenderListView smsNo={smsNo} smsList={smsList?.results} />
      <SmsSenderPaginationContainer />
    </Container>
  );
}

const breadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'Mail', content: 'SMS 발신자 관리', active: true },
];
