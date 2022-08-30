import * as React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SubActions } from 'shared/components';
import { calculatorToOneDecimal } from 'shared/helper';

import MonthlyMembershipStatisticsList from 'statistics/model/dto/MonthlyMembershipStatisticsList';

interface Props {
  monthlyMembershipStatisticsList: MonthlyMembershipStatisticsList[];
  year: string;
}

interface States {}

@observer
@reactAutobind
class MonthlyAllStatisticsListView extends ReactComponent<Props, States> {
  async excelDownload() {
    const { year } = this.props;
    const fileName = `멤버쉽 학습통계 ${year}년도 월별 누적 통계.xlsx`;
    const temp = XLSX.utils.table_to_book(document.getElementById('allMonthly'), { raw: true });
    XLSX.writeFile(temp, fileName, { compression: true });
    return fileName;
  }

  //
  render() {
    //
    const { monthlyMembershipStatisticsList, year } = this.props;

    const excelStyle = {
      float: 'right',
      marginBottom: '-43px',
      paddingTop: '40px',
      paddingRight: '1px',
    } as React.CSSProperties;

    return (
      <>
        <div style={excelStyle}>
          <SubActions.ExcelButton download onClick={this.excelDownload}>
            엑셀 다운로드
          </SubActions.ExcelButton>
        </div>
        <Table celled structured id="allMonthly">
          <colgroup>
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="11" className="title-header">
                {`${year}년도 월별 통계`}
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell textAlign="center" rowSpan="2">
                조직
              </Table.HeaderCell>
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
              <Table.HeaderCell textAlign="center">학습인원</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">총 학습시간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">평균 학습시간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">학습인원</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">총 학습시간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">평균 학습시간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">학습인원</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">총 학습시간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">평균 학습시간</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {monthlyMembershipStatisticsList &&
              monthlyMembershipStatisticsList.length > 0 &&
              monthlyMembershipStatisticsList.map((obj) => {
                if (obj && obj.value.length > 0) {
                  return obj.value.map((monthlyMembershipStatistics, index) => (
                    <Table.Row key={index}>
                      <Table.Cell style={{ textAlign: 'center' }}>{obj.name}</Table.Cell>
                      <Table.Cell
                        style={{ textAlign: 'center' }}
                      >{`${monthlyMembershipStatistics.month}월`}</Table.Cell>
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
                  ));
                } else {
                  return null;
                }
              })}
          </Table.Body>
        </Table>
      </>
    );
  }
}

export default MonthlyAllStatisticsListView;
