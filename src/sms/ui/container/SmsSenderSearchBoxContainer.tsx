import React from 'react';
import { Button, Form, Grid, Segment, Select } from 'semantic-ui-react';
import { SearchKeywordView } from 'shared/ui';
import { useSmsSenderSearchBoxViewModel } from 'sms/store/SmsSenderStore';
import { onChangeKeyword, onChangeKeywordType, onClickSearch, onChangeSearchAllowed } from 'sms/event/smsSenderEvent';

export function SmsSenderSearchBoxContainer() {
  const smsSearchBox = useSmsSenderSearchBoxViewModel();

  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            {smsSearchBox !== undefined && (
              <>
                <Grid.Column width={16}>
                  <Form.Group inline>
                    <label>권한여부</label>
                    <Form.Field
                      control={Select}
                      placeholder="전체"
                      defaultValue={selectAllowedOptions[0].value}
                      options={selectAllowedOptions}
                      onChange={onChangeSearchAllowed}
                    />
                  </Form.Group>
                </Grid.Column>
                <SearchKeywordView
                  keyword={smsSearchBox.keyword}
                  keywordType={smsSearchBox.keywordType}
                  onChangeKeyword={onChangeKeyword}
                  onChangeKeywordType={onChangeKeywordType}
                  selectOptions={selectOptions}
                />
                <Grid.Column width={16}>
                  <div className="center">
                    <Button primary onClick={onClickSearch}>
                      검색
                    </Button>
                  </div>
                </Grid.Column>
              </>
            )}
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  );
}

const selectAllowedOptions = [
  { key: 'all', value: '', text: '전체' },
  { key: 'true', value: 'true', text: '권한있음' },
  { key: 'false', value: 'false', text: '권한없음' },
];

const selectOptions = [
  { key: 'all', value: '', text: '전체' },
  { key: 'name', value: 'name', text: '성명' },
  { key: 'email', value: 'email', text: 'email' },
];
