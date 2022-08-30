import React from 'react';
import { inject, observer } from 'mobx-react';
import { mobxHelper, reactAutobind, reactAlert } from '@nara.platform/accent';

import { Button, List, Modal } from 'semantic-ui-react';
import SurveyCaseService from '../../event/present/logic/SurveyCaseService';
import SurveyFormService from '../../form/present/logic/SurveyFormService';
import AnswerSheetService from '../../answer/present/logic/AnswerSheetService';

import ShortAnswerView from '../view/answer/ShortAnswerView';
import EssayView from '../view/answer/EssayView';
import SingleChoiceView from '../view/answer/SingleChoiceView';
import MultiChoiceView from '../view/answer/MultiChoiceView';
import { AnswerItemModel } from '../../answer/model/AnswerItemModel';
import { CriterionModel } from '../../form/model/CriterionModel';
import { QuestionItemType } from '../../form/model/QuestionItemType';
import { EssayQuestionItems } from '../../form/model/EssayQuestionItems';
import { CriterionQuestionItems } from '../../form/model/CriterionQuestionItems';
import { ChoiceQuestionItems } from '../../form/model/ChoiceQuestionItems';
import { DateQuestionItems } from '../../form/model/DateQuestionItems';
import { BooleanQuestionItems } from '../../form/model/BooleanQuestionItems';
import { MatrixQuestionItems } from '../../form/model/MatrixQuestionItems';
import CriterionView from '../view/answer/CriterionView';
import DateView from '../view/answer/DateView';
import BooleanView from '../view/answer/BooleanView';
import MatrixView from '../view/answer/MatrixView';
import { Image } from 'semantic-ui-react';
import { ReviewQuestionItems } from 'survey/form/model/ReviewQuestionItems';
import { ChoiceFixedQuestionItems } from 'survey/form/model/ChoiceFixedQuestionItems';

interface Props {
  surveyCaseService?: SurveyCaseService;
  surveyFormService?: SurveyFormService;
  surveyAnswerSheetService?: AnswerSheetService;

  surveyId: string;
  surveyCaseId: string;
  denizenKey: string;
  trigger?: React.ReactNode;
}

interface States {
  open: boolean;
}

@inject(mobxHelper.injectFrom('surveyCaseService', 'surveyFormService', 'surveyAnswerSheetService'))
@observer
@reactAutobind
export class AnswerSheetModalContainer extends React.Component<Props, States> {
  //
  state = {
    open: false,
  };

  onOpenModal() {
    //
    this.init().then((success: boolean) => {
      if (success) this.setState({ open: true });
    });
  }

  onCloseModal() {
    this.setState(
      {
        open: false,
      },
      this.clear
    );
  }

  async init() {
    const {
      surveyCaseService,
      surveyFormService,
      surveyAnswerSheetService,
      surveyId,
      surveyCaseId,
      denizenKey,
    } = this.props;

    if (surveyId && surveyCaseId) {
      return surveyAnswerSheetService!.findAnswerSheet(surveyCaseId, denizenKey).then(() => {
        if (!surveyAnswerSheetService!.answerSheet || !surveyAnswerSheetService!.answerSheet.id) {
          reactAlert({
            title: '알림',
            message: '설문을 등록하지 않은 수강생입니다.',
            onClose: this.onCloseModal,
          });
          return false;
        }
        surveyCaseService!.findSurveyCase(surveyCaseId);
        surveyFormService!.findSurveyForm(surveyId);
        return true;
      });
    }
    return false;
  }

  clear() {
    const { surveyCaseService, surveyFormService, surveyAnswerSheetService } = this.props;

    surveyAnswerSheetService!.clear();
    surveyCaseService!.clear();
    surveyFormService!.clear();
  }

