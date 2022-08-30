import * as React from 'react';
import { Button, Modal, Form, Table, Input } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { PolyglotModel } from 'shared/model';
import { Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';
import { BadgeStudentModel } from '../../model/BadgeStudentModel';
import { BadgeModel } from '../../../../../_data/badge/badges/model/BadgeModel';
import { BadgeMissionMailRequestCdoModel } from '../../model/BadgeMissionMailRequestCdoModel';

interface Props {
  open: boolean;
  badge: BadgeModel;
  student: BadgeStudentModel;
  onClose: () => void;
  onSend: (badgeMailRequestCdo: BadgeMissionMailRequestCdoModel) => void;
  badgeOperatorInfo: UserIdentityModel;
}

interface States {
  title: string;
  badgeOperatorId: string;
  badgeOperatorName: PolyglotModel;
  contents: PolyglotModel;
}

@observer
@reactAutobind
class BadgeStudentMailTemplateModal extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);

    const { badge, badgeOperatorInfo } = this.props;
    this.state = {
      title: `${getPolyglotToAnyString(badge.name)} 추가 미션 안내`,
      badgeOperatorId: badgeOperatorInfo.email,
      badgeOperatorName: badgeOperatorInfo.name,
      contents: badge.acquisitionRequirements,
    };
  }

  componentDidMount() {
    const { student, onClose: handleClose } = this.props;
    if (!student) handleClose();
  }

  componentWillReceiveProps(nextProps: Props) {
    const { badge } = this.props;
    const { badge: nextBadge } = nextProps;
    if (badge.id !== nextBadge.id) {
      this.init();
    }
  }

  init() {
    const { badge, badgeOperatorInfo } = this.props;

    this.setState({
      title: `${badge.name} 추가 미션 안내`,
      badgeOperatorId: badgeOperatorInfo.email,
      badgeOperatorName: badgeOperatorInfo.name,
      contents: badge.acquisitionRequirements,
    });
  }

  handleOk() {
    const { student, onSend: handleOk } = this.props;
    const { title, badgeOperatorId, badgeOperatorName, contents } = this.state;

    handleOk(
      new BadgeMissionMailRequestCdoModel({
        badgeStudentId: student!.id,
        title,
        badgeOperatorEmail: badgeOperatorId,
        badgeOperatorName,
        contents,
      } as BadgeMissionMailRequestCdoModel)
    );
  }

  onChangeText(name: string, value: string | PolyglotModel) {
    //
    if (typeof value === 'string') {
      switch (name) {
        case 'badgeOperatorId':
          this.setState({ badgeOperatorId: value });
          break;
        // case 'badgeOperatorName':
        //   this.setState({ badgeOperatorName: value });
        //   break;
        case 'title':
          this.setState({ title: value });
          break;
      }
    } else if (name === 'contents') {
      this.setState({ contents: value });
    }
  }

  render() {
    const { student, open, onClose: handleClose, badge } = this.props;
    const { title, badgeOperatorId, badgeOperatorName, contents } = this.state;

    return (
      <React.Fragment>
        <Polyglot languages={badge.langSupports}>
          <Modal size="large" open={open} onClose={handleClose}>
            <Modal.Header>추가 미션 안내 메일 발송</Modal.Header>
            <Modal.Content>
              <Form>
                <Table celled>
                  <colgroup>
                    <col width="20%" />
                    <col width="80%" />
                  </colgroup>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>제목</Table.Cell>
                      <Table.Cell>
                        <Form.Field
                          fluid
                          control={Input}
                          placeholder="제목을 입력해주세요."
                          value={title || ''}
                          onChange={(e: any) => this.onChangeText('title', e.target.value)}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>대상자</Table.Cell>
                      <Table.Cell>
                        <div>
                          <b>소속</b> {getPolyglotToAnyString(student?.studentInfo.departmentName)} |{' '}
                          {getPolyglotToAnyString(student?.studentInfo.companyName)}
                          <br />
                          <b>이름</b> {getPolyglotToAnyString(student?.studentInfo.name)} | {student?.studentInfo.email}
                        </div>
                      </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>담당자 이름</Table.Cell>
                      <Table.Cell>
                        <Polyglot.Input languageStrings={badgeOperatorName} name="badgeOperatorName" readOnly />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>담당자 이메일</Table.Cell>
                      <Table.Cell>
                        <Form.Field
                          width={8}
                          control={Input}
                          placeholder="이메일"
                          value={badgeOperatorId || ''}
                          onChange={(e: any) => this.onChangeText('badgeOperatorId', e.target.value)}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>추가미션내용</Table.Cell>
                      <Table.Cell>
                        {/*<TextArea*/}
                        {/*  placeholder="Please enter the mission."*/}
                        {/*  rows={15}*/}
                        {/*  value={contents || ''}*/}
                        {/*  onChange={(e: any) => this.onChangeText('contents', e.target.value)}*/}
                        {/*/>*/}

                        <Polyglot.TextArea
                          name="contents"
                          languageStrings={contents}
                          onChangeProps={this.onChangeText}
                          placeholder="추가 미션 내용을 입력해주세요."
                        />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={handleClose} type="button">
                취소
              </Button>
              <Button primary onClick={this.handleOk} type="button">
                발송
              </Button>
            </Modal.Actions>
          </Modal>
        </Polyglot>
      </React.Fragment>
    );
  }
}

export default BadgeStudentMailTemplateModal;
