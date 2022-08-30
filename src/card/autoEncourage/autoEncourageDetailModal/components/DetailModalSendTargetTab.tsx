import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useQueryClient } from 'react-query';
import { Grid, Pagination, PaginationProps, Table } from 'semantic-ui-react';
import ExcelButton from 'shared/components/SubActions/sub/ExcelButton';
import {
  useFindFailedSmsRsltRdoByEventIdsMutate,
  useFindUsersByDenizenIdsMutate,
} from '../autoEncourageDetailModal.hook';
import { CardService } from 'card';
import HistoryTabStore from 'card/autoEncourage/historyTab/historyTab.store';
import { useFindAutoEncourageById } from 'card/autoEncourage/autoEncourageFormModal/autoEncourageFormModal.hooks';
import XLSX from 'xlsx';
import { getItemNo } from 'shared/helper/getItemNo';
import { isEmpty } from 'lodash';

export const DetailModalSendTargetTab = React.memo(
  observer(() => {
    const {
      historyTabState: { autoEncourageId },
    } = HistoryTabStore.instance;
    const { data: autoEncourageData } = useFindAutoEncourageById(autoEncourageId);

    const { mutate: findUsersMutate, data: usersData } = useFindUsersByDenizenIdsMutate();
    const { mutate: findFailedSmsResultMutate, data: smsResultData } = useFindFailedSmsRsltRdoByEventIdsMutate();

    const [offset, setOffset] = useState(0);
    const [userPage, setUserPage] = useState((usersData || []).slice(0, 10));

    useEffect(() => {
      if (usersData) {
        setUserPage((usersData || []).slice(0, 10));
      }
    }, [usersData, setUserPage]);

    useEffect(() => {
      if (autoEncourageData?.targetUsers) {
        findUsersMutate(autoEncourageData.targetUsers);
      }
      if (autoEncourageData?.deliveryEvent?.smsEventIds) {
        findFailedSmsResultMutate(autoEncourageData.deliveryEvent.smsEventIds);
      }
    }, [autoEncourageData, findUsersMutate, findFailedSmsResultMutate]);

    const onDownLoadExcel = useCallback(async () => {
      const wbList: any[] = [];

      if (usersData) {
        usersData.reverse().forEach((target, i) => {
          wbList.push({
            No: i + 1,
            소속사: target.companyName.ko,
            '소속 조직(팀)': target.departmentName.ko,
            성명: target.name.ko,
            'E-mail': target.email,
            '메일 발송 결과': autoEncourageData?.deliveryEvent?.emailEventIds ? 'Y' : '-',
            'SMS 발송결과': smsResultData?.some((sms) => sms.denizenId === target.id) ? 'N' : 'Y',
          });
        });

        const sendTargetExcel = XLSX.utils.json_to_sheet(wbList);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, sendTargetExcel, '발송대상 관리');
        const cardName = CardService.instance.cardQuery.name.ko;
        const fileName = `[${cardName}] 발송대상 관리.xlsx`;
        XLSX.writeFile(wb, fileName, { compression: true });
      }
    }, [usersData, smsResultData, autoEncourageData]);

    const onChangeOffset = (_: React.MouseEvent, data: PaginationProps) => {
      const activePage = data.activePage as number;
      setOffset(activePage - 1);

      if (usersData) {
        const startNumber = (activePage - 1) * 10;
        const lastNumber = activePage * 10;

        setUserPage(usersData.slice(startNumber, lastNumber));
      }
    };

    const totalpages = Math.ceil((usersData?.length || 0) / 10);

    const sentEmailResult = useMemo(() => {
      if (autoEncourageData?.deliveryEvent?.emailEventIds) {
        return 'Y';
      }

      return '-';
    }, [autoEncourageData]);

    const getSmsSendResult = useCallback(
      (id: string) => {
        if (!isEmpty(autoEncourageData?.deliveryEvent?.smsEventIds)) {
          if (smsResultData?.some((sms) => sms.denizenId === id)) {
            return 'N';
          } else {
            return 'Y';
          }
        }

        return '-';
      },
      [autoEncourageData, smsResultData]
    );

    return (
      <div style={{ marginTop: '10px' }}>
        <p
          style={{
            textAlign: 'left',
            display: 'inline-block',
            padding: 0,
            background: '#E1083130',
            color: '#E10831',
            fontWeight: 'bold',
          }}
        >
          메일 발송 결과의 경우 상세 실패 내역에 대해 확인이 불가합니다.
        </p>
        <span className="fl-right" style={{ marginBottom: '10px' }}>
          <ExcelButton download onClick={onDownLoadExcel}>
            엑셀 다운로드
          </ExcelButton>
        </span>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>소속사</Table.HeaderCell>
              <Table.HeaderCell>소속 조직(팀)</Table.HeaderCell>
              <Table.HeaderCell>성명</Table.HeaderCell>
              <Table.HeaderCell>E-mail</Table.HeaderCell>
              <Table.HeaderCell>메일 발송 결과</Table.HeaderCell>
              <Table.HeaderCell>SMS 발송 결과</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {userPage.map((target, index) => (
              <Table.Row key={target.id}>
                <Table.Cell>{getItemNo(usersData?.length || 0, offset * 10, index, userPage.length)}</Table.Cell>
                <Table.Cell>{target.companyName.ko}</Table.Cell>
                <Table.Cell>{target.departmentName.ko}</Table.Cell>
                <Table.Cell>{target.name.ko}</Table.Cell>
                <Table.Cell>{target.email}</Table.Cell>
                <Table.Cell>{sentEmailResult}</Table.Cell>
                <Table.Cell>{getSmsSendResult(target.id)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Grid>
          <Grid.Column style={{ textAlign: 'center' }}>
            <Pagination totalPages={totalpages} activePage={offset + 1} onPageChange={onChangeOffset} />
          </Grid.Column>
        </Grid>
      </div>
    );
  })
);
