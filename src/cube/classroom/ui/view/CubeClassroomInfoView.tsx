import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Icon, Input, Radio, Select } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { MemberViewModel } from '@nara.drama/approval';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { CubeType, SelectType } from 'shared/model';
import { alert, AlertModel, FormTable } from 'shared/components';

import { ClassroomModel } from 'cube/classroom';
import CubeInstructorInfoView from '../../../cube/ui/view/CubeInstructorInfoView';
import ManagerListModalView from '../../../cube/ui/view/ManagerListModal';
import CubeManagerInfoView from '../../../cube/ui/view/CubeManagerInfoView';
import CubeInstructorModel from '../../../cube/CubeInstructorModel';

interface Props {
  onRemoveClassroom: (index: number) => void;
  addCubeClassrooms: () => void;
  onChangeTargetClassroomProp: (index: number, name: string, value: any) => void;
  handleEnrollingAvailableChange: (index: number, enrollingAvailable: boolean) => void;
  setEmailFlagByEnrollingApproval: (index: number) => void;
  onChangeTargetInstructor: (instructor: CubeInstructorModel, name: string, value: any) => void;
  onSelectInstructor: (instructor: CubeInstructorModel, name: string, value: boolean) => void;
  onDeleteInstructor: (instructor: CubeInstructorModel) => void;
  handleManagerListModalOk: (member: MemberViewModel, index: number) => void;

  cubeInstructors: CubeInstructorModel[];
  filesMap: Map<string, any>;
  modSuper?: boolean;
  classrooms: ClassroomModel[];
  cubeType: CubeType;
}

interface States {}

