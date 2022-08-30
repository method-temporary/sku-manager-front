import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { FormTable } from 'shared/components';
import { calculatorToOneDecimal } from 'shared/helper';
import AnnualMembershipStatistics from '../../model/dto/AnnualMembershipStatistics';
import { TableHeaderCell } from 'semantic-ui-react';

interface Props {
  annualMembershipStatistics: AnnualMembershipStatistics;
  replayTimeStatistics: AnnualMembershipStatistics;
  workspaceName: string;
  year: string;
}

interface States {}

@observer
@reactAutobind
class AnnualStatisticsView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { annualMembershipStatistics, replayTimeStatistics, workspaceName, year } = this.props;

    return (
      <FormTable
        title={`${year}년도 누적 통계 ${workspaceName ? `(${workspaceName})` : ''} `}
        colWidths={['20%', '30%', '20%', '30%']}
      >
        <FormTable.Row colSpan={4} name="200시간 멤버 평균학습시간">
          <span>{`${calculatorToOneDecimal(
            annualMembershipStatistics.learningTime.membership200 /
              annualMembershipStatistics.memberCount.membership200 /
              60
          )}시간, 현재 등록 인원 ${annualMembershipStatistics.memberCount.membership200}명`}</span>
          <span className="tb-header">200시간 멤버 총 복습시간</span>
          <span>
            {`${calculatorToOneDecimal(replayTimeStatistics.learningTime.membership200 / 60 / 60)} 시간, 
            복습 인원 ${replayTimeStatistics.memberCount.membership200} 명`}
          </span>
        </FormTable.Row>

        <FormTable.Row colSpan={4} name="20시간 멤버 평균학습시간">
          <span>{`${calculatorToOneDecimal(
            annualMembershipStatistics.learningTime.membership20 /
              annualMembershipStatistics.memberCount.membership20 /
              60
          )}시간, 현재 등록 인원 ${annualMembershipStatistics.memberCount.membership20}명`}</span>
          <span className="tb-header">20시간 멤버 총 복습시간</span>
          <span>
            {`${calculatorToOneDecimal(replayTimeStatistics.learningTime.membership20 / 60 / 60)} 시간, 
            복습 인원 ${replayTimeStatistics.memberCount.membership20} 명`}
          </span>
        </FormTable.Row>
        <FormTable.Row colSpan={4} name="N/A 멤버 평균학습시간">
          <span>{`${calculatorToOneDecimal(
            annualMembershipStatistics.learningTime.membershipNa /
              annualMembershipStatistics.memberCount.membershipNa /
              60
          )}시간, 현재 등록 인원 ${annualMembershipStatistics.memberCount.membershipNa}명`}</span>
          <span className="tb-header">N/A 멤버 총 복습시간</span>
          <span>
            {`${calculatorToOneDecimal(replayTimeStatistics.learningTime.membershipNa / 60 / 60)} 시간, 
            복습 인원 ${replayTimeStatistics.memberCount.membershipNa} 명`}
          </span>
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default AnnualStatisticsView;
