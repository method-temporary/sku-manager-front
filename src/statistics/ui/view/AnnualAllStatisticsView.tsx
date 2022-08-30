import * as React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SubActions } from 'shared/components';
import { calculatorToOneDecimal } from 'shared/helper';

import AnnualMembershipStatisticsList from 'statistics/model/dto/AnnualMembershipStatisticsList';

interface Props {
  annualMembershipStatisticsList: AnnualMembershipStatisticsList[];
  replayTimeStatisticsList: AnnualMembershipStatisticsList[];
  year: string;
}

interface States {}

@observer
@reactAutobind
class AnnualAllStatisticsView extends ReactComponent<Props, States> {
  async excelDownload() {
    const { year } = this.props;
    const fileName = `멤버쉽 학습통계 ${year}년도 누적 통계.xlsx`;
    const temp = XLSX.utils.table_to_book(document.getElementById('allAnnual'), { raw: true });
    XLSX.writeFile(temp, fileName, { compression: true });
    return fileName;
  }

  render() {
    //
    const { annualMembershipStatisticsList, replayTimeStatisticsList, year } = this.props;

    annualMembershipStatisticsList.map((a) => {
      a.replay = replayTimeStatisticsList.find((r) => r.id === a.id)?.value;
    });

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
        <Table celled structured id="allAnnual">
          <colgroup>
            <col width="20%" />
            <col width="40%" />
            <col width="40%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="7" className="title-header">
                {`${year}년도 누적 통계`}
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell textAlign="center">조직</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">구분</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">통계</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {annualMembershipStatisticsList &&
              annualMembershipStatisticsList.length > 0 &&
              replayTimeStatisticsList &&
              replayTimeStatisticsList.length > 0 &&
              annualMembershipStatisticsList.map((annualMembershipStatistics, index) => (
                <>
                  <Table.Row key={'f' + index}>
                    <Table.Cell
                      rowSpan="6"
                      style={{ textAlign: 'center' }}
                    >{`${annualMembershipStatistics.name}`}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right' }}>{`200시간 멤버 평균학습시간`}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right' }}>
                      <span>{`${calculatorToOneDecimal(
                        annualMembershipStatistics.value.learningTime.membership200 /
                          annualMembershipStatistics.value.memberCount.membership200 /
                          60
                      )}시간, 현재 등록 인원 ${annualMembershipStatistics.value.memberCount.membership200}명`}</span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row key={'s' + index}>
                    <Table.Cell style={{ textAlign: 'right' }}>{`20시간 멤버 평균학습시간`}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right' }}>
                      <span>{`${calculatorToOneDecimal(
                        annualMembershipStatistics.value.learningTime.membership20 /
                          annualMembershipStatistics.value.memberCount.membership20 /
                          60
                      )}시간, 현재 등록 인원 ${annualMembershipStatistics.value.memberCount.membership20}명`}</span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row key={'n' + index}>
                    <Table.Cell style={{ textAlign: 'right' }}>{`N/A 멤버 평균학습시간`}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right' }}>
                      <span>{`${calculatorToOneDecimal(
                        annualMembershipStatistics.value.learningTime.membershipNa /
                          annualMembershipStatistics.value.memberCount.membershipNa /
                          60
                      )}시간, 현재 등록 인원 ${annualMembershipStatistics.value.memberCount.membershipNa}명`}</span>
                    </Table.Cell>
                  </Table.Row>
                  {/* replayTimeStatisticsList.find((e) => e.id === annualMembershipStatistics.id) */}
                  <Table.Row key={'rf' + index}>
                    <Table.Cell style={{ textAlign: 'right' }}>{`200시간 멤버 총 복습시간`}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right' }}>
                      <span>
                        {`${
                          annualMembershipStatistics.replay
                            ? calculatorToOneDecimal(
                                annualMembershipStatistics.replay.learningTime.membership200 / 60 / 60
                              )
                            : 0
                        } 시간, 복습 인원 
                        ${
                          annualMembershipStatistics.replay
                            ? annualMembershipStatistics.replay.memberCount.membership200
                            : 0
                        } 명`}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row key={'rs' + index}>
                    <Table.Cell style={{ textAlign: 'right' }}>{`20시간 멤버 총 복습시간`}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right' }}>
                      <span>
                        {`${
                          annualMembershipStatistics.replay
                            ? calculatorToOneDecimal(
                                annualMembershipStatistics.replay.learningTime.membership20 / 60 / 60
                              )
                            : 0
                        } 시간, 복습 인원 
                        ${
                          annualMembershipStatistics.replay
                            ? annualMembershipStatistics.replay.memberCount.membership20
                            : 0
                        } 명`}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row key={'rn' + index}>
                    <Table.Cell style={{ textAlign: 'right' }}>{`N/A 멤버 총 복습시간`}</Table.Cell>
                    <Table.Cell style={{ textAlign: 'right' }}>
                      <span>{`${
                        annualMembershipStatistics.replay
                          ? calculatorToOneDecimal(
                              annualMembershipStatistics.replay.learningTime.membershipNa / 60 / 60
                            )
                          : 0
                      } 시간, 복습 인원 
                        ${
                          annualMembershipStatistics.replay
                            ? annualMembershipStatistics.replay.memberCount.membershipNa
                            : 0
                        } 명`}</span>
                    </Table.Cell>
                  </Table.Row>
                </>
              ))}
          </Table.Body>
        </Table>
      </>
    );
  }
}

export default AnnualAllStatisticsView;
