import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { Button, TextArea, Form, TextAreaProps } from 'semantic-ui-react';

import { Modal } from 'shared/components';

import { CardRejectedModel } from '../../model/CardRejectedModel';

interface Props {
  onClickOk: () => void;
  changeCardRejectedProps: (name: string, value: string) => void;
  cardRejected: CardRejectedModel;
}

interface States {
  openModal: boolean;
}

@observer
@reactAutobind
class CardRejectedModal extends React.Component<Props, States> {
  //
  handleOk(close: () => void) {
    //
    const { onClickOk } = this.props;
    onClickOk();
    close();
  }

  render() {
    const { changeCardRejectedProps, cardRejected } = this.props;

    return (
      <React.Fragment>
        <Modal size="small" trigger={<Button type="button">반려</Button>}>
          <Modal.Header>반려 사유</Modal.Header>
          <Modal.Content>
            {/* 반려사유 입력 */}
            <Form>
              <TextArea
                rows={5}
                placeholder="반려 사유를 입력해주세요. (입력된 반려 사유는 E-mail을 통해 전달되며, 등록된 내용은 수정하실 수 없습니다.)"
                value={(cardRejected && cardRejected.remark) || ''}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>
                  changeCardRejectedProps('remark', `${data.value}`)
                }
              />
            </Form>
            {/* 반려사유 확인 */}
          </Modal.Content>
          <Modal.Actions>
            <Modal.CloseButton type="button">취소</Modal.CloseButton>
            <Modal.CloseButton
              onClickWithClose={(e: any, close: () => void) => this.handleOk(close)}
              primary
              type="button"
            >
              반려
            </Modal.CloseButton>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CardRejectedModal;
