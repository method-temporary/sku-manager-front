import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Grid, Input, Radio, Select, Table } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { SelectType, CubeType } from 'shared/model';
import { DepotUtil } from 'shared/ui';
import { Polyglot, FormTable, SubActions, RadioGroup } from 'shared/components';

import FirstCategoryModal from '../logic/FirstCategoryModal';
import SecondCategoryModal from '../logic/SecondCategoryModal';
import { CubeModel } from '../../model/CubeModel';
import CommunityListModal from '../../../community/ui/logic/CommunityListModal';
import Community from '../../../../community/community/model/Community';
import CubeCommunityInfoView from './CubeCommunityInfoView';
import CubeOperationInfoView from './CubeOperationInfoView';
import { getMainCollegeAndChannelText, getSubCollegeAndChannelText } from '../logic/CubeHelper';
import { CubeService } from '../../index';
import { CollegeService } from '../../../../college';
import CubeListIgnoreAccessiblityModal from '../logic/CubeListIgnoreAccessiblityModal';
import { BoardModel } from '../../../board/board/model/BoardModel';
import moment from 'moment';
import { CubeDiscussionModel } from '../../../cubeDiscussion/model/CubeDiscussionModel';
import ContentsProviderSelectContainer from '../../../media/ui/logic/ContentsProviderSelectContainer';
import CubeInstructorInfoView from './CubeInstructorInfoView';
import ManagerListModalView from './ManagerListModal';
import CubeManagerInfoView from './CubeManagerInfoView';
import CubeInstructorModel from '../../CubeInstructorModel';
import { OperatorModel } from '../../../../community/community/model/OperatorModel';
import { MemberViewModel } from '@nara.drama/approval';

interface Props {
  //
  onChangeCubeProps: (name: string, value: any) => void;
  onHandleCommunityModalOk: (community: Community) => void;
  getFileBoxIdForReference: (fileBoxId: string) => void;
  onClickCubeImport: (cubeId: string) => void;
  //
  onChangeCubeDescriptionProps: (name: string, value: any) => void;
  handleCubeBoardChange: (name: string, value: string | boolean) => void;
  onChangeCubeBoardCountProps: (name: string, value: any) => void;
  handleCubeDiscussionChange: (name: string, value: string | boolean) => void;
  onChangeCubeDiscussionCountProps: (name: string, value: string) => void;
  onTextareaChange: (name: string, value: any) => void;
  onChangeTargetInstructor: (instructor: CubeInstructorModel, name: string, value: any) => void;
  onSelectInstructor: (instructor: CubeInstructorModel, name: string, value: boolean) => void;
  onDeleteInstructor: (instructor: CubeInstructorModel) => void;
  setHourAndMinute: (name: string, value: number) => void;
  handleManagerListModalOk: (member: MemberViewModel) => void;
  //
  cubeCommunity: Community;
  cube: CubeModel;
  readonly?: boolean;
  copied?: boolean;
  cubeId: string;
  board: BoardModel;
  cubeDiscussion: CubeDiscussionModel;
  cubeInstructors: CubeInstructorModel[];
  cubeOperator: OperatorModel;
  //
  cubeService: CubeService;
  collegeService: CollegeService;
}

interface States {}