@observer
@reactAutobind
class CubeClassroomInfoView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const {
      onRemoveClassroom,
      addCubeClassrooms,
      onChangeTargetClassroomProp,
      handleEnrollingAvailableChange,
      setEmailFlagByEnrollingApproval,
      onChangeTargetInstructor,
      onSelectInstructor,
      onDeleteInstructor,
      handleManagerListModalOk,
    } = this.props;
    const { cubeInstructors, modSuper, classrooms, cubeType } = this.props;

    return (
      <FormTable title="부가정보">
        <FormTable.Row name="차수등록">
          {classrooms
            .sort((current, next) => (current.round > next.round ? 1 : current.round < next.round ? -1 : 0))
            .map((classroom, index) => {
              return (
                <FormTable title="" withoutHeader key={index}>
                  <FormTable.Row required name="차수정보">
                    {(classroom.round && classroom.round) || index + 1}
                    {/* 1개 등록된 경우 삭제 기능 제공하지않음. 1개 이상일경우 삭제 기능제공 */}
                    {/* SuperManager 수정일 경우 삭제 기능 없음 */}
                    {((classroom && classroom.round > 1) || index > 0) && modSuper ? (
                      <div className="fl-right">
                        <Button icon onClick={() => onRemoveClassroom(index)}>
                          <Icon name="minus" />
                        </Button>
                      </div>
                    ) : null}
                  </FormTable.Row>
                  <FormTable.Row required name="정원">
                    {!modSuper ? (
                      <p>{(classroom && classroom.capacity) || ''}</p>
                    ) : (
                      <Form.Field
                        fluid
                        control={Input}
                        type="number"
                        placeholder="정원을 입력해주세요."
                        value={(classroom && classroom.capacity) || ''}
                        onChange={(e: any) => onChangeTargetClassroomProp(index, 'capacity', e.target.value)}
                      />
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="신청기간">
                    {!modSuper ? (
                      <p>{`${
                        moment(classroom.enrolling.applyingPeriod.startDateLong).format('YYYY.MM.DD') || moment()
                      } ~ ${
                        moment(classroom.enrolling.applyingPeriod.endDateLong).format('YYYY.MM.DD') || moment()
                      }`}</p>
                    ) : (
                      <>
                        <div className="ui input right icon">
                          <DatePicker
                            placeholderText="시작날짜를 선택해주세요."
                            selected={classroom.enrolling.applyingPeriod.startDateObj || moment()}
                            onChange={(date: Date) =>
                              onChangeTargetClassroomProp(
                                index,
                                'enrolling.applyingPeriod.startDateMoment',
                                moment(date).startOf('day')
                              )
                            }
                            dateFormat="yyyy.MM.dd"
                          />
                          <Icon name="calendar alternate outline" />
                        </div>
                        <div className="dash">-</div>
                        <div className="ui input right icon">
                          <DatePicker
                            placeholderText="종료날짜를 선택해주세요."
                            selected={classroom.enrolling.applyingPeriod.endDateObj || moment()}
                            onChange={(date: Date) =>
                              onChangeTargetClassroomProp(
                                index,
                                'enrolling.applyingPeriod.endDateMoment',
                                moment(date).endOf('day')
                              )
                            }
                            minDate={classroom.enrolling.applyingPeriod.startDateObj || moment()}
                            dateFormat="yyyy.MM.dd"
                          />
                          <Icon name="calendar alternate outline" />
                        </div>
                      </>
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="교육기간">
                    {!modSuper ? (
                      <p>{`${
                        moment(classroom.enrolling.learningPeriod.startDateLong).format('YYYY.MM.DD') || moment()
                      } ~ ${
                        moment(classroom.enrolling.learningPeriod.endDateLong).format('YYYY.MM.DD') || moment()
                      }`}</p>
                    ) : (
                      <>
                        <div className="ui input right icon">
                          <DatePicker
                            placeholderText="시작날짜를 선택해주세요."
                            selected={classroom.enrolling.learningPeriod.startDateObj || moment()}
                            onChange={(date: Date) =>
                              onChangeTargetClassroomProp(
                                index,
                                'enrolling.learningPeriod.startDateMoment',
                                moment(date).startOf('day')
                              )
                            }
                            // minDate={moment().toDate()}
                            dateFormat="yyyy.MM.dd"
                          />
                          <Icon name="calendar alternate outline" />
                        </div>
                        <div className="dash">-</div>
                        <div className="ui input right icon">
                          <DatePicker
                            placeholderText="종료날짜를 선택해주세요."
                            selected={classroom.enrolling.learningPeriod.endDateObj || moment()}
                            onChange={(date: Date) =>
                              onChangeTargetClassroomProp(
                                index,
                                'enrolling.learningPeriod.endDateMoment',
                                moment(date).endOf('day')
                              )
                            }
                            minDate={classroom.enrolling.learningPeriod.startDateObj || moment()}
                            dateFormat="yyyy.MM.dd"
                          />
                          <Icon name="calendar alternate outline" />
                        </div>
                      </>
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="취소가능기간">
                    {!modSuper ? (
                      <p>{`${
                        moment(classroom.enrolling.cancellablePeriod.startDateLong).format('YYYY.MM.DD') || moment()
                      } ~ ${
                        moment(classroom.enrolling.cancellablePeriod.endDateLong).format('YYYY.MM.DD') || moment()
                      }`}</p>
                    ) : (
                      <>
                        <div className="ui input right icon">
                          <DatePicker
                            placeholderText="시작날짜를 선택해주세요."
                            selected={classroom.enrolling.cancellablePeriod.startDateObj || moment()}
                            onChange={(date: Date) =>
                              onChangeTargetClassroomProp(
                                index,
                                'enrolling.cancellablePeriod.startDateMoment',
                                moment(date).startOf('day')
                              )
                            }
                            // minDate={moment().toDate()}
                            dateFormat="yyyy.MM.dd"
                          />
                          <Icon name="calendar alternate outline" />
                        </div>
                        <div className="dash">-</div>
                        <div className="ui input right icon">
                          <DatePicker
                            placeholderText="종료날짜를 선택해주세요."
                            selected={classroom.enrolling.cancellablePeriod.endDateObj || moment()}
                            onChange={(date: Date) =>
                              onChangeTargetClassroomProp(
                                index,
                                'enrolling.cancellablePeriod.endDateMoment',
                                moment(date).endOf('day')
                              )
                            }
                            minDate={classroom.enrolling.cancellablePeriod.startDateObj || moment()}
                            dateFormat="yyyy.MM.dd"
                          />
                          <Icon name="calendar alternate outline" />
                        </div>
                      </>
                    )}
                  </FormTable.Row>
                  <FormTable.Row name="No Show Penalty">
                    {!modSuper ? (
                      <p>{(classroom && classroom.enrolling && classroom.enrolling.cancellationPenalty) || ''}</p>
                    ) : (
                      <div
                        className={
                          ((classroom &&
                            classroom.enrolling &&
                            classroom.enrolling.cancellationPenalty &&
                            classroom.enrolling.cancellationPenalty.length) ||
                            0) >= 100
                            ? 'ui right-top-count input error'
                            : 'ui right-top-count input'
                        }
                      >
                        <span className="count">
                          <span className="now">
                            {(classroom &&
                              classroom.enrolling &&
                              classroom.enrolling.cancellationPenalty &&
                              classroom.enrolling.cancellationPenalty.length) ||
                              0}
                          </span>
                          /<span className="max">100</span>
                        </span>
                        <input
                          maxLength={100}
                          id="cancellationPenalty"
                          type="text"
                          placeholder="No Show 일 경우 패널티 정보를 입력해주세요. (100자까지 입력가능)"
                          value={(classroom && classroom.enrolling && classroom.enrolling.cancellationPenalty) || ''}
                          onChange={(e: any) =>
                            onChangeTargetClassroomProp(index, 'enrolling.cancellationPenalty', e.target.value)
                          }
                        />
                      </div>
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="교육장소">
                    {!modSuper ? (
                      <p>{(classroom && classroom.operation && classroom.operation.location) || ''}</p>
                    ) : (
                      <div
                        className={
                          ((classroom &&
                            classroom.operation &&
                            classroom.operation.location &&
                            classroom.operation.location.length) ||
                            0) >= 100
                            ? 'ui right-top-count input error'
                            : 'ui right-top-count input'
                        }
                      >
                        <span className="count">
                          <span className="now">
                            {(classroom &&
                              classroom.operation &&
                              classroom.operation.location &&
                              classroom.operation.location.length) ||
                              0}
                          </span>
                          /<span className="max">100</span>
                        </span>
                        <input
                          id="location"
                          type="text"
                          placeholder="교육장소를 입력해주세요. (100자까지 입력가능)"
                          value={(classroom && classroom.operation && classroom.operation.location) || ''}
                          onChange={(e: any) =>
                            onChangeTargetClassroomProp(index, 'operation.location', e.target.value)
                          }
                        />
                        {/*<span className="validation">You can enter up to 100 characters.</span>*/}
                      </div>
                    )}
                  </FormTable.Row>
                  <FormTable.Row name="외부과정 URL" required={cubeType === CubeType.ELearning}>
                    {!modSuper ? (
                      <p>{(classroom && classroom.operation && classroom.operation.siteUrl) || ''}</p>
                    ) : (
                      <Form.Field
                        fluid
                        control={Input}
                        placeholder="https://"
                        value={(classroom && classroom.operation && classroom.operation.siteUrl) || ''}
                        onChange={(e: any) => onChangeTargetClassroomProp(index, 'operation.siteUrl', e.target.value)}
                      />
                    )}
                  </FormTable.Row>
                  <FormTable.Row name="유/무료 여부">
                    {!modSuper ? (
                      <span>
                        {classroom.freeOfCharge.freeOfCharge ? `무료` : `유료  ${classroom.freeOfCharge.chargeAmount}`}
                      </span>
                    ) : (
                      <Form.Group>
                        <Form.Field
                          control={Select}
                          placeholder="Select"
                          options={SelectType.pay}
                          value={classroom && classroom.freeOfCharge && classroom.freeOfCharge.freeOfCharge}
                          onChange={(e: any, data: any) =>
                            onChangeTargetClassroomProp(index, 'freeOfCharge.freeOfCharge', data.value)
                          }
                        />
                        {classroom && classroom.freeOfCharge && !classroom.freeOfCharge.freeOfCharge ? (
                          <Form.Field
                            control={Input}
                            width={16}
                            type="number"
                            placeholder="유료 학습일 경우 교육비를 입력해주세요."
                            value={(classroom && classroom.freeOfCharge && classroom.freeOfCharge.chargeAmount) || ''}
                            onChange={(e: any) =>
                              onChangeTargetClassroomProp(index, 'freeOfCharge.chargeAmount', e.target.value)
                            }
                          />
                        ) : null}
                      </Form.Group>
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="수강신청 유/무">
                    {!modSuper ? (
                      <p>{classroom.enrolling.enrollingAvailable ? 'YES' : 'NO'}</p>
                    ) : (
                      <Form.Group>
                        <Form.Field
                          control={Radio}
                          label="Yes"
                          // value={true}
                          checked={classroom && classroom.enrolling && classroom.enrolling.enrollingAvailable}
                          onChange={() =>
                            handleEnrollingAvailableChange(index, !classroom.enrolling.enrollingAvailable)
                          }
                        />
                        <Form.Field
                          control={Radio}
                          label="No"
                          // value={false}
                          checked={classroom && classroom.enrolling && !classroom.enrolling.enrollingAvailable}
                          onChange={() =>
                            handleEnrollingAvailableChange(index, !classroom.enrolling.enrollingAvailable)
                          }
                        />
                      </Form.Group>
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="승인프로세스 여부">
                    {!modSuper ? (
                      <p>{classroom.freeOfCharge.approvalProcess ? 'YES' : 'NO'}</p>
                    ) : (
                      <Form.Group>
                        <Form.Field
                          control={Radio}
                          label="Yes"
                          // value
                          disabled={classroom && classroom.enrolling && !classroom.enrolling.enrollingAvailable}
                          checked={classroom && classroom.freeOfCharge && classroom.freeOfCharge.approvalProcess}
                          onChange={() => {
                            onChangeTargetClassroomProp(
                              index,
                              'freeOfCharge.approvalProcess',
                              !classroom.freeOfCharge.approvalProcess
                            );
                            setEmailFlagByEnrollingApproval(index);
                          }}
                        />
                        <Form.Field
                          control={Radio}
                          label="No"
                          // value={false}
                          disabled={classroom && classroom.enrolling && !classroom.enrolling.enrollingAvailable}
                          checked={classroom && classroom.freeOfCharge && !classroom.freeOfCharge.approvalProcess}
                          onChange={() => {
                            onChangeTargetClassroomProp(
                              index,
                              'freeOfCharge.approvalProcess',
                              !classroom.freeOfCharge.approvalProcess
                            );
                            setEmailFlagByEnrollingApproval(index);
                          }}
                        />
                      </Form.Group>
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="메일발송 여부">
                    {!modSuper ? (
                      <p>{classroom.freeOfCharge.sendingMail ? 'YES' : 'NO'}</p>
                    ) : (
                      <Form.Group>
                        <Form.Field
                          control={Radio}
                          label="Yes"
                          // value
                          disabled={classroom && classroom.enrolling && !classroom.enrolling.enrollingAvailable}
                          checked={classroom && classroom.freeOfCharge && classroom.freeOfCharge.sendingMail}
                          onChange={() => {
                            onChangeTargetClassroomProp(
                              index,
                              'freeOfCharge.sendingMail',
                              !classroom.freeOfCharge.sendingMail
                            );
                            if (classroom.freeOfCharge.sendingMail) {
                              alert(
                                AlertModel.getCustomAlert(
                                  false,
                                  '안내',
                                  '학습자와 승인권자에게 수강관련 메일이 발송됩니다. \n메일 발송이 필요 없으시면 N으로 변경해주세요.',
                                  '확인',
                                  () => {}
                                )
                              );
                            }
                          }}
                        />
                        <Form.Field
                          control={Radio}
                          label="No"
                          // value={false}
                          disabled={classroom && classroom.enrolling && !classroom.enrolling.enrollingAvailable}
                          checked={classroom && classroom.freeOfCharge && !classroom.freeOfCharge.sendingMail}
                          onChange={() => {
                            onChangeTargetClassroomProp(
                              index,
                              'freeOfCharge.sendingMail',
                              !classroom.freeOfCharge.sendingMail
                            );
                            if (classroom.freeOfCharge.sendingMail) {
                              alert(
                                AlertModel.getCustomAlert(
                                  false,
                                  '안내',
                                  '학습자와 승인권자에게 수강관련 메일이 발송됩니다. \n메일 발송이 필요 없으시면 N으로 변경해주세요',
                                  'Ok',
                                  () => {}
                                )
                              );
                            }
                          }}
                        />
                      </Form.Group>
                    )}
                  </FormTable.Row>
                  {/*{classroom.id !== '' ? (*/}
                  {/*  <div style={{ display: 'none' }}>*/}
                  {/*    <FormTable title="과제유무"></FormTable>*/}
                  {/*  </div>*/}
                  {/*) : (*/}
                  {/*  <div style={{ display: 'none' }}>*/}
                  {/*    <FormTable title="과제유무"></FormTable>*/}
                  {/*  </div>*/}
                  {/*)}*/}
                  <FormTable.Row name="강사 정보">
                    <CubeInstructorInfoView
                      onChangeTargetInstructor={onChangeTargetInstructor}
                      onSelectInstructor={onSelectInstructor}
                      onDeleteInstructor={onDeleteInstructor}
                      cubeInstructors={cubeInstructors}
                      round={classroom.round}
                      readonly={!modSuper}
                      // inClassroom={true}
                    />
                  </FormTable.Row>
                  <FormTable.Row required name="담당자정보">
                    <ManagerListModalView
                      handleOk={(member) => handleManagerListModalOk(member, index)}
                      buttonName="담당자 선택"
                      multiSelect={false}
                      readonly={!modSuper}
                    />
                    <CubeManagerInfoView cubeOperator={classroom.operation.operatorInfo} />
                  </FormTable.Row>
                </FormTable>
              );
            })}
          {modSuper ? (
            <div className="center">
              <Button icon onClick={addCubeClassrooms}>
                <Icon name="plus" />
              </Button>
            </div>
          ) : null}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CubeClassroomInfoView;
