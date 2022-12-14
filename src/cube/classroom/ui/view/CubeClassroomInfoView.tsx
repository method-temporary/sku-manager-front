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
      <FormTable title="????????????">
        <FormTable.Row name="????????????">
          {classrooms
            .sort((current, next) => (current.round > next.round ? 1 : current.round < next.round ? -1 : 0))
            .map((classroom, index) => {
              return (
                <FormTable title="" withoutHeader key={index}>
                  <FormTable.Row required name="????????????">
                    {(classroom.round && classroom.round) || index + 1}
                    {/* 1??? ????????? ?????? ?????? ?????? ??????????????????. 1??? ??????????????? ?????? ???????????? */}
                    {/* SuperManager ????????? ?????? ?????? ?????? ?????? */}
                    {((classroom && classroom.round > 1) || index > 0) && modSuper ? (
                      <div className="fl-right">
                        <Button icon onClick={() => onRemoveClassroom(index)}>
                          <Icon name="minus" />
                        </Button>
                      </div>
                    ) : null}
                  </FormTable.Row>
                  <FormTable.Row required name="??????">
                    {!modSuper ? (
                      <p>{(classroom && classroom.capacity) || ''}</p>
                    ) : (
                      <Form.Field
                        fluid
                        control={Input}
                        type="number"
                        placeholder="????????? ??????????????????."
                        value={(classroom && classroom.capacity) || ''}
                        onChange={(e: any) => onChangeTargetClassroomProp(index, 'capacity', e.target.value)}
                      />
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="????????????">
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
                            placeholderText="??????????????? ??????????????????."
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
                            placeholderText="??????????????? ??????????????????."
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
                  <FormTable.Row required name="????????????">
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
                            placeholderText="??????????????? ??????????????????."
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
                            placeholderText="??????????????? ??????????????????."
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
                  <FormTable.Row required name="??????????????????">
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
                            placeholderText="??????????????? ??????????????????."
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
                            placeholderText="??????????????? ??????????????????."
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
                          placeholder="No Show ??? ?????? ????????? ????????? ??????????????????. (100????????? ????????????)"
                          value={(classroom && classroom.enrolling && classroom.enrolling.cancellationPenalty) || ''}
                          onChange={(e: any) =>
                            onChangeTargetClassroomProp(index, 'enrolling.cancellationPenalty', e.target.value)
                          }
                        />
                      </div>
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="????????????">
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
                          placeholder="??????????????? ??????????????????. (100????????? ????????????)"
                          value={(classroom && classroom.operation && classroom.operation.location) || ''}
                          onChange={(e: any) =>
                            onChangeTargetClassroomProp(index, 'operation.location', e.target.value)
                          }
                        />
                        {/*<span className="validation">You can enter up to 100 characters.</span>*/}
                      </div>
                    )}
                  </FormTable.Row>
                  <FormTable.Row name="???????????? URL" required={cubeType === CubeType.ELearning}>
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
                  <FormTable.Row name="???/?????? ??????">
                    {!modSuper ? (
                      <span>
                        {classroom.freeOfCharge.freeOfCharge ? `??????` : `??????  ${classroom.freeOfCharge.chargeAmount}`}
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
                            placeholder="?????? ????????? ?????? ???????????? ??????????????????."
                            value={(classroom && classroom.freeOfCharge && classroom.freeOfCharge.chargeAmount) || ''}
                            onChange={(e: any) =>
                              onChangeTargetClassroomProp(index, 'freeOfCharge.chargeAmount', e.target.value)
                            }
                          />
                        ) : null}
                      </Form.Group>
                    )}
                  </FormTable.Row>
                  <FormTable.Row required name="???????????? ???/???">
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
                  <FormTable.Row required name="?????????????????? ??????">
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
                  <FormTable.Row required name="???????????? ??????">
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
                                  '??????',
                                  '???????????? ?????????????????? ???????????? ????????? ???????????????. \n?????? ????????? ?????? ???????????? N?????? ??????????????????.',
                                  '??????',
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
                                  '??????',
                                  '???????????? ?????????????????? ???????????? ????????? ???????????????. \n?????? ????????? ?????? ???????????? N?????? ??????????????????',
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
                  {/*    <FormTable title="????????????"></FormTable>*/}
                  {/*  </div>*/}
                  {/*) : (*/}
                  {/*  <div style={{ display: 'none' }}>*/}
                  {/*    <FormTable title="????????????"></FormTable>*/}
                  {/*  </div>*/}
                  {/*)}*/}
                  <FormTable.Row name="?????? ??????">
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
                  <FormTable.Row required name="???????????????">
                    <ManagerListModalView
                      handleOk={(member) => handleManagerListModalOk(member, index)}
                      buttonName="????????? ??????"
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
