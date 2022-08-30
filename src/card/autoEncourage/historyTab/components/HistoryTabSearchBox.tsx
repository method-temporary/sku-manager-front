import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Grid, Input, Segment } from 'semantic-ui-react';
import HistoryTabStore from '../historyTab.store';

export const HistoryTabSearchBox = observer(() => {
  const { setEncourageTitle, setOffset, setSelectedAutoEncourageIds } = HistoryTabStore.instance;

  const [searchWord, setSearchWord] = useState('');

  const onChangeSearchWord = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  }, []);

  const onClickSearchButton = useCallback(() => {
    setOffset(1);
    setSelectedAutoEncourageIds([]);
    setEncourageTitle(searchWord);
  }, [setOffset, setEncourageTitle, setSelectedAutoEncourageIds, searchWord]);

  const onKeyPressEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onClickSearchButton();
      }
    },
    [onClickSearchButton]
  );

  return (
    <Segment>
      <div className="ui form search-box">
        <Grid>
          <colgroup>
            <col width="20%" />
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>독려 제목</label>
                <Form.Field
                  control={Input}
                  width={16}
                  placeholder="제목을 입력해주세요."
                  value={searchWord}
                  onChange={onChangeSearchWord}
                  onKeyPress={onKeyPressEnter}
                />
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <Grid.Column width={16}>
        <div className="center">
          <Button primary onClick={onClickSearchButton}>
            검색
          </Button>
        </div>
      </Grid.Column>
    </Segment>
  );
});
