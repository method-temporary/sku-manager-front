import { QuestionSelectionType } from '../../model/QuestionSelectionType';
import { Icon, Popup } from 'semantic-ui-react';
import React from 'react';

interface TestSelectionQuestionPopUpProps {
  questionSelectionType: QuestionSelectionType;
}

export const TestSelectionQuestionPopUp = ({ questionSelectionType }: TestSelectionQuestionPopUpProps) => {
  return (
    <Popup trigger={<Icon className="exclamation circle" size="large" color="blue" />} on="click" hideOnScroll wide>
      {questionSelectionType === QuestionSelectionType.ALL && (
        <>
          <Popup.Header className="center">문항 순서 셔플</Popup.Header>
          <Popup.Content>체크 시 전체 문항 순서가 셔플됩니다.</Popup.Content>
        </>
      )}

      {questionSelectionType === QuestionSelectionType.BY_GROUP && (
        <>
          <Popup.Header className="center">그룹 점수</Popup.Header>
          <Popup.Content>
            그룹 별 점수를 차등으로 설정하며 그룹 별로 점수가 일괄 적용 됩니다. <br />1 ~ 100 이하의 점수를 설정합니다.
          </Popup.Content>
          <hr className="contour" />
          <Popup.Header className="center">그룹 출제 문항 수</Popup.Header>
          <Popup.Content>최소 필수 문항 수 이상 ~ 최대 그룹 문항 수 이하의 문항수를 설정합니다.</Popup.Content>
        </>
      )}

      {questionSelectionType === QuestionSelectionType.FIXED_COUNT && (
        <>
          <Popup.Header className="center">점수 설정</Popup.Header>
          <Popup.Content>
            문항 별로 점수가 일괄 적용됩니다. <br />1 ~ 100 이하의 점수를 설정합니다.
          </Popup.Content>
        </>
      )}
    </Popup>
  );
};

export const TestSelectionResultPopUp = ({ questionSelectionType }: TestSelectionQuestionPopUpProps) => {
  return (
    <Popup
      trigger={<Icon className="exclamation circle" size="large" color="blue" />}
      on="click"
      hideOnScroll
      position="top right"
      wide
    >
      {questionSelectionType === QuestionSelectionType.ALL && (
        <>
          <Popup.Header className="center">출제 문항 수</Popup.Header>
          <Popup.Content className="left">모두 출제 방식은 등록된 전체 문항이 출제됩니다.</Popup.Content>
        </>
      )}

      {questionSelectionType === QuestionSelectionType.BY_GROUP && (
        <>
          <Popup.Header className="center">출제 문항 수</Popup.Header>
          <Popup.Content className="left">그룹 셔플 방식은 설정한 그룹 출제 문항 수대로 출제됩니다.</Popup.Content>
        </>
      )}

      {questionSelectionType === QuestionSelectionType.FIXED_COUNT && (
        <>
          <Popup.Header className="center">출제 문항 수</Popup.Header>
          <Popup.Content className="left">
            선택 셔플 방식은 설정한 문항 수대로 출제됩니다. <br />
            최소 필수 문항 수 이상 ~ 최대 전체 문항 수 이하의 문항수를 설정합니다.
          </Popup.Content>
        </>
      )}
      <hr className="contour" />
      <Popup.Header className="center">합격점 / 총점</Popup.Header>
      <Popup.Content className="left">합격 점수를 설정합니다.( 0 ~ 총점 )</Popup.Content>
    </Popup>
  );
};
