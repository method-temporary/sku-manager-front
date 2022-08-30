import React from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { SearchKeywordView } from 'shared/ui';
import { useSmsMainNumberSearchBoxViewModel } from 'sms/store/SmsMainNumberStore';
import { onChangeKeyword, onChangeKeywordType, onClickSearch } from 'sms/event/smsMainNumberEvent';

export function SmsMainNumberSearchBoxContainer() {
  const smsSearchBox = useSmsMainNumberSearchBoxViewModel();

  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            {smsSearchBox !== undefined && (
              <>
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

const selectOptions = [
  { key: 'all', value: '', text: '전체' },
  { key: 'name', value: 'name', text: '발송처' },
  { key: 'phone', value: 'phone', text: '등록번호' },
];