  render() {
    //
    const { open } = this.state;
    const { surveyFormService, surveyAnswerSheetService, trigger } = this.props;
    const { surveyForm } = surveyFormService!;
    const { answerMap } = surveyAnswerSheetService!;
    const { questions, criterionList } = surveyForm!;

    return (
      <Modal
        open={open}
        onOpen={this.onOpenModal}
        onClose={this.onCloseModal}
        trigger={trigger}
        className="base w1000 inner-scroll"
      >
        <Modal.Header className="res">{surveyForm && surveyForm.title}</Modal.Header>
        <Modal.Content>
          <div className="scrolling-80vh">
            <div className="content-wrap1">
              <List as="ol" className="num-list">
                {(questions &&
                  questions.length &&
                  questions.map((question) => {
                    let answerArea = null;
                    const answer = answerMap.get(question.sequence.toSequenceString()) || new AnswerItemModel();
                    const answerItems = question.answerItems;
                    const isRequired = !question.optional;

                    switch (question.questionItemType) {
                      case QuestionItemType.Essay:
                        if (answerItems instanceof EssayQuestionItems) {
                          if (answerItems.maxLength <= 100) {
                            answerArea = <ShortAnswerView answer={answer} question={question} />;
                          } else {
                            answerArea = <EssayView answer={answer} question={question} />;
                          }
                        }

                        break;
                      case QuestionItemType.Choice:
                        if (answerItems instanceof ChoiceQuestionItems) {
                          if (answerItems.multipleChoice) {
                            answerArea = (
                              <MultiChoiceView question={question} answer={answer} items={answerItems.items || []} />
                            );
                          } else {
                            answerArea = (
                              <SingleChoiceView question={question} answer={answer} items={answerItems.items || []} />
                            );
                          }
                        }

                        break;
                      case QuestionItemType.Criterion:
                        if (answerItems instanceof CriterionQuestionItems) {
                          const index = criterionList
                            .map((criterion) => criterion.number)
                            .findIndex((number) => number === answerItems.criterionNumber);
                          const criterion = index >= 0 ? criterionList[index] : new CriterionModel();
                          answerArea = (
                            <CriterionView question={question} answer={answer} items={criterion.criteriaItems || []} />
                          );
                        }
                        break;
                      case QuestionItemType.Date:
                        if (answerItems instanceof DateQuestionItems) {
                          answerArea = <DateView answer={answer} question={question} />;
                        }

                        break;
                      case QuestionItemType.Boolean:
                        if (answerItems instanceof BooleanQuestionItems) {
                          answerArea = <BooleanView answer={answer} question={question} />;
                        }

                        break;
                      case QuestionItemType.Matrix:
                        if (answerItems instanceof MatrixQuestionItems) {
                          answerArea = (
                            <MatrixView
                              question={question}
                              answer={answer}
                              rowItems={answerItems.rowItems}
                              columnItems={answerItems.columnItems}
                            />
                          );
                        }

                        break;
                      case QuestionItemType.Review:
                        if (answerItems instanceof ReviewQuestionItems) {
                          answerArea = (
                            <>
                              <SingleChoiceView question={question} answer={answer} items={answerItems.items || []} />
                              <EssayView answer={answer} question={question} />
                            </>
                          );
                        }

                        break;
                      case QuestionItemType.ChoiceFixed:
                        if (answerItems instanceof ChoiceFixedQuestionItems) {
                          answerArea = (
                            <>
                              <SingleChoiceView question={question} answer={answer} items={answerItems.items || []} />
                            </>
                          );
                        }

                        break;
                    }
                    return (
                      <List.Item as="li" key={question.sequence.toSequenceString()}>
                        <div className="ol-title" style={{ lineHeight: '25px' }}>
                          {question.sentence}
                          {isRequired === true && (
                            <span className="importantBtn">
                              <Image
                                style={{
                                  display: 'inline-block',
                                  marginLeft: '7px',
                                  verticalAlign: 'text-top',
                                }}
                                src={`${process.env.PUBLIC_URL}/images/modal/survey-important.png`}
                              />
                            </span>
                          )}
                        </div>
                        <div className="ol-answer">{answerArea}</div>
                      </List.Item>
                    );
                  })) ||
                  null}
              </List>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions className="actions">
          <Button className="w190 pop d" onClick={this.onCloseModal}>
            닫기
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AnswerSheetModalContainer;
