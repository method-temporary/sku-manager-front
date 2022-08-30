import React from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { SearchDateView, SearchKeywordView } from 'shared/ui';
import { useSmsSearchBoxViewModel } from 'sms/store/SmsSearchBoxStore';
import {
  onChangeEndDate,
  onChangeKeyword,
  onChangeKeywordType,
  onChangeStartDate,
  onClickDate,
  onClickSearch,
} from 'sms/event/smsSearchBoxEvent';

export function SmsSearchBoxContainer() {
  const smsSearchBox = useSmsSearchBoxViewModel();

  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            {smsSearchBox !== undefined && (
              <>
                <SearchDateView
                  startDate={smsSearchBox.startDate}
                  endDate={smsSearchBox.endDate}
                  selectedDate={smsSearchBox.selectedDate}
                  onChangeStartDate={onChangeStartDate}
                  onChangeEndDate={onChangeEndDate}
                  onClickDate={onClickDate}
                />
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
  { key: 'from', value: 'from', text: '발신자' },
  { key: 'to', value: 'to', text: '수신자' },
  { key: 'message', value: 'message', text: '메세지' },
];
