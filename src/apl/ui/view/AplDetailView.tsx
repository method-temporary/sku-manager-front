import * as React from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Form, Input, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';
import depot, { DepotFileViewModel } from '@nara.drama/depot';

import { EnumUtil, AplTypeView } from 'shared/ui';

import { AplService } from '../../index';
import { AplState } from '../../model/AplState';
import { AplType } from '../../model/AplType';

interface Props {
  aplService: AplService;
  onChangeAplProps: (name: string, value: string | number) => void;
  selectChange?: (aplType: string) => void;
  focusControlName?: string;
  onResetFocusControl?: () => void;
  aplState: string;
  aplId: string;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
}

interface States {
  filesMap: Map<string, any>;
}

@inject('sharedService', 'aplService')
@observer
@reactAutobind
class AplDetailView extends React.Component<Props, States> {
  private focusInputRefs: any = {
    updateHour: React.createRef(),
    updateMinute: React.createRef(),
  };

  //
  constructor(props: Props) {
    super(props);
    this.state = {
      //aplTypeSelect: AplType.Rqd,
      filesMap: new Map<string, any>(),
    };
  }

  componentDidMount(): void {
    this.findMenuApl();
    this.setInputFocus();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    const { focusControlName } = this.props;
    if (focusControlName) {
      this.setInputFocus();
    }
  }

  findMenuApl() {
    //
    const { aplService, aplId, onChangeAplProps } = this.props;

    if (aplId) {
      aplService!.findApl(aplId).then((apl) => {
        if (apl.updateHour === 0 && apl.updateMinute === 0) {
          onChangeAplProps('updateHour', apl.allowHour);
          onChangeAplProps('updateMinute', apl.allowMinute);
        }
        this.getFileIds();
      });
    }
  }

  onChangeAplPropsValid(name: string, value: string | number) {
    //
    const { onChangeAplProps } = this.props;
    const invalidHour = Number(value) < 0;
    const invalidMin = Number(value) > 59 || Number(value) < 0;

    if (name === 'updateHour') {
      if (invalidHour) {
        return;
      }
    }

    if (name === 'updateMinute') {
      if (invalidMin) {
        return;
      }
    }

    if (value < 0) value = 0;
    onChangeAplProps(name, value);
  }

  getFileIds() {
    //
    const { apl } = this.props.aplService || ({} as AplService);
    this.findFiles('reference', apl.fileIds);
  }

  findFiles(type: string, fileBoxId: string) {
    const { filesMap } = this.state;
    depot.getDepotFiles(fileBoxId).then((files) => {
      filesMap.set(type, files);
      const newMap = new Map(filesMap.set(type, files));
      this.setState({ filesMap: newMap });
    });
  }

  setInputFocus() {
    const { focusControlName, onResetFocusControl } = this.props;
    if (!focusControlName || !this.focusInputRefs[focusControlName] || !this.focusInputRefs[focusControlName].current) {
      return;
    }
    //this.focusInputRefs[focusControlName].current.focus();

    if (['updateHour', 'updateMinute'].includes(focusControlName)) {
      // input focus
      this.focusInputRefs[focusControlName].current.focus();
    }

    if (onResetFocusControl) onResetFocusControl();
  }

  render() {
    const { aplState, aplService, collegesMap, channelMap } = this.props;
    const { filesMap } = this.state;
    const { apl } = aplService;

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="title-header" colSpan={2}>
              교육정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">교육명</Table.Cell>
            <Table.Cell>
              <Form.Field>
                <div>{apl.title || ''}</div>
              </Form.Field>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">교육형태</Table.Cell>
            <Table.Cell>
              <Form.Field>
                <div>
                  {(apl.type === AplType.Etc &&
                    EnumUtil.getEnumValue(AplTypeView, apl.type).get(apl.type) + ' > ' + apl.typeName) ||
                    apl.typeName}
                </div>
              </Form.Field>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">Category | Channel</Table.Cell>
            <Table.Cell>
              <Form.Field>
                <div>
                  {(apl.collegeId !== '' &&
                    apl.channelId !== '' &&
                    collegesMap.get(apl.collegeId) + ' | ' + channelMap.get(apl.channelId)) ||
                    (apl.collegeId !== '' && apl.channelId === '' && collegesMap.get(apl.collegeId)) ||
                    (apl.collegeId === '' && apl.channelId !== '' && channelMap.get(apl.channelId))}
                </div>
              </Form.Field>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">교육기간</Table.Cell>
            <Table.Cell>
              <Form.Field>
                <div>
                  {moment(apl.startDate).format('YYYY.MM.DD') + ' ~ ' + moment(apl.endDate).format('YYYY.MM.DD')}
                </div>
              </Form.Field>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">교육기관</Table.Cell>
            <Table.Cell>
              <Form.Field>
                <div>{apl.institute || ''}</div>
              </Form.Field>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">
              교육시간 {aplState === AplState.Opened && <span className="required">*</span>}
            </Table.Cell>
            <Table.Cell>
              {(aplState === AplState.Opened && (
                <>
                  <Form.Group style={{ display: 'flex', position: 'relative' }}>
                    <Form.Field
                      id="updateHour"
                      control={Input}
                      placeholder="Select"
                      width={2}
                      type="number"
                      value={parseInt(String(apl.updateHour), 10)}
                      onChange={(e: any, data: any) => {
                        this.onChangeAplPropsValid('updateHour', data.value);
                      }}
                      ref={this.focusInputRefs.updateHour}
                    />
                    <Form.Field style={{ lineHeight: '2.5', paddingLeft: '.5em', paddingRight: '.5em' }}>
                      시간
                    </Form.Field>
                    <Form.Field
                      id="updateMinute"
                      control={Input}
                      placeholder="Select"
                      width={2}
                      type="number"
                      value={parseInt(String(apl.updateMinute), 10)}
                      onChange={(e: any, data: any) => this.onChangeAplPropsValid('updateMinute', data.value)}
                      ref={this.focusInputRefs.updateMinute}
                    />
                    <Form.Field style={{ lineHeight: '2.5', paddingLeft: '.5em', paddingRight: '.5em' }}>분</Form.Field>
                  </Form.Group>
                </>
              )) || (
                <>
                  {apl.allowUpdateHour}
                  <label>시간</label> {apl.allowUpdateMinute}
                  <label>분</label>{' '}
                </>
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">교육내용</Table.Cell>
            <Table.Cell>
              <Form.Field>
                <div>{apl.content || ''}</div>
              </Form.Field>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">첨부파일</Table.Cell>
            <Table.Cell>
              {(filesMap &&
                filesMap.get('reference') &&
                filesMap.get('reference').map((foundedFile: DepotFileViewModel, index: number) => (
                  <p key={index}>
                    <a onClick={() => depot.downloadDepotFile(foundedFile.id)}>{foundedFile.name}</a>
                  </p>
                ))) ||
                '-'}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default AplDetailView;
