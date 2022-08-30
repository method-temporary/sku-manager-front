import React from 'react';
import { Button } from 'semantic-ui-react';

interface Props {
  onRemoveSurveyForm?: () => void;
  onBackToList: () => void;
  onSaveSurveyForm?: () => void;
  onConfirmSurveyForm?: () => void;
}

class ButtonGroup extends React.Component<Props> {
  render() {
    const { onBackToList, onRemoveSurveyForm, onSaveSurveyForm, onConfirmSurveyForm } = this.props;

    return (
      <div className="btn-group">
        {onRemoveSurveyForm && (
          <Button onClick={onRemoveSurveyForm} type="button">
            삭제
          </Button>
        )}
        <div className="fl-right">
          <Button basic onClick={onBackToList}>
            목록
          </Button>
          {onSaveSurveyForm && (
            <Button primary onClick={onSaveSurveyForm}>
              저장
            </Button>
          )}
          {onConfirmSurveyForm && (
            <Button primary onClick={onConfirmSurveyForm}>
              양식확정
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default ButtonGroup;
