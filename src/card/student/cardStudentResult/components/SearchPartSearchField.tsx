import React from 'react';
import { observer } from 'mobx-react';
import { Form, Grid, Input, Select } from 'semantic-ui-react';
import CardStudentResultStore from '../CardStudentResult.store';

export const SearchPartSearchField = observer(() => {
  //
  const { cardStudentResultQuery, setSearchOption, setSearchValue } = CardStudentResultStore.instance;

  const getOptions = () => {
    //
    return [
      { key: '1', text: '전체', value: '' },
      { key: '2', text: '소속사', value: '소속사' },
      { key: '3', text: '소속 조직(팀)', value: '소속조직' },
      { key: '4', text: '성명', value: '성명' },
      { key: '5', text: 'E-mail', value: 'Email' },
    ];
  };

  return (
    <Grid.Column width={16}>
      <Form.Group inline>
        <label>검색어</label>
        <Form.Field
          control={Select}
          value={cardStudentResultQuery.searchOption}
          placeholder="전체"
          options={getOptions()}
          // disabled={disabled}
          onChange={(event: any, data: any) => setSearchOption(data.value)}
          // search={search}
        />
        <Form.Field
          control={Input}
          disabled={!cardStudentResultQuery.searchOption}
          width={16}
          value={cardStudentResultQuery.searchValue || ''}
          placeholder="검색어를 입력하세요."
          onChange={(event: any, data: any) => setSearchValue(data.value)}
          // onKeyUp={(e: any) => e.keyCode === 13 && searchBoxSearchFn()}
        />
      </Form.Group>
    </Grid.Column>
  );
});
