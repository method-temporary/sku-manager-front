import { observer } from 'mobx-react';
import { Button, Form, Grid, Input, Label, Segment } from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';
import { useFindLinkedInContentByUrn } from '../modal/LinkedInCourseListModal.hooks';
import LinkedInCourseListModalStore from '../modal/LinkedInCourseListModal.store';

interface Props {
  //
}

export const LinkedInURNInput = observer((props: Props) => {
  //
  const [urn, setUrn] = useState<string>('');
  const { cpContentsParams, setCpContentsParams } = LinkedInCourseListModalStore.instance;

  const onChangeURN = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrn(e.target.value);
    },
    [urn]
  );

  const onClickURNOK = useCallback(() => {
    setCpContentsParams(urn);
  }, [cpContentsParams, urn]);

  return (
    <>
      <Segment>
        <div className="ui form search-box">
          <Grid>
            <Grid.Row>
              <div>
                <p style={{ color: '#FF0000' }}>{'찾으시는 과정이 없으신가요?'}</p>
              </div>
              <Grid.Column width={16}>
                <Form.Group inline>
                  <label>URN</label>
                  <Form.Field
                    control={Input}
                    width={14}
                    placeholder="urn을 입력해주세요."
                    value={urn}
                    onChange={onChangeURN}
                  />
                  <Form.Field control={Button} width={2} onClick={onClickURNOK}>
                    확인
                  </Form.Field>
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Segment>
    </>
  );
});