@observer
@reactAutobind
class CubeBasicInfoView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const {
      onChangeCubeProps,
      onHandleCommunityModalOk,
      getFileBoxIdForReference,
      onClickCubeImport,
      onChangeCubeDescriptionProps,
      handleCubeBoardChange,
      onChangeCubeBoardCountProps,
      handleCubeDiscussionChange,
      onChangeCubeDiscussionCountProps,
      onTextareaChange,
      onChangeTargetInstructor,
      onSelectInstructor,
      onDeleteInstructor,
      setHourAndMinute,
      handleManagerListModalOk,
    } = this.props;
    const { cubeCommunity, cube, readonly, cubeId, board, cubeDiscussion, cubeInstructors, cubeOperator } = this.props;
    const { cubeService, collegeService } = this.props;

    const discussionTitle = cube.type !== CubeType.Discussion ? 'Cube ??????' : 'Talk ??????';
    const checkTaskUsingDate = moment(1621501200000);
    const checkTaskUsingAutomaticCompletion =
      cube.registeredTime !== 0 && moment(cube.registeredTime).diff(checkTaskUsingDate, 'days', true) < 0;

    return (
      <>
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="30%" />
            <col width="20%" />
            <col width="30%" />
          </colgroup>

          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={4} className="title-header">
                <Grid className="list-info">
                  <Grid.Row className="padding-0px">
                    <Grid.Column width={8} style={{ color: 'white' }}></Grid.Column>
                    <Grid.Column width={8}>
                      {/* <Grid.Column width={8} style={{ color: 'white' }}>
                      ????????????
                    </Grid.Column> */}
                      {!readonly && (
                        <div className="right">
                          {/* <CubeListIgnoreAccessiblityModal onClickOk={onClickCubeImport} /> */}
                          <Button>Cube ?????? ????????? ?????? Template</Button>
                          <Button>Cube ?????? ????????? ?????? ?????????</Button>
                          <Button>Cube ?????? ????????? ?????? ????????????</Button>
                        </div>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">
                ?????? ?????? ?????? <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell>
                <Polyglot.Languages onChangeProps={onChangeCubeProps} readOnly={readonly} />
              </Table.Cell>
              {/* <Table.Cell className="tb-header">
                ?????? ?????? <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell>
                <Polyglot.Default onChangeProps={onChangeCubeProps} readOnly={readonly} />
              </Table.Cell> */}
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">
                ???????????? <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell colSpan={3}>
                {readonly || cubeId != null ? (
                  <p>{(cube && cube.type) || ''}</p>
                ) : (
                  <>
                    <Form.Field
                      control={Select}
                      placeholder="??????????????? ??????????????????."
                      options={SelectType.learningTypeForEnum3}
                      value={(cube && cube.type) || null}
                      onChange={(e: any, data: any) => {
                        onChangeCubeProps('type', data.value);
                      }}
                    />
                    {/* <span className="span-information">
                      Classroom, E-learning ????????? ??????????????? ?????? ?????? ???????????? ???????????????.
                    </span> */}
                  </>
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">
                {/* <Table.Cell className="tb-header">
                ?????? ?????? <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell colSpan={3}>
                {!readonly && <FirstCategoryModal disabled={readonly} />}
                {getMainCollegeAndChannelText(cubeService, collegeService)}
              </Table.Cell>
            </Table.Row>
            <Table.Row> */}
                {discussionTitle} <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell colSpan={3}>
                {cube && cube.type === CubeType.Cohort ? (
                  <Polyglot.Input
                    languageStrings={cube.name}
                    name="name"
                    onChangeProps={onChangeCubeProps}
                    readOnly={readonly}
                    placeholder="???????????? ??????????????????. (200????????? ????????????)"
                    maxLength="200"
                  />
                ) : (
                  <Polyglot.Input
                    languageStrings={cube.name}
                    name="name"
                    onChangeProps={onChangeCubeProps}
                    placeholder={discussionTitle + '??? ??????????????????. (200????????? ????????????)'}
                    maxLength="200"
                    readOnly={readonly}
                  />
                )}
              </Table.Cell>
            </Table.Row>
            {/* <Table.Row>
              <Table.Cell className="tb-header">
                ???????????? <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell colSpan={3}>
                <Polyglot.Input
                  languageStrings={cube.cubeContents.description.goal}
                  name="cubeContents.description.goal"
                  onChangeProps={onChangeCubeDescriptionProps}
                  placeholder="??????????????? ??????????????????. (300????????? ????????????)"
                  maxLength="300"
                  readOnly={readonly}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">
                ???????????? <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell colSpan={3}>
                <Polyglot.Input
                  languageStrings={cube.cubeContents.description.applicants}
                  name="cubeContents.description.applicants"
                  onChangeProps={onChangeCubeDescriptionProps}
                  placeholder="??????????????? ??????????????????. (300????????? ????????????)"
                  maxLength="300"
                  readOnly={readonly}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">
                {cube.type !== CubeType.Discussion ? '?????? ??????' : 'Talk ??????'} <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell colSpan={3}>
                <Polyglot.Editor
                  name="cubeContents.description.description"
                  languageStrings={cube.cubeContents.description.description}
                  onChangeProps={onChangeCubeDescriptionProps}
                  placeholder="????????? ??????????????????. (3,000????????? ????????????)"
                  maxLength={3000}
                  readOnly={readonly}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">???????????? </Table.Cell>
              <Table.Cell colSpan={3}>
                {cube.type === CubeType.Task && (
                  <FormTable title="" withoutHeader>
                    <> */}
            {/* <Form.Group> */}
            {/* <FormTable.Row name="????????????">
                        {readonly ? (
                          <p>{board.automaticCompletion ? '????????????' : '????????????'}</p>
                        ) : (
                          <React.Fragment>
                            <Form.Group>
                              <Form.Field
                                control={Radio}
                                label="????????????"
                                checked={board.automaticCompletion}
                                onChange={() =>
                                  handleCubeBoardChange('automaticCompletion', !board.automaticCompletion)
                                }
                                disabled={checkTaskUsingAutomaticCompletion}
                              />
                              <Form.Field
                                control={Radio}
                                label="????????????"
                                checked={!board.automaticCompletion}
                                onChange={() => */}
            {/* // console.log('Manual completion') handleCubeBoardChange('automaticCompletion', !board.automaticCompletion) */}
            {/* } */}
            {/* disabled={checkTaskUsingAutomaticCompletion} */}
            {/* /> */}
            {/* </Form.Group>
                            {checkTaskUsingAutomaticCompletion && (
                              <p className="info-text-gray">
                                <strong>
                                  * {checkTaskUsingDate.format('YYYY-MM-DD HH:mm')} ?????? ????????? ?????? ?????? ?????? ?????????.
                                </strong>
                              </p>
                            )}
                            <p className="info-text-gray">- ?????? ????????? ??????, ?????? ????????? ???????????????.</p>
                            <p className="info-text-gray">
                              - ?????? ????????? ??????, [????????????] ???????????? ?????? ????????? ?????????.
                            </p>
                          </React.Fragment>
                        )}
                      </FormTable.Row>
                      {board.automaticCompletion && (
                        <React.Fragment>
                          <FormTable.Row name="Post">
                            {readonly ? (
                              <p>{board.completionCondition.postCount || 0}???</p>
                            ) : (
                              <Form.Group>
                                <Form.Field
                                  control={Input}
                                  width={3}
                                  type="number"
                                  value={board.completionCondition.postCount}
                                  onChange={(e: any, data: any) =>
                                    onChangeCubeBoardCountProps('completionCondition.postCount', data.value)
                                  }
                                  min={0}
                                  disabled={checkTaskUsingAutomaticCompletion}
                                />
                              </Form.Group>
                            )}
                          </FormTable.Row>

                          <FormTable.Row name="Comment">
                            {readonly ? (
                              <p>{board.completionCondition.commentCount || 0}???</p>
                            ) : (
                              <Form.Group>
                                <Form.Field
                                  control={Input}
                                  width={3}
                                  type="number"
                                  value={board.completionCondition.commentCount}
                                  onChange={(e: any, data: any) =>
                                    onChangeCubeBoardCountProps('completionCondition.commentCount', data.value)
                                  }
                                  min={0}
                                  disabled={checkTaskUsingAutomaticCompletion}
                                />{' '}
                              </Form.Group>
                            )}
                          </FormTable.Row>
                        </React.Fragment>
                      )}
                    </>
                  </FormTable>
                )} */}
            {/* <Form.Group> */}
            {/* {cube.type === CubeType.Discussion && (
                  <FormTable title="" withoutHeader>
                    <> */}
            {/* <Form.Group> */}
            {/* <FormTable.Row name="????????????">
                        {readonly ? (
                          <p>{cubeDiscussion.automaticCompletion ? '????????????' : '????????????'}</p>
                        ) : (
                          <React.Fragment>
                            <Form.Group>
                              <Form.Field
                                control={Radio}
                                label="????????????"
                                checked={cubeDiscussion && cubeDiscussion.automaticCompletion}
                                onChange={() => */}
            {/* // console.log('????????????') */}
            {/* handleCubeDiscussionChange('automaticCompletion', !cubeDiscussion.automaticCompletion)
                                }
                              />
                              <Form.Field
                                control={Radio}
                                label="????????????"
                                checked={cubeDiscussion && !cubeDiscussion.automaticCompletion}
                                onChange={() => */}
            {/* // console.log('Manual completion') */}
            {/* handleCubeDiscussionChange('automaticCompletion', !cubeDiscussion.automaticCompletion)
                                }
                              />
                            </Form.Group>
                            <p className="info-text-gray">- ?????? ????????? ??????, ?????? ????????? ???????????????.</p>
                            <p className="info-text-gray">
                              - ?????? ????????? ??????, [????????????] ???????????? ?????? ????????? ?????????.
                            </p>
                          </React.Fragment>
                        )}
                      </FormTable.Row> */}
            {/* {cubeDiscussion && cubeDiscussion.automaticCompletion && (
                        <React.Fragment>
                          <FormTable.Row name="Comment">
                            {readonly ? (
                              <p>
                                {(cubeDiscussion &&
                                  cubeDiscussion.completionCondition &&
                                  cubeDiscussion.completionCondition.commentCount) ||
                                  0}
                                ???
                              </p>
                            ) : (
                              <Form.Group>
                                <Form.Field
                                  control={Input}
                                  width={3}
                                  type="number"
                                  value={
                                    cubeDiscussion &&
                                    cubeDiscussion.completionCondition &&
                                    cubeDiscussion.completionCondition.commentCount
                                  }
                                  onChange={(e: any, data: any) =>
                                    onChangeCubeDiscussionCountProps('completionCondition.commentCount', data.value)
                                  }
                                  min={0}
                                />
                                <Form.Field>???</Form.Field>
                              </Form.Group>
                            )}
                          </FormTable.Row>

                          {cubeDiscussion && !cubeDiscussion.privateComment && (
                            <FormTable.Row name="Comment Reply">
                              {readonly ? (
                                <p>
                                  {(cubeDiscussion &&
                                    cubeDiscussion.completionCondition &&
                                    cubeDiscussion.completionCondition.subCommentCount) ||
                                    0}
                                  ???
                                </p>
                              ) : (
                                <Form.Group>
                                  <Form.Field
                                    control={Input}
                                    width={3}
                                    type="number"
                                    value={
                                      cubeDiscussion &&
                                      cubeDiscussion.completionCondition &&
                                      cubeDiscussion.completionCondition.subCommentCount
                                    }
                                    onChange={(e: any, data: any) =>
                                      onChangeCubeDiscussionCountProps(
                                        'completionCondition.subCommentCount',
                                        data.value
                                      )
                                    }
                                    min={0}
                                  />{' '}
                                  <Form.Field>???</Form.Field>
                                </Form.Group>
                              )}
                            </FormTable.Row>
                          )}
                        </React.Fragment>
                      )} */}
            {/* </Form.Group> */}
            {/* </>
                  </FormTable>
                )}
                <Polyglot.TextArea
                  name="cubeContents.description.completionTerms"
                  languageStrings={cube.cubeContents.description.completionTerms}
                  onChangeProps={onTextareaChange}
                  placeholder="??????????????? ??????????????????(1,000????????? ????????????)"
                  maxLength={1000}
                  readOnly={readonly}
                />
              </Table.Cell>
            </Table.Row> */}
            {/* <Table.Row>
              <Table.Cell className="tb-header">????????????</Table.Cell>
              <Table.Cell colSpan={3}>
                <Polyglot.Editor
                  name="cubeContents.description.guide"
                  languageStrings={cube.cubeContents.description.guide}
                  onChangeProps={onChangeCubeDescriptionProps}
                  placeholder="??????????????? ??????????????????. (1,000????????? ????????????)"
                  maxLength={1000}
                  readOnly={readonly}
                />
              </Table.Cell>
            </Table.Row>
            {cube.type === CubeType.Cohort ? (
              <Table.Row>
                <Table.Cell className="tb-header">Community</Table.Cell>
                <Table.Cell colSpan={3}>
                  {!readonly && <CommunityListModal handleOk={onHandleCommunityModalOk} type="cube" />}
                  {cubeCommunity && cubeCommunity.name && <CubeCommunityInfoView cubeCommunity={cubeCommunity} />}
                </Table.Cell>
              </Table.Row>
            ) : null}
            {cube.type === CubeType.Cohort && cubeCommunity && cubeCommunity.name ? (
              <Table.Row>
                <Table.Cell className="tb-header">????????? ??????</Table.Cell>
                <Table.Cell colSpan={3}>
                  <CubeOperationInfoView cubeCommunity={cubeCommunity} />
                </Table.Cell>
              </Table.Row>
            ) : null}
            {cube.type !== CubeType.Community ? (
              <Table.Row>
                <Table.Cell className="tb-header">????????????</Table.Cell>
                <Table.Cell colSpan={3}>
                  <FileBox
                    fileBoxId={cube && cube.cubeContents && cube.cubeContents.fileBoxId}
                    id={cube && cube.cubeContents && cube.cubeContents.fileBoxId}
                    options={{ readonly }}
                    vaultKey={{
                      keyString: 'sku-depot',
                      patronType: PatronType.Pavilion,
                    }}
                    patronKey={{
                      keyString: 'sku-denizen',
                      patronType: PatronType.Denizen,
                    }}
                    validations={[
                      {
                        type: ValidationType.Extension,
                        validator: DepotUtil.extensionValidatorByDocument,
                      },
                      {
                        type: ValidationType.Duplication,
                        validator: DepotUtil.sizeWithDuplicationValidator,
                      },
                    ]}
                    onChange={getFileBoxIdForReference}
                  />
                  <p className="info-text-gray">- DOC,PDF,EXL,ZIP ????????? ???????????? ??? ????????????.</p>
                  <p className="info-text-gray">- ?????? 20MB ????????? ????????? ???????????? ??? ????????????.</p>
                </Table.Cell>
              </Table.Row>
            ) : null}
            <Table.Row>
              <Table.Cell className="tb-header">
                ???????????? <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell colSpan={3}>
                {readonly ? (
                  <p>{`${parseInt(String(cube.learningTime / 60), 10)}?????? ${parseInt(
                    String(cube.learningTime % 60),
                    10
                  )}???`}</p>
                ) : (
                  <Form.Group>
                    <Form.Field
                      control={Input}
                      placeholder="Select"
                      width={3}
                      type="number"
                      value={parseInt(String(cube.learningTime / 60), 10)}
                      onChange={(e: any, data: any) => setHourAndMinute('hour', data.value)}
                    />
                    <Form.Field>??????</Form.Field>
                    <Form.Field
                      control={Input}
                      placeholder="Select"
                      width={3}
                      type="number"
                      value={parseInt(String(cube.learningTime % 60), 10)}
                      onChange={(e: any, data: any) => setHourAndMinute('minute', data.value)}
                    />
                    <Form.Field>???</Form.Field>
                  </Form.Group>
                )}
              </Table.Cell>
            </Table.Row>
            {cube.type === CubeType.Cohort ? null : (
              <Table.Row>
                <Table.Cell className="tb-header">
                  ?????????<span className="required"> *</span>
                </Table.Cell>
                <Table.Cell colSpan={3}>
                  {readonly ? (
                    <p>{(cube && cube.cubeContents && cube.cubeContents.difficultyLevel) || ''}</p>
                  ) : (
                    <Form.Field
                      control={Select}
                      width={4}
                      placeholder="Select"
                      options={SelectType.difficulty}
                      value={(cube && cube.cubeContents && cube.cubeContents.difficultyLevel) || ''}
                      onChange={(e: any, data: any) =>
                        onChangeCubeDescriptionProps('cubeContents.difficultyLevel', data.value)
                      }
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            )}
            {cube.type === CubeType.Cohort ? null : (
              <Table.Row>
                <Table.Cell className="tb-header">
                  ????????????/?????? <span className="required"> *</span>
                </Table.Cell>
                <Table.Cell colSpan={3}>
                  <ContentsProviderSelectContainer
                    targetProps="cubeContents.organizerId"
                    type="cubeInfo"
                    defaultValue={cube.cubeContents.organizerId}
                    readonly={readonly}
                  />
                </Table.Cell>
              </Table.Row>
            )}
            {cube.type &&
            (cube.type === CubeType.ClassRoomLecture ||
              cube.type === CubeType.Cohort ||
              cube.type === CubeType.ELearning) ? null : (
              <Table.Row>
                <Table.Cell className="tb-header">????????????</Table.Cell>
                <Table.Cell colSpan={3}>
                  <CubeInstructorInfoView
                    onChangeTargetInstructor={onChangeTargetInstructor}
                    onSelectInstructor={onSelectInstructor}
                    onDeleteInstructor={onDeleteInstructor}
                    cubeInstructors={cubeInstructors}
                    readonly={readonly}
                    round={1}
                  />
                </Table.Cell>
              </Table.Row>
            )}
            {cube.type === CubeType.Cohort ? null : (
              <Table.Row>
                <Table.Cell className="tb-header">
                  ????????? ?????? <span className="required"> *</span>
                </Table.Cell>
                <Table.Cell colSpan={3}>
                  <ManagerListModalView
                    handleOk={handleManagerListModalOk}
                    buttonName="????????? ??????"
                    multiSelect={false}
                    readonly={readonly}
                  />
                  <CubeManagerInfoView cubeOperator={cubeOperator} />
                </Table.Cell>
              </Table.Row>
            )}
            <Table.Row>
              <Table.Cell className="tb-header">
                ?????? ?????? ?????? ?????? <span className="required"> *</span>
              </Table.Cell>
              <Table.Cell colSpan={3}>
                {!readonly ? (
                  <Form.Group>
                    <RadioGroup
                      value={cube.cubeContents.mandatory ? 'Yes' : 'No'}
                      values={['Yes', 'No']}
                      onChange={(e: any, data: any) =>
                        onChangeCubeProps('cubeContents.mandatory', data.value === 'Yes' ? true : false)
                      }
                    />
                  </Form.Group>
                ) : cube.cubeContents.mandatory ? (
                  'Yes'
                ) : (
                  'No'
                )}
              </Table.Cell>
            </Table.Row> */}
          </Table.Body>
        </Table>

        {/*<FormTable title="????????????">*/}
        {/*  {(!readonly && cubeId === undefined && (*/}
        {/*    <FormTable.Row required name="????????????">*/}
        {/*      <CubeListIgnoreAccessiblityModal onClickOk={onClickCubeImport} />*/}
        {/*    </FormTable.Row>*/}
        {/*  )) ||*/}
        {/*    null}*/}
        {/*  <FormTable.Row required name="?????? ??????">*/}
        {/*    <Polyglot.Languages onChangeProps={onChangeCubeProps} readOnly={readonly} />*/}
        {/*  </FormTable.Row>*/}
        {/*  <FormTable.Row required name="?????? ??????">*/}
        {/*    <Polyglot.Default onChangeProps={onChangeCubeProps} readOnly={readonly} />*/}
        {/*  </FormTable.Row>*/}
        {/*  <FormTable.Row required name="????????????">*/}
        {/*    {readonly || cubeId != null ? (*/}
        {/*      <p>{(cube && cube.type) || ''}</p>*/}
        {/*    ) : (*/}
        {/*      <Form.Field*/}
        {/*        control={Select}*/}
        {/*        placeholder="??????????????? ??????????????????."*/}
        {/*        options={SelectType.learningTypeForEnum}*/}
        {/*        value={(cube && cube.type) || null}*/}
        {/*        onChange={(e: any, data: any) => {*/}
        {/*          onChangeCubeProps('type', data.value);*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </FormTable.Row>*/}
        {/*  <FormTable.Row required name="?????? ??????">*/}
        {/*    {!readonly && <FirstCategoryModal disabled={readonly} />}*/}
        {/*    {getMainCollegeAndChannelText(cubeService, collegeService)}*/}
        {/*  </FormTable.Row>*/}
        {/*  /!*<FormTable.Row name="?????? ??????">*!/*/}
        {/*  /!*  {!readonly && <SecondCategoryModal disabled={readonly} />}*!/*/}
        {/*  /!*  {getSubCollegeAndChannelText(cubeService, collegeService)}*!/*/}
        {/*  /!*</FormTable.Row>*!/*/}
        {/*  <FormTable.Row required name={discussionTitle}>*/}
        {/*    {cube && cube.type === CubeType.Cohort ? (*/}
        {/*      <Polyglot.Input*/}
        {/*        languageStrings={cube.name}*/}
        {/*        name="name"*/}
        {/*        onChangeProps={onChangeCubeProps}*/}
        {/*        readOnly={readonly}*/}
        {/*        placeholder="???????????? ??????????????????. (200????????? ????????????)"*/}
        {/*        maxLength="200"*/}
        {/*      />*/}
        {/*    ) : (*/}
        {/*      <Polyglot.Input*/}
        {/*        languageStrings={cube.name}*/}
        {/*        name="name"*/}
        {/*        onChangeProps={onChangeCubeProps}*/}
        {/*        placeholder={discussionTitle + '??? ??????????????????. (200????????? ????????????)'}*/}
        {/*        maxLength="200"*/}
        {/*        readOnly={readonly}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </FormTable.Row>*/}
        {/*  <FormTable.Row required name="????????????">*/}
        {/*    <Polyglot.Input*/}
        {/*      languageStrings={cube.cubeContents.description.goal}*/}
        {/*      name="cubeContents.description.goal"*/}
        {/*      onChangeProps={onChangeCubeDescriptionProps}*/}
        {/*      placeholder="??????????????? ??????????????????. (300????????? ????????????)"*/}
        {/*      maxLength="300"*/}
        {/*      readOnly={readonly}*/}
        {/*    />*/}
        {/*  </FormTable.Row>*/}
        {/*  <FormTable.Row required name="????????????">*/}
        {/*    <Polyglot.Input*/}
        {/*      languageStrings={cube.cubeContents.description.applicants}*/}
        {/*      name="cubeContents.description.applicants"*/}
        {/*      onChangeProps={onChangeCubeDescriptionProps}*/}
        {/*      placeholder="??????????????? ??????????????????. (300????????? ????????????)"*/}
        {/*      maxLength="300"*/}
        {/*      readOnly={readonly}*/}
        {/*    />*/}
        {/*  </FormTable.Row>*/}
        {/*  /!* cube.type === CubeType.Discussion *!/*/}
        {/*  <FormTable.Row*/}
        {/*    required={!readonly && cube.type !== CubeType.Discussion}*/}
        {/*    name={cube.type !== CubeType.Discussion ? '?????? ??????' : '?????? ??????'}*/}
        {/*  >*/}
        {/*    <Polyglot.Editor*/}
        {/*      name="cubeContents.description.description"*/}
        {/*      languageStrings={cube.cubeContents.description.description}*/}
        {/*      onChangeProps={onChangeCubeDescriptionProps}*/}
        {/*      placeholder="????????? ??????????????????. (3,000????????? ????????????)"*/}
        {/*      maxLength={3000}*/}
        {/*      readOnly={readonly}*/}
        {/*    />*/}
        {/*  </FormTable.Row>*/}
        {/*  <FormTable.Row name="????????????">*/}
        {/*    {cube.type === CubeType.Task && (*/}
        {/*      <FormTable title="" withoutHeader>*/}
        {/*        <>*/}
        {/*          /!* <Form.Group> *!/*/}
        {/*          <FormTable.Row name="????????????">*/}
        {/*            {readonly ? (*/}
        {/*              <p>{board.automaticCompletion ? '????????????' : '????????????'}</p>*/}
        {/*            ) : (*/}
        {/*              <React.Fragment>*/}
        {/*                <Form.Group>*/}
        {/*                  <Form.Field*/}
        {/*                    control={Radio}*/}
        {/*                    label="????????????"*/}
        {/*                    checked={board.automaticCompletion}*/}
        {/*                    onChange={() => handleCubeBoardChange('automaticCompletion', !board.automaticCompletion)}*/}
        {/*                    disabled={checkTaskUsingAutomaticCompletion}*/}
        {/*                  />*/}
        {/*                  <Form.Field*/}
        {/*                    control={Radio}*/}
        {/*                    label="????????????"*/}
        {/*                    checked={!board.automaticCompletion}*/}
        {/*                    onChange={() =>*/}
        {/*                      // console.log('Manual completion')*/}
        {/*                      handleCubeBoardChange('automaticCompletion', !board.automaticCompletion)*/}
        {/*                    }*/}
        {/*                    disabled={checkTaskUsingAutomaticCompletion}*/}
        {/*                  />*/}
        {/*                </Form.Group>*/}
        {/*                {checkTaskUsingAutomaticCompletion && (*/}
        {/*                  <p className="info-text-gray">*/}
        {/*                    <strong>*/}
        {/*                      * {checkTaskUsingDate.format('YYYY-MM-DD HH:mm')} ?????? ????????? ?????? ?????? ?????? ?????????.*/}
        {/*                    </strong>*/}
        {/*                  </p>*/}
        {/*                )}*/}
        {/*                <p className="info-text-gray">- ?????? ????????? ??????, ?????? ????????? ???????????????.</p>*/}
        {/*                <p className="info-text-gray">- ?????? ????????? ??????, [????????????] ???????????? ?????? ????????? ?????????.</p>*/}
        {/*              </React.Fragment>*/}
        {/*            )}*/}
        {/*          </FormTable.Row>*/}

        {/*          {board.automaticCompletion && (*/}
        {/*            <React.Fragment>*/}
        {/*              <FormTable.Row name="Post">*/}
        {/*                {readonly ? (*/}
        {/*                  <p>{board.completionCondition.postCount || 0}???</p>*/}
        {/*                ) : (*/}
        {/*                  <Form.Group>*/}
        {/*                    <Form.Field*/}
        {/*                      control={Input}*/}
        {/*                      width={3}*/}
        {/*                      type="number"*/}
        {/*                      value={board.completionCondition.postCount}*/}
        {/*                      onChange={(e: any, data: any) =>*/}
        {/*                        onChangeCubeBoardCountProps('completionCondition.postCount', data.value)*/}
        {/*                      }*/}
        {/*                      min={0}*/}
        {/*                      disabled={checkTaskUsingAutomaticCompletion}*/}
        {/*                    />{' '}*/}
        {/*                  </Form.Group>*/}
        {/*                )}*/}
        {/*              </FormTable.Row>*/}

        {/*              <FormTable.Row name="Comment">*/}
        {/*                {readonly ? (*/}
        {/*                  <p>{board.completionCondition.commentCount || 0}???</p>*/}
        {/*                ) : (*/}
        {/*                  <Form.Group>*/}
        {/*                    <Form.Field*/}
        {/*                      control={Input}*/}
        {/*                      width={3}*/}
        {/*                      type="number"*/}
        {/*                      value={board.completionCondition.commentCount}*/}
        {/*                      onChange={(e: any, data: any) =>*/}
        {/*                        onChangeCubeBoardCountProps('completionCondition.commentCount', data.value)*/}
        {/*                      }*/}
        {/*                      min={0}*/}
        {/*                      disabled={checkTaskUsingAutomaticCompletion}*/}
        {/*                    />{' '}*/}
        {/*                  </Form.Group>*/}
        {/*                )}*/}
        {/*              </FormTable.Row>*/}
        {/*            </React.Fragment>*/}
        {/*          )}*/}
        {/*        </>*/}
        {/*      </FormTable>*/}
        {/*    )}*/}

        {/*    /!* <Form.Group> *!/*/}
        {/*    {cube.type === CubeType.Discussion && (*/}
        {/*      <FormTable title="" withoutHeader>*/}
        {/*        <>*/}
        {/*          /!* <Form.Group> *!/*/}
        {/*          <FormTable.Row name="????????????">*/}
        {/*            {readonly ? (*/}
        {/*              <p>{cubeDiscussion.automaticCompletion ? '????????????' : '????????????'}</p>*/}
        {/*            ) : (*/}
        {/*              <React.Fragment>*/}
        {/*                <Form.Group>*/}
        {/*                  <Form.Field*/}
        {/*                    control={Radio}*/}
        {/*                    label="????????????"*/}
        {/*                    checked={cubeDiscussion && cubeDiscussion.automaticCompletion}*/}
        {/*                    onChange={() =>*/}
        {/*                      // console.log('????????????')*/}
        {/*                      handleCubeDiscussionChange('automaticCompletion', !cubeDiscussion.automaticCompletion)*/}
        {/*                    }*/}
        {/*                  />*/}
        {/*                  <Form.Field*/}
        {/*                    control={Radio}*/}
        {/*                    label="????????????"*/}
        {/*                    checked={cubeDiscussion && !cubeDiscussion.automaticCompletion}*/}
        {/*                    onChange={() =>*/}
        {/*                      // console.log('Manual completion')*/}
        {/*                      handleCubeDiscussionChange('automaticCompletion', !cubeDiscussion.automaticCompletion)*/}
        {/*                    }*/}
        {/*                  />*/}
        {/*                </Form.Group>*/}
        {/*                <p className="info-text-gray">- ?????? ????????? ??????, ?????? ????????? ???????????????.</p>*/}
        {/*                <p className="info-text-gray">- ?????? ????????? ??????, [????????????] ???????????? ?????? ????????? ?????????.</p>*/}
        {/*              </React.Fragment>*/}
        {/*            )}*/}
        {/*          </FormTable.Row>*/}

        {/*          {cubeDiscussion && cubeDiscussion.automaticCompletion && (*/}
        {/*            <React.Fragment>*/}
        {/*              <FormTable.Row name="Comment">*/}
        {/*                {readonly ? (*/}
        {/*                  <p>*/}
        {/*                    {(cubeDiscussion &&*/}
        {/*                      cubeDiscussion.completionCondition &&*/}
        {/*                      cubeDiscussion.completionCondition.commentCount) ||*/}
        {/*                      0}*/}
        {/*                    ???*/}
        {/*                  </p>*/}
        {/*                ) : (*/}
        {/*                  <Form.Group>*/}
        {/*                    <Form.Field*/}
        {/*                      control={Input}*/}
        {/*                      width={3}*/}
        {/*                      type="number"*/}
        {/*                      value={*/}
        {/*                        cubeDiscussion &&*/}
        {/*                        cubeDiscussion.completionCondition &&*/}
        {/*                        cubeDiscussion.completionCondition.commentCount*/}
        {/*                      }*/}
        {/*                      onChange={(e: any, data: any) =>*/}
        {/*                        onChangeCubeDiscussionCountProps('completionCondition.commentCount', data.value)*/}
        {/*                      }*/}
        {/*                      min={0}*/}
        {/*                    />*/}
        {/*                    <Form.Field>???</Form.Field>*/}
        {/*                  </Form.Group>*/}
        {/*                )}*/}
        {/*              </FormTable.Row>*/}

        {/*              {cubeDiscussion && !cubeDiscussion.privateComment && (*/}
        {/*                <FormTable.Row name="Comment Reply">*/}
        {/*                  {readonly ? (*/}
        {/*                    <p>*/}
        {/*                      {(cubeDiscussion &&*/}
        {/*                        cubeDiscussion.completionCondition &&*/}
        {/*                        cubeDiscussion.completionCondition.subCommentCount) ||*/}
        {/*                        0}*/}
        {/*                      ???*/}
        {/*                    </p>*/}
        {/*                  ) : (*/}
        {/*                    <Form.Group>*/}
        {/*                      <Form.Field*/}
        {/*                        control={Input}*/}
        {/*                        width={3}*/}
        {/*                        type="number"*/}
        {/*                        value={*/}
        {/*                          cubeDiscussion &&*/}
        {/*                          cubeDiscussion.completionCondition &&*/}
        {/*                          cubeDiscussion.completionCondition.subCommentCount*/}
        {/*                        }*/}
        {/*                        onChange={(e: any, data: any) =>*/}
        {/*                          onChangeCubeDiscussionCountProps('completionCondition.subCommentCount', data.value)*/}
        {/*                        }*/}
        {/*                        min={0}*/}
        {/*                      />{' '}*/}
        {/*                      <Form.Field>???</Form.Field>*/}
        {/*                    </Form.Group>*/}
        {/*                  )}*/}
        {/*                </FormTable.Row>*/}
        {/*              )}*/}
        {/*            </React.Fragment>*/}
        {/*          )}*/}
        {/*          /!* </Form.Group> *!/*/}
        {/*        </>*/}
        {/*      </FormTable>*/}
        {/*    )}*/}
        {/*    <Polyglot.TextArea*/}
        {/*      name="cubeContents.description.completionTerms"*/}
        {/*      languageStrings={cube.cubeContents.description.completionTerms}*/}
        {/*      onChangeProps={onTextareaChange}*/}
        {/*      placeholder="??????????????? ??????????????????(1,000????????? ????????????)"*/}
        {/*      maxLength={1000}*/}
        {/*      readOnly={readonly}*/}
        {/*    />*/}
        {/*  </FormTable.Row>*/}
        {/*  <FormTable.Row name="????????????">*/}
        {/*    <Polyglot.Editor*/}
        {/*      name="cubeContents.description.guide"*/}
        {/*      languageStrings={cube.cubeContents.description.guide}*/}
        {/*      onChangeProps={onChangeCubeDescriptionProps}*/}
        {/*      placeholder="??????????????? ??????????????????. (1,000????????? ????????????)"*/}
        {/*      maxLength={1000}*/}
        {/*      readOnly={readonly}*/}
        {/*    />*/}
        {/*  </FormTable.Row>*/}
        {/*  {cube.type === CubeType.Cohort ? (*/}
        {/*    <FormTable.Row required name="Community">*/}
        {/*      {!readonly && <CommunityListModal handleOk={onHandleCommunityModalOk} type="cube" />}*/}
        {/*      {cubeCommunity && cubeCommunity.name && <CubeCommunityInfoView cubeCommunity={cubeCommunity} />}*/}
        {/*    </FormTable.Row>*/}
        {/*  ) : null}*/}
        {/*  {cube.type === CubeType.Cohort && cubeCommunity && cubeCommunity.name ? (*/}
        {/*    <FormTable.Row required name="????????? ??????">*/}
        {/*      <CubeOperationInfoView cubeCommunity={cubeCommunity} />*/}
        {/*    </FormTable.Row>*/}
        {/*  ) : null}*/}
        {/*  {cube.type !== CubeType.Community ? (*/}
        {/*    <FormTable.Row name="????????????">*/}
        {/*      <FileBox*/}
        {/*        fileBoxId={cube && cube.cubeContents && cube.cubeContents.fileBoxId}*/}
        {/*        id={cube && cube.cubeContents && cube.cubeContents.fileBoxId}*/}
        {/*        options={{ readonly }}*/}
        {/*        vaultKey={{*/}
        {/*          keyString: 'sku-depot',*/}
        {/*          patronType: PatronType.Pavilion,*/}
        {/*        }}*/}
        {/*        patronKey={{*/}
        {/*          keyString: 'sku-denizen',*/}
        {/*          patronType: PatronType.Denizen,*/}
        {/*        }}*/}
        {/*        validations={[*/}
        {/*          {*/}
        {/*            type: ValidationType.Extension,*/}
        {/*            validator: DepotUtil.extensionValidatorByDocument,*/}
        {/*          },*/}
        {/*          {*/}
        {/*            type: ValidationType.Duplication,*/}
        {/*            validator: DepotUtil.sizeWithDuplicationValidator,*/}
        {/*          },*/}
        {/*        ]}*/}
        {/*        onChange={getFileBoxIdForReference}*/}
        {/*      />*/}
        {/*      <p className="info-text-gray">- DOC,PDF,EXL,ZIP ????????? ???????????? ??? ????????????.</p>*/}
        {/*      <p className="info-text-gray">- ?????? 20MB ????????? ????????? ???????????? ??? ????????????.</p>*/}
        {/*    </FormTable.Row>*/}
        {/*  ) : null}*/}
        {/*  <FormTable.Row required name="????????????">*/}
        {/*    {readonly ? (*/}
        {/*      <p>{`${parseInt(String(cube.learningTime / 60), 10)}?????? ${parseInt(*/}
        {/*        String(cube.learningTime % 60),*/}
        {/*        10*/}
        {/*      )}???`}</p>*/}
        {/*    ) : (*/}
        {/*      <Form.Group>*/}
        {/*        <Form.Field*/}
        {/*          control={Input}*/}
        {/*          placeholder="Select"*/}
        {/*          width={3}*/}
        {/*          type="number"*/}
        {/*          value={parseInt(String(cube.learningTime / 60), 10)}*/}
        {/*          onChange={(e: any, data: any) => setHourAndMinute('hour', data.value)}*/}
        {/*        />*/}
        {/*        <Form.Field>??????</Form.Field>*/}
        {/*        <Form.Field*/}
        {/*          control={Input}*/}
        {/*          placeholder="Select"*/}
        {/*          width={3}*/}
        {/*          type="number"*/}
        {/*          value={parseInt(String(cube.learningTime % 60), 10)}*/}
        {/*          onChange={(e: any, data: any) => setHourAndMinute('minute', data.value)}*/}
        {/*        />*/}
        {/*        <Form.Field>???</Form.Field>*/}
        {/*      </Form.Group>*/}
        {/*    )}*/}
        {/*  </FormTable.Row>*/}
        {/*  {cube.type === CubeType.Cohort ? null : (*/}
        {/*    <FormTable.Row required name="?????????">*/}
        {/*      {readonly ? (*/}
        {/*        <p>{(cube && cube.cubeContents && cube.cubeContents.difficultyLevel) || ''}</p>*/}
        {/*      ) : (*/}
        {/*        <Form.Field*/}
        {/*          control={Select}*/}
        {/*          width={4}*/}
        {/*          placeholder="Select"*/}
        {/*          options={SelectType.difficulty}*/}
        {/*          value={(cube && cube.cubeContents && cube.cubeContents.difficultyLevel) || ''}*/}
        {/*          onChange={(e: any, data: any) =>*/}
        {/*            onChangeCubeDescriptionProps('cubeContents.difficultyLevel', data.value)*/}
        {/*          }*/}
        {/*        />*/}
        {/*      )}*/}
        {/*    </FormTable.Row>*/}
        {/*  )}*/}
        {/*  {cube.type === CubeType.Cohort ? null : (*/}
        {/*    <FormTable.Row required name="????????????/??????">*/}
        {/*      <ContentsProviderSelectContainer*/}
        {/*        targetProps="cubeContents.organizerId"*/}
        {/*        type="cubeInfo"*/}
        {/*        defaultValue={cube.cubeContents.organizerId}*/}
        {/*        readonly={readonly}*/}
        {/*      />*/}
        {/*    </FormTable.Row>*/}
        {/*  )}*/}
        {/*  {cube.type &&*/}
        {/*  (cube.type === CubeType.ClassRoomLecture ||*/}
        {/*    cube.type === CubeType.Cohort ||*/}
        {/*    cube.type === CubeType.ELearning) ? null : (*/}
        {/*    <FormTable.Row name="????????????">*/}
        {/*      <CubeInstructorInfoView*/}
        {/*        onChangeTargetInstructor={onChangeTargetInstructor}*/}
        {/*        onSelectInstructor={onSelectInstructor}*/}
        {/*        onDeleteInstructor={onDeleteInstructor}*/}
        {/*        cubeInstructors={cubeInstructors}*/}
        {/*        readonly={readonly}*/}
        {/*        round={1}*/}
        {/*      />*/}
        {/*    </FormTable.Row>*/}
        {/*  )}*/}
        {/*  {cube.type === CubeType.Cohort ? null : (*/}
        {/*    <FormTable.Row required name="????????? ??????">*/}
        {/*      <ManagerListModalView*/}
        {/*        handleOk={handleManagerListModalOk}*/}
        {/*        buttonName="????????? ??????"*/}
        {/*        multiSelect={false}*/}
        {/*        readonly={readonly}*/}
        {/*      />*/}
        {/*      <CubeManagerInfoView cubeOperator={cubeOperator} />*/}
        {/*    </FormTable.Row>*/}
        {/*  )}*/}
        {/*</FormTable>*/}
      </>
    );
  }
}

export default CubeBasicInfoView;
