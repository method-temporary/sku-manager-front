import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Button, Form, FormField, Grid, Input } from 'semantic-ui-react';

import { Modal } from 'shared/components';

interface Props {
  //
  instructorId: string;
  onClickOk: (instructorId: string, password: string, close: () => void) => void;
  onClickCancel?: () => void;
}

interface State {
  password: string;
}

@observer
@reactAutobind
class InstructorAccountModal extends React.Component<Props, State> {
  //
  state: State = {
    password: '',
  };

  onMount() {
    //
    // this.setState({ password: '' });
  }

  onOk(password: string, close: () => void) {
    //
    const { instructorId, onClickOk } = this.props;

    onClickOk(instructorId, password, close);
  }

  onCancel(close: () => void) {
    //
    const { onClickCancel } = this.props;

    if (onClickCancel) {
      onClickCancel();
    }

    close();
  }

  render() {
    //
    const { password } = this.state;

    return (
      <React.Fragment>
        <Modal size="small" trigger={<Button>계정 생성</Button>} onMount={this.onMount}>
          <Modal.Header>계성 생성</Modal.Header>
          <Modal.Content>
            <Form>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Form.Group inline>
                      <label>비밀번호</label>
                      <FormField
                        control={Input}
                        width={10}
                        value={password}
                        onChange={(e: any, data: any) => this.setState({ password: data.value })}
                      />
                    </Form.Group>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Modal.CloseButton onClickWithClose={(event, close) => this.onCancel(close)}>취소</Modal.CloseButton>
            <Modal.CloseButton onClickWithClose={(event, close) => this.onOk(password, close)}>생성</Modal.CloseButton>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default InstructorAccountModal;
