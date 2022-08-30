import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { Modal } from 'shared/components';
import { Button, Form, FormField, Grid, Input } from 'semantic-ui-react';

interface Props {
  onClickOk: (password: string, close: () => void) => void;
  onClickCancel?: () => void;
  modSuper?: boolean;
}

interface State {
  password: string;
}

@observer
@reactAutobind
class UserResetPassWordModal extends React.Component<Props, State> {
  //
  state: State = {
    password: 'mySuni12@!',
  };

  onMount() {
    //
    this.setState({ password: 'mySuni12@!' });
  }

  onOk(password: string, close: () => void) {
    //
    const { onClickOk } = this.props;

    onClickOk(password, close);
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
    const { modSuper } = this.props;

    return (
      <React.Fragment>
        <Modal
          modSuper={modSuper}
          size="small"
          trigger={
            <Button style={{ margin: '0 0.25rem 0 0' }} disabled={modSuper}>
              비밀번호 초기화
            </Button>
          }
          triggerAs="a"
          onMount={this.onMount}
        >
          <Modal.Header>비밀번호 초기화</Modal.Header>
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
            <Modal.CloseButton onClickWithClose={(event, close) => this.onOk(password, close)}>
              초기화
            </Modal.CloseButton>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default UserResetPassWordModal;
