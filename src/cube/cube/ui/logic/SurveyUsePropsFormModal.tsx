import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Button, List, Modal } from 'semantic-ui-react';
import { SurveyFormModel } from '../../../../survey';
import ChoiceResponseView from '../../../../survey/ui/view/ChoiceResponseView';
import CriterionResponseView from '../../../../survey/ui/view/CriterionResponseView';
import EssayResponseView from '../../../../survey/ui/view/EssayResponseView';
import DateResponseView from '../../../../survey/ui/view/DateResponseView';
import BooleanResponseView from '../../../../survey/ui/view/BooleanResponseView';
import MatrixResponseView from '../../../../survey/ui/view/MatrixResponseView';
import { QuestionModel } from '../../../../survey/form/model/QuestionModel';
import { QuestionItemType } from '../../../../survey/form/model/QuestionItemType';
import { CriterionQuestionItems } from '../../../../survey/form/model/CriterionQuestionItems';
import { EssayQuestionItems } from '../../../../survey/form/model/EssayQuestionItems';
import { CriterionModel } from '../../../../survey/form/model/CriterionModel';

interface Props {
  trigger?: React.ReactNode;
  surveyId: string;
  surveyForm: SurveyFormModel;
}

interface States {
  open: boolean;
}

@observer
@reactAutobind
class SurveyUsePropsFormModal extends Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  // componentDidMount(): void {
  //   const { surveyId, surveyFormService } = this.props;
  //   surveyFormService!.findSurveyForm(surveyId);
  // }
  //
  // componentDidUpdate(prevProps: Props): void {
  //   const { surveyId, surveyFormService } = this.props;
  //
  //   if (surveyId !== prevProps.surveyId) {
  //     surveyFormService!.findSurveyForm(surveyId);
  //   }
  // }

  show(open: boolean) {
    //
    this.setState({ open });
  }

  handleCancel() {
    //
    this.show(false);
  }

  createQuestionView(question: QuestionModel, index: number) {
    const { surveyForm } = this.props;

    switch (question.questionItemType) {
      case QuestionItemType.Choice:
        return <ChoiceResponseView key={index} question={question} />;
      case QuestionItemType.Criterion:
        return (
          <CriterionResponseView
            key={index}
            question={question}
            criterion={
              surveyForm.criterionList.find(
                (criterion) => criterion.number === (question.answerItems as CriterionQuestionItems).criterionNumber
              ) || new CriterionModel()
            }
          />
        );
      case QuestionItemType.Essay:
        return (
          <EssayResponseView
            key={index}
            question={question}
            maxLength={(question.answerItems as EssayQuestionItems).maxLength}
          />
        );
      case QuestionItemType.Date:
        return <DateResponseView key={index} question={question} />;
      case QuestionItemType.Boolean:
        return <BooleanResponseView key={index} question={question} />;
      case QuestionItemType.Matrix:
        return <MatrixResponseView key={index} question={question} />;
      default:
        return <React.Fragment key={index}></React.Fragment>;
    }
  }

  render() {
    const { trigger, surveyId } = this.props;
    const { open } = this.state;
    const { surveyForm } = this.props;

    return (
      <Modal
        key={surveyId}
        open={open}
        onOpen={() => this.show(true)}
        onClose={() => this.show(false)}
        trigger={trigger}
        className="base w1000 inner-scroll"
      >
        <Modal.Header className="res">설문조사</Modal.Header>
        <Modal.Content>
          <div className="scrolling-80vh">
            <div className="content-wrap1">
              <List as="ol" className="num-list">
                {(surveyForm &&
                  surveyForm.questions &&
                  surveyForm.questions.length &&
                  surveyForm.questions.map((question, idx) => this.createQuestionView(question, idx))) ||
                  null}
              </List>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions className="actions">
          <Button className="w190 pop d" onClick={() => this.handleCancel()}>
            닫기
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default SurveyUsePropsFormModal;
