import React, { useState } from 'react';
import { Input, Modal, Button, Table } from 'semantic-ui-react';
import { Row } from './MenuInputView';
import { ChangeName, ChangeSurveyInformation } from '../../service/useSelectedMenu';
import ServeyModalView from './ServeyModalView';

interface SurveyMenuInputViewProps {
  name: string;
  changeName: ChangeName;
  surveyInformation: string;
  changeSurveyInformation: ChangeSurveyInformation;
  surveyTitle: string | undefined;
  surveyCreatorName: string | undefined;
}

const SurveyMenuInputView: React.FC<SurveyMenuInputViewProps> = function SurveyMenuInputView({
  name,
  changeName,
  surveyInformation,
  changeSurveyInformation,
  surveyTitle,
  surveyCreatorName,
}) {
  const [modalOpend, changeModalOpend] = useState<boolean>(false);

  return (
    <>
      <Row title="메뉴명">
        <Input fluid value={name} onChange={changeName} />
      </Row>
      <Row title="설문 안내글">
        <Input fluid value={surveyInformation} onChange={changeSurveyInformation} />
      </Row>
      <Row title="설문 선택">
        <Button onClick={() => changeModalOpend(true)}>설문 선택</Button>
        {surveyTitle && (
          <Table celled>
            <colgroup>
              <col width="70%" />
              <col width="30%" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">제목</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{surveyTitle}</Table.Cell>
                <Table.Cell>{surveyCreatorName}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )}
      </Row>
      <Modal size="large" open={modalOpend} onClose={() => changeModalOpend(false)}>
        <ServeyModalView closeModal={() => changeModalOpend(false)} />
      </Modal>
    </>
  );
};

export default SurveyMenuInputView;
