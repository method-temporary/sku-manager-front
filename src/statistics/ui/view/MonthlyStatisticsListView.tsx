import * as React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { calculatorToOneDecimal } from 'shared/helper';

import MonthlyMembershipStatistics from '../../model/dto/MonthlyMembershipStatistics';

interface Props {
  monthlyMembershipStatistics: MonthlyMembershipStatistics[];
  workspaceName: string;
  year: string;
}

interface States {}

@observer
@reactAutobind
class MonthlyStatisticsListView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { monthlyMembershipStatistics, workspaceName, year } = this.props;

    return (
      <Table celled structured>
        <colgroup>
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="10" className="title-header">
              {`${year}년도 월별 통계 ${workspaceName ? `(${workspaceName})` : ''}`}
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell textAlign="center" rowSpan="2">
              구분
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center" colSpan="3">
              200시간 멤버
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center" colSpan="3">
              20시간 멤버
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center" colSpan="3">
              N/A 멤버
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            {/*<Table.HeaderCell textAlign="center">등록인원</Table.HeaderCell>*/}
            <Table.HeaderCell textAlign="center">학습인원</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">총 학습시간</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">평균 학습시간</Table.HeaderCell>
            {/*<Table.HeaderCell textAlign="center">등록인원</Table.HeaderCell>*/}
            <Table.HeaderCell textAlign="center">학습인원</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">총 학습시간</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">평균 학습시간</Table.HeaderCell>
            {/*<Table.HeaderCell textAlign="center">등록인원</Table.HeaderCell>*/}
            <Table.HeaderCell textAlign="center">학습인원</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">총 학습시간</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">평균 학습시간</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {monthlyMembershipStatistics &&
            monthlyMembershipStatistics.length > 0 &&
            monthlyMembershipStatistics.map((monthlyMembershipStatistics, index) => (
              <Table.Row key={index}>
                <Table.Cell style={{ textAlign: 'center' }}>{`${monthlyMembershipStatistics.month}월`}</Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                  {`${monthlyMembershipStatistics.memberCount.membership200}`}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                  {calculatorToOneDecimal(monthlyMembershipStatistics.learningTime.membership200 / 60)}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                  {calculatorToOneDecimal(
                    monthlyMembershipStatistics.learningTime.membership200 /
                      60 /
                      monthlyMembershipStatistics.memberCount.membership200
                  )}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                  {`${monthlyMembershipStatistics.memberCount.membership20}`}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                  {calculatorToOneDecimal(monthlyMembershipStatistics.learningTime.membership20 / 60)}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                  {calculatorToOneDecimal(
                    monthlyMembershipStatistics.learningTime.membership20 /
                      60 /
                      monthlyMembershipStatistics.memberCount.membership20
                  )}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                  {`${monthlyMembershipStatistics.memberCount.membershipNa}`}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                  {calculatorToOneDecimal(monthlyMembershipStatistics.learningTime.membershipNa / 60)}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                  {calculatorToOneDecimal(
                    monthlyMembershipStatistics.learningTime.membershipNa /
                      60 /
                      monthlyMembershipStatistics.memberCount.membershipNa
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    );
  }
}

export default MonthlyStatisticsListView;
