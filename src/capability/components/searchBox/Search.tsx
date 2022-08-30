import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Grid, Input, Select } from 'semantic-ui-react';
import CapabilityStore from '../../capability.store';

const Search = observer(() => {
  //
  const { assessmentResultQuery, setQdo, changeAssessmentResultQueryProps } = CapabilityStore.instance;

  const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>, data: any) => {
    changeAssessmentResultQueryProps('searchOption', data.value);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, data: any) => {
    changeAssessmentResultQueryProps('searchValue', data.value);
  };

  const searchOptions = [
    {
      key: 0,
      text: '전체',
      value: '',
    },
    {
      key: 1,
      text: '소속사',
      value: 'companyName',
    },
    {
      key: 2,
      text: '소속 조직(팀)',
      value: 'departmentName',
    },
    {
      key: 3,
      text: '성명',
      value: 'name',
    },
    {
      key: 4,
      text: 'E-mail',
      value: 'email',
    },
  ];

  const search = () => {
    changeAssessmentResultQueryProps('offset', 1);
    setQdo();
  };

  return (
    <>
      <Grid.Column width={16}>
        <Form.Group inline>
          <label>검색어</label>
          <Form.Field
            control={Select}
            placeholder="전체"
            options={searchOptions}
            value={assessmentResultQuery.searchOption}
            onChange={onChangeSelect}
          />

          <Form.Field
            control={Input}
            disabled={!assessmentResultQuery.searchOption}
            width={10}
            placeholder={'검색어를 입력해주세요.'}
            value={assessmentResultQuery.searchValue}
            name={assessmentResultQuery.searchOption}
            onChange={onChangeInput}
          />
        </Form.Group>
      </Grid.Column>

      <Grid.Column width={16}>
        <div className="center">
          <Button primary onClick={search}>
            검색
          </Button>
        </div>
      </Grid.Column>
    </>
  );
});

export default Search;
