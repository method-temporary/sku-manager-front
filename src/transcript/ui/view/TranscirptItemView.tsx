import React from 'react';
import { TextArea, Input, Table, Button, TextAreaProps, Form, Pagination } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import TranscriptService from '../../subtitle/present/logic/TranscriptService';
import NumberFormat from 'react-number-format';
import { toInteger } from 'lodash';
import { TranscriptModel } from '../../subtitle/model/TranscriptModel';

interface Props {
  index?: number;
  // transcriptService?: TranscriptService
  // sharedService?: SharedService;
  transcriptModelList: TranscriptModel[];
  transcriptCount: number;
  onClickTranscriptAdd: () => void;
  onClickTranscriptRemove: (idx: number) => void;
  deliveryId: string;
  onChangeTextProps: (index: number, name: string, value: string) => void;
  language: string;
  findTranscriptList: (page: number, language?: string) => void;
}

@observer
@reactAutobind
export default class TranscriptItemView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    const { findTranscriptList } = this.props;
    findTranscriptList(0, 'ko');
  }

  onTimeChange(e: any, name: string, index: number) {
    //
    const { onChangeTextProps } = this.props;
    onChangeTextProps(index, name, e.value);
  }

  timeFormat(val: string) {
    if (val.length > 6) {
      val = val.substring(0, 6);
    }
    const hour = val.substring(0, 2) && val.substring(0, 2) !== '0' ? this.limit(val.substring(0, 2), '99') : '00';
    const minute = val.substring(2, 4) && val.substring(2, 4) !== '0' ? this.limit(val.substring(2, 4), '59') : '00';
    const second = val.substring(4, 6) && val.substring(4, 6) !== '0' ? this.limit(val.substring(4, 6), '59') : '00';

    return hour + ':' + minute + ':' + second;
  }

  limit(val: string, max: string) {
    if (val.length === 1 && val[0] > max[0]) {
      val = '0' + val;
    } else if (val.length === 1 && val[0] <= max[0]) {
      val = val[0] + '0';
    }

    if (val.length === 2) {
      if (val > max) {
        val = max;
      }
    }

    return val;
  }

  render() {
    const {
      onClickTranscriptAdd,
      onClickTranscriptRemove,
      onChangeTextProps,
      transcriptCount,
      transcriptModelList,
    } = this.props;

    // const {
    //   transcriptCount,
    //   transcriptModelList,
    //   // transcripts
    // } = this.props.transcriptService || ({} as TranscriptService);
    // const transcripts = (transcript.transcripts) || [];
    // const results = transcripts && transcripts.results;
    // const totalCount = transcripts && transcripts.totalCount;

    return (
      <Form.Field>
        <Table celled>
          <colgroup>
            <col width="6%" />
            <col width="12%" />
            <col width="6%" />
            <col width="12%" />
            <col width="6%" />
            <col width="52%" />
            <col width="6%" />
          </colgroup>

          <Table.Body>
            {transcriptModelList && transcriptModelList.length
              ? transcriptModelList.map((transcriptModel, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="tb-header">시작</Table.Cell>
                    <Table.Cell>
                      <NumberFormat
                        value={transcriptModel.startTime}
                        onValueChange={(e: any) => this.onTimeChange(e, 'startTime', index)}
                        placeholder="시:분:초"
                        format={this.timeFormat}
                      />
                    </Table.Cell>
                    <Table.Cell className="tb-header">종료</Table.Cell>
                    <Table.Cell>
                      <NumberFormat
                        value={transcriptModel.endTime}
                        onValueChange={(e: any) => this.onTimeChange(e, 'endTime', index)}
                        placeholder="시:분:초"
                        format={this.timeFormat}
                      />
                    </Table.Cell>
                    <Table.Cell className="tb-header">내용</Table.Cell>
                    <Table.Cell>
                      <TextArea
                        rows={2}
                        placeholder="내용 입력"
                        value={transcriptModel.text}
                        onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>
                          onChangeTextProps(index, `text`, `${data.value}`)
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {transcriptCount - 1 === transcriptModel.number ? (
                        <Button onClick={onClickTranscriptAdd}> + </Button>
                      ) : (
                        <Button onClick={() => onClickTranscriptRemove(index)}> - </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              : null}
          </Table.Body>
        </Table>
      </Form.Field>
    );
  }
}
