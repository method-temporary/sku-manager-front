import * as React from 'react';
import { Table, Form, Radio, Checkbox, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import moment, { Moment } from 'moment';
import { BoardModel } from '../../model/BoardModel';

interface Props {
  onChangeBoardProps: (name: string, value: string | boolean, nameSub?: string) => void;
  onChangeBoardPeriodProps: (name: string, value: Moment) => void;
  board: BoardModel;
  onClickUnlimitedPeriod: () => void;
}

interface States {}

@observer
@reactAutobind
class AdditionalInfoForCommunityView extends React.Component<Props, States> {
  //
  render() {
    const { onChangeBoardProps, onChangeBoardPeriodProps, board, onClickUnlimitedPeriod } = this.props;
    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              부가 정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>오픈형/폐쇄형</Table.Cell>
            <Table.Cell>
              <Form.Group>
                <Form.Field
                  control={Radio}
                  checked={(board && board.config && !board.config.enClosed) || ''}
                  label="오픈형"
                  onClick={() => onChangeBoardProps('config.enClosed', false)}
                />
                <Form.Field
                  control={Radio}
                  checked={(board && board.config && board.config.enClosed) || ''}
                  label="폐쇄형"
                  onClick={() => onChangeBoardProps('config.enClosed', true)}
                />
              </Form.Group>
            </Table.Cell>
          </Table.Row>
          {board && board.config && board.config.enClosed ? (
            <Table.Row>
              <Table.Cell>교육기간</Table.Cell>
              <Table.Cell>
                <div className="fields">
                  <div className="field">
                    <div className="ui input right icon">
                      <DatePicker
                        placeholderText="시작날짜를 선택해주세요."
                        selected={
                          (board && board.learningPeriod && board.learningPeriod.startDateObj) || moment().toDate()
                        }
                        onChange={(date: Date) =>
                          onChangeBoardPeriodProps('learningPeriod.startDateMoment', moment(date))
                        }
                        minDate={moment().toDate()}
                        dateFormat="yyyy.MM.dd"
                      />
                      <Icon name="calendar alternate outline" />
                    </div>
                  </div>
                  <div className="dash">-</div>
                  <div className="field">
                    <div className="ui input right icon">
                      <DatePicker
                        placeholderText="종료날짜를 선택해주세요."
                        selected={
                          (board && board.learningPeriod && board.learningPeriod.endDateObj) || moment().toDate()
                        }
                        onChange={(date: Date) =>
                          onChangeBoardPeriodProps('learningPeriod.endDateMoment', moment(date))
                        }
                        minDate={
                          (board && board.learningPeriod && board.learningPeriod.startDateObj) || moment().toDate()
                        }
                        disabled={
                          board && board.learningPeriod && board.learningPeriod.endDateDot === String('2100.12.30')
                        }
                        dateFormat="yyyy.MM.dd"
                      />
                      <Icon name="calendar alternate outline" />
                    </div>
                  </div>
                  <Form.Field
                    control={Checkbox}
                    label="기간 무제한"
                    checked={board && board.learningPeriod && board.learningPeriod.endDateDot === String('2100.12.30')}
                    onChange={() => onClickUnlimitedPeriod()}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          ) : null}
        </Table.Body>
      </Table>
    );
  }
}

export default AdditionalInfoForCommunityView;
