import React from 'react';
import { observer } from 'mobx-react';
import { MemberViewModel } from '@nara.drama/approval';
import { Button, Form, Icon, Grid, Input, Select, Table, Checkbox } from 'semantic-ui-react';
import dayjs from 'dayjs';

import { GroupBasedAccessRuleModel, SelectType, YesNo } from 'shared/model';
import { alert, AlertModel, confirm, ConfirmModel, FormTable, Polyglot, RadioGroup } from 'shared/components';
import { getPolyglotToAnyString, getPolyglotToString } from 'shared/components/Polyglot';
import { AccessRuleService } from 'shared/present';

import { DifficultyLevel } from '_data/lecture/cards/model/vo/DifficultyLevel';

import { useUserGroupMap } from 'usergroup/group/present/logic/usergroup.util';
import ManagerListModal from 'cube/cube/ui/view/ManagerListModal';
import { useFindColleges } from 'college/College.hook';
import CollegeSelectedModal from 'college/shared/components/collegeSelectedModal/CollegeSelectedModal';
import { ChannelWithAnotherInfo } from 'college/shared/components/collegeSelectedModal/model/ChannelWithAnotherInfo';

import { CardOperator } from '../model/vo';

import CardDetailStore from '../../../detail/CardDetail.store';
import { displayChannelToTable } from '../../../shared/utiles';
import CardSelectModal from '../../../shared/components/cardSelectModal/CardSelectModal';
import { CardWithAccessAndOptional } from '../../../shared/components/cardSelectModal/model/CardWithAccessAndOptional';

import {
  convertCardCategory,
  makeSubCategoryDisplay,
  onChangeCardCreatePolyglot,
  setCardCreateByCopyCard,
} from '../../CardCreate.util';
import CardCreateStore from '../../CardCreate.store';

import { CardCategoryWithInfo } from '../model/CardCategoryWithInfo';
import { CardModel, CardService } from 'card/card';

import { cardStateDisplay } from '../../../card/ui/logic/CardHelper';

import LearningPlanOrderRow from '../../learning/learningPlan/LearningPlanOrderRow';
import { CardInstructorListRow } from '../../learning/learningPlan/CardInstructorListRow';
import { LearningTimeRow } from '../../learning/learningPlan/LearningTimeRow';
import LearningContents from '../../learning/learningPlan/LearningContents/LearningContents';

import { getInitReportFileBox, ReportFileBox } from '_data/lecture/cards/model/vo';

import SurveyModal from 'cube/cube/ui/logic/SurveyModal';
import { ExamPaperModel } from 'exam/model/ExamPaperModel';
import { SurveyFormModel, SurveyFormService, SurveyListModal } from 'survey';

import ReportModal from '../../../shared/components/reportModal/ReportModal';
import TestModal from '../../../shared/components/testModal/TestModal';
import ReportList from '../../../shared/components/reportModal/components/ReportList';

import { convertExamPaper, getReportFileBox, resetSurvey, setReportFileBox, setSurvey } from '../../CardCreate.util';
import { TestWithViewInfo } from '../model/TestWithViewInfo';
import TestList from './TestLIst';

import CubeListIgnoreAccessiblityModal from '../../../../cube/cube/ui/logic/CubeListIgnoreAccessiblityModal';

import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { DepotUtil } from 'shared/ui';

import CommunityListModal from 'cube/community/ui/logic/CommunityListModal';

import RelatedCard from './RelatedCard';
import CommunityList from './CommunityList';

import DatePicker from 'react-datepicker';
import LearningStore from '../../learning/Learning.store';
import { DEFAULT_DATE_FORMAT } from '../../../../_data/shared';

interface Props {
  //
  readonly?: boolean;
}

const stamp = [
  { key: '0', text: 'Yes', value: true },
  { key: '1', text: 'No', value: false },
];

