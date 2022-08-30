import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, DropdownProps, Form, Grid, Segment, Select } from 'semantic-ui-react';
import ExclusionManagementTabStore, { SearchType } from '../exclusionManagementTab.store';

const SEARCH_TYPE_OPTIONS = [
  { key: '성명', value: '성명', text: '성명' },
  { key: 'E-mail', value: 'E-mail', text: 'E-mail' },
];

export const ExclusionSearchBox = observer(() => {
  const { searchType, setSearchType, setSearchText } = ExclusionManagementTabStore.instance;

  const [searchWord, setSerachWord] = useState<string>('');

  const onChangeSearchType = (_: React.SyntheticEvent, data: DropdownProps) => {
    setSearchType(data.value as SearchType);
  };

  const onChangeSerchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSerachWord(e.target.value);
  };

  const onClickSearchButton = () => {
    setSearchText(searchWord);
  };

  const onKeyPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onClickSearchButton();
    }
  };

  return (
    <Segment>
      <div className="ui form search-box">
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>검색어</label>
                <Select
                  options={SEARCH_TYPE_OPTIONS}
                  value={searchType}
                  placeholder="성명"
                  onChange={onChangeSearchType}
                />
                <Form.Input
                  width={16}
                  placeholder="검색어를 입력해주세요."
                  // value={searchWord}
                  onChange={onChangeSerchText}
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
