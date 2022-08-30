import React, { useCallback, useEffect, useState } from 'react';
import { Form, Table } from 'semantic-ui-react';
import { getReportViewModel, setReportViewModel } from 'student/store/ReportStore';
import { useResultManagementViewModel } from 'student/store/ResultManagementStore';
import { ExtraWorkState } from '../../model/vo/ExtraWorkState';
import { RadioGroup } from 'shared/components';

interface HomeworkScoreViewProps {
  state: ExtraWorkState;
}

export function HomeworkStateView({ state }: HomeworkScoreViewProps) {
  //
  const resultManagementViewModel = useResultManagementViewModel();
  const reportFinished = (resultManagementViewModel && resultManagementViewModel.reportFinished) || false;
  const [nextState, setNextState] = useState<ExtraWorkState>(
    state === ExtraWorkState.Fail ? state : ExtraWorkState.Pass
  );

  const onChangeState = useCallback((e, data) => {
    const nextState = data.value;
    setNextState(data.value);

    const reportViewModel = getReportViewModel();

    if (reportViewModel === undefined) {
      return;
    }

    setReportViewModel({
      ...reportViewModel,
      homeworkState: nextState,
    });
  }, []);

  const getDisplayState = (state: ExtraWorkState): string => {
    //
    if (state === ExtraWorkState.Fail) {
      return '불합격';
    } else if (state === ExtraWorkState.Pass) {
      return '합격';
    } else if (state === ExtraWorkState.Submit) {
      return '제출';
    }

    return '미제출';
  };

  useEffect(() => {
    //
    const reportViewModel = getReportViewModel();

    if (reportViewModel === undefined) {
      return;
    }

    setReportViewModel({
      ...reportViewModel,
      homeworkState: nextState,
    });
  }, []);

  return (
    <Table.Row>
      <Table.Cell className="tb-header">합격 여부</Table.Cell>
      <Table.Cell>
        {reportFinished ? (
          getDisplayState(state)
        ) : (
          <Form className="no-margin no-padding">
            <Form.Group inline className="no-margin">
              <RadioGroup
                values={[ExtraWorkState.Pass, ExtraWorkState.Fail]}
                value={nextState}
                labels={['합격', '불합격']}
                onChange={(e, data) => onChangeState(e, data)}
              />
            </Form.Group>
          </Form>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