const CardBaicInfoApprovalDetail = observer(({ readonly }: Props) => {
  //
  const {
    copyCard,
    searchable,
    name,
    simpleDescription,
    description,
    mainCategory,
    subCategories,
    hasStamp,
    stampCount,
    hasPrerequisite,
    prerequisiteCards,
    cardOperator,
    difficultyLevel,
    mandatory,
    setCopyCard,
    setSearchable,
    setMainCategory,
    setSubCategories,
    setHasStamp,
    setStampCount,
    setHasPrerequisite,
    setPrerequisiteCards,
    setCardOperator,
    setDifficultyLevel,
    setMandatory,
  } = CardCreateStore.instance;

  const { registeredTime, registrantName, approvalInfo, cardState } = CardDetailStore.instance;
  const { groupBasedAccessRule } = AccessRuleService.instance;

  const groupAccessRoles = GroupBasedAccessRuleModel.asGroupBasedAccessRule(groupBasedAccessRule);

  const { data: Colleges } = useFindColleges();
  const userGroupMap = useUserGroupMap();

  const mainChannel = convertCardCategory(mainCategory);

  const subChannels = subCategories.map((cardCategory) => convertCardCategory(cardCategory));

  const onSelectOperator = (member: MemberViewModel) => {
    //
    setCardOperator({
      id: member.id,
      email: member.email,
      name: member.name,
      companyCode: member.companyCode,
      companyName: member.companyName,
    } as CardOperator);
  };

  const onOkChannel = (channels: ChannelWithAnotherInfo[], isSubChannel: boolean) => {
    //
    if (isSubChannel) {
      // ?????? ????????? ??????
      setSubCategories(channels.map((channel) => getCardCategoryByChannel(channel)));
    } else {
      // ?????? ????????? ??????
      const mainChannel = channels[0];
      setMainCategory(getCardCategoryByChannel(mainChannel));
      // ?????? ?????? ????????? ????????? ?????? ????????? ???????????? ?????? ???????????? ?????????
      if (mainChannel.parentId === '') {
        // 1 Depth ??? ???
        const hasMainInSub = subCategories.some((category) => category.channelId === mainChannel.id);

        // ????????? Channel ??? Sub ?????? ?????? ?????? ???
        if (hasMainInSub) {
          setSubCategories(
            subCategories.filter((category) => category.channelId !== mainChannel.id).map((category) => category)
          );
        }
      } else {
        // 2 Depth ??? ???
        let nextSubCategories: CardCategoryWithInfo[] = subCategories.slice();
        const hasMainInSub = subCategories.some((category) => category.twoDepthChannelId === mainChannel.id);

        if (hasMainInSub) {
          // ????????? Channel Sub ?????? ??????
          nextSubCategories = nextSubCategories
            .filter((category) => category.twoDepthChannelId !== mainChannel.id)
            .map((category) => category);

          // ????????? Channel ??? 1 Depth ??? ?????? 2 Depth Channel ??? ????????? 1 Depth ??? ????????????.
          const hasAnotherSub = nextSubCategories.some(
            (category) =>
              category.channelId === mainChannel.parentId &&
              category.twoDepthChannelId !== mainChannel.id &&
              category.twoDepthChannelId !== ''
          );

          if (!hasAnotherSub) {
            // ????????? Channel ??? 1 Depth ??????
            nextSubCategories = nextSubCategories
              .filter((category) => category.channelId !== mainChannel.parentId)
              .map((category) => category);
          }
        }

        setSubCategories(nextSubCategories);
      }
    }
  };

  const getCardCategoryByChannel = (channel: ChannelWithAnotherInfo) => {
    //
    return {
      twoDepthChannelId: channel.parentId ? channel.id : channel.twoDepthChannelId,
      mainCategory: channel.mainCategory,
      channelId: channel.parentId ? channel.parentId : channel.id,
      parentId: channel.parentId,
      displayOrder: channel.displayOrder,
      name: channel.name,
      collegeId: channel.collegeId,
    } as CardCategoryWithInfo;
  };

  const onChangeHasPrerequisite = (value: YesNo) => {
    //
    if (value === 'No' && prerequisiteCards.length > 0) {
      confirm(
        ConfirmModel.getCustomConfirm(
          '???????????? ?????? ??????',
          '????????? ??????????????? ???????????????. ?????????????????????????',
          false,
          '??????',
          '??????',
          () => {
            setPrerequisiteCards([]);
            setHasPrerequisite(value);
          }
        )
      );
    } else {
      setHasPrerequisite(value);
    }
  };

  const onOkCopy = (selectedCards: CardWithAccessAndOptional[]) => {
    //
    const selectedCard = selectedCards[0];

    setCopyCard(selectedCard);
    setCardCreateByCopyCard(selectedCard, userGroupMap);
  };

  const { report, reportName, surveyId, surveyTitle, surveyDesignerName, tests, setTests } = CardCreateStore.instance;

  const examPapers = tests.map((test) => convertExamPaper(test));

  const onReportOk = (reportFileBox: ReportFileBox) => {
    //
    setReportFileBox(reportFileBox);
  };

  const onSurveyOk = (selectedSurveyForm: SurveyFormModel) => {
    //
    setSurvey(selectedSurveyForm);
  };

  const onSurveyDelete = (event: any) => {
    //
    event.stopPropagation();
    resetSurvey();
    SurveyFormService.instance.clearSurveyFormProps();
  };

  const onClickSurvey = async () => {
    //
    await SurveyFormService.instance.findSurveyForm(surveyId);
  };

  const onClickExamOk = (selectedExams: ExamPaperModel[]) => {
    //
    setTests(
      selectedExams.map(
        (examPaper) =>
          ({
            paperId: examPaper.id,
            examTitle: examPaper.title,
            successPoint: examPaper.successPoint,
            totalPoint: examPaper.totalPoint,
            questionSelectionType: examPaper.questionSelectionType,
          } as TestWithViewInfo)
      )
    );
  };

  const onTestDelete = (paperId: String) => {
    //
    setTests(tests.filter((test) => test.paperId !== paperId).map((test) => test));
  };

  const {
    fileBoxId,
    pisAgreementRequired,
    pisAgreementTitle,
    pisAgreementDepotId,
    setFileBoxId,
    setPisAgreementRequired,
    setCommunityId,
    setCommunityName,
  } = CardCreateStore.instance;

  const { restrictLearningPeriod, setRestrictLearningPeriod, learningPeriod, setLearningPeriod } =
    LearningStore.instance;

  const onChangeStartDate = async (date: Date) => {
    //
    const newPeriod = { ...learningPeriod };
    newPeriod.startDate = dayjs(date).format(DEFAULT_DATE_FORMAT);

    const startTime = date.getTime();
    const endDay = dayjs(newPeriod.endDate);
    if (startTime > endDay.toDate().getTime()) {
      newPeriod.endDate = dayjs(date).add(1, 'month').format(DEFAULT_DATE_FORMAT);
    }

    setLearningPeriod(newPeriod);
  };

  const onChangeEndDate = (date: Date) => {
    //
    const newPeriod = { ...learningPeriod };
    newPeriod.endDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
    setLearningPeriod(newPeriod);
  };

  return (
    <Table celled>
      <colgroup>
        <col width="16%" />
        <col width="12%" />
        <col width="12%" />
        <col width="12%" />
        <col width="12%" />
        <col width="12%" />
        <col width="12%" />
        <col width="12%" />
      </colgroup>

      <Table.Body>
        {!readonly && (
          <>
            <Table.Row>
              <Table.Cell className="tb-header">?????? ?????? ??????</Table.Cell>
              <Table.Cell>
                <Polyglot.Languages onChangeProps={onChangeCardCreatePolyglot} readOnly={readonly} />
              </Table.Cell>
            </Table.Row>
          </>
        )}
        {readonly && (
          <>
            <Table.Row>
              <Table.Cell className="tb-header">?????????</Table.Cell>
              <Table.Cell colSpan={2} className="tb-header">
                {getPolyglotToAnyString(registrantName)}
              </Table.Cell>
              <Table.Cell colSpan={2} className="tb-header">
                ??????(??????)??????
              </Table.Cell>
              <Table.Cell colSpan={3} className="tb-header">{`${dayjs(registeredTime).format(
                'YYYY.MM.DD'
              )} `}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">??????</Table.Cell>
              <Table.Cell claSpan={1} className="tb-header">
                {' '}
              </Table.Cell>
              <Table.Cell claSpan={1} className="tb-header">
                OC
              </Table.Cell>
              <Table.Cell claSpan={1} className="tb-header">
                {' '}
              </Table.Cell>
              <Table.Cell claSpan={1} className="tb-header">
                ??????
              </Table.Cell>
              <Table.Cell claSpan={1} className="tb-header">
                {' '}
              </Table.Cell>
              <Table.Cell claSpan={1} className="tb-header">
                ??????
              </Table.Cell>
              <Table.Cell claSpan={1} className="tb-header">
                {' '}
              </Table.Cell>
            </Table.Row>
          </>
        )}
        <Table.Row>
          <Table.Cell className="tb-header">
            {/* qkrxogh */}
            Card ?????? <span className="required"> *</span>
          </Table.Cell>
          <Table.Cell colSpan={7}>
            {!readonly ? (
              <Form.Group>
                <RadioGroup
                  value={searchable}
                  values={['Yes', 'No']}
                  labels={['?????????', '?????????']}
                  onChange={(e: any, data: any) => setSearchable(data.value)}
                />
              </Form.Group>
            ) : (
              <>{searchable === 'Yes' ? '?????????' : '?????????'}</>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">
            Card??? <span className="required"> *</span>
          </Table.Cell>
          <Table.Cell colSpan={2}>
            <Polyglot.Input
              readOnly={readonly}
              languageStrings={name}
              name="name"
              onChangeProps={onChangeCardCreatePolyglot}
              placeholder="????????? ??????????????????. (?????? 200????????? ????????????)"
              maxLength="200"
            />
          </Table.Cell>
          <Table.Cell colSpan={2} className="tb-header">
            ??????????????????
          </Table.Cell>
          <Table.Cell colSpan={3} className="tb-header">
            500???
          </Table.Cell>
        </Table.Row>

        <LearningContents readonly={readonly} />

        <FormTable.Row name="Test">
          {!readonly && <TestModal onOk={onClickExamOk} examPapers={examPapers} />}
          {tests.length > 0 && <TestList readonly={readonly} tests={tests} onTestDelete={onTestDelete} />}
        </FormTable.Row>

        <Table.Row>
          <Table.Cell>
            <span className="tb-header">????????????</span>
          </Table.Cell>
          <Table.Cell>
            <Form.Field
              cloSpan={7}
              control={Checkbox}
              label="?????? ?????? ??????(Y/N)"
              checked={pisAgreementRequired}
              onChange={(_: any, data: any) => setPisAgreementRequired(data.checked)}
              disabled={readonly}
            />
            {pisAgreementRequired && (
              <Polyglot.PisAgreement
                name="pisAgreementDepotId"
                titleName="pisAgreementTitle"
                onChangeProps={onChangeCardCreatePolyglot}
                languageStrings={pisAgreementDepotId}
                titleLanguageStrings={pisAgreementTitle}
                validations={[
                  {
                    type: ValidationType.Duplication,
                    validator: DepotUtil.duplicationValidator,
                  },
                  {
                    type: ValidationType.Extension,
                    validator: DepotUtil.extensionValidatorPDF,
                  },
                  {
                    type: ValidationType.Duplication,
                    validator: DepotUtil.multiFileValidator,
                  },
                ]}
                desc={<p className="info-text-gray">- PDF ?????? 1??? ??? ???????????? ??? ????????????.</p>}
                readOnly={readonly}
              />
            )}
          </Table.Cell>
        </Table.Row>

        <FormTable.Row name="Survey ??????">
          {!readonly && <SurveyListModal handleOk={onSurveyOk} type="card" />}
          {surveyId ? (
            <Table celled>
              <Table.Header>
                <Table.Row>
                  {!readonly && <Table.HeaderCell textAlign="center" />}
                  <Table.HeaderCell textAlign="center">??????</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">?????????</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <SurveyModal
                surveyId={surveyId}
                trigger={
                  <Table.Row className="pointer" onClick={() => onClickSurvey()}>
                    {!readonly && (
                      <Table.Cell>
                        <Button icon size="mini" basic onClick={(event) => onSurveyDelete(event)}>
                          <Icon name="minus" />
                        </Button>
                      </Table.Cell>
                    )}
                    <Table.Cell>{surveyTitle}</Table.Cell>
                    <Table.Cell>{surveyDesignerName}</Table.Cell>
                  </Table.Row>
                }
              />
            </Table>
          ) : null}
        </FormTable.Row>
        <FormTable.Row name="??????">
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center" />
                <Table.HeaderCell colSpan={5} textAlign="center">
                  ??????
                </Table.HeaderCell>
                <Table.HeaderCell colSpan={2} textAlign="center">
                  ?????????
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        </FormTable.Row>

        <FormTable.Row name="?????? ?????????">
          {!readonly ? (
            <Form.Group>
              <Form.Field
                control={Checkbox}
                label="?????? ?????????"
                checked={restrictLearningPeriod}
                onChange={(_: any, data: any) => setRestrictLearningPeriod(data.checked)}
              />
            </Form.Group>
          ) : (
            <>{`${dayjs(learningPeriod.startDate).format('YYYY-MM-DD')}`}</>
          )}
        </FormTable.Row>

        <FormTable.Row name="?????? ?????????">
          {!readonly ? (
            <Form.Group>
              <Form.Field
                control={Checkbox}
                label="?????? ?????????"
                checked={restrictLearningPeriod}
                onChange={(_: any, data: any) => setRestrictLearningPeriod(data.checked)}
              />
            </Form.Group>
          ) : (
            <>{`${dayjs(learningPeriod.endDate).format('YYYY-MM-DD')}`}</>
          )}
        </FormTable.Row>
      </Table.Body>
    </Table>
  );
});

export default CardBaicInfoApprovalDetail;
