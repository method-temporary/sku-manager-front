import React from 'react';
import { DropdownProps, Form, Grid, Input, Select } from 'semantic-ui-react';
import { SelectOption } from 'shared/model';
import { useFocus } from 'exam/hooks/useFocus';

interface SearchkeywordViewProps {
  keyword: string;
  keywordType: string;
  onChangeKeyword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeKeywordType: (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  selectOptions: SelectOption[];
}

export function SearchKeywordView({
  keyword,
  keywordType,
  onChangeKeyword,
  onChangeKeywordType,
  selectOptions,
}: SearchkeywordViewProps) {
  const { focus, onClick, onBlur } = useFocus(false);

  const keywordDisabled = keywordType === '';
  return (
    <>
      <Grid.Column width={16}>
        <Form.Group inline>
          <label>검색어</label>
          <Form.Field
            control={Select}
            placeholder="전체"
            defaultValue={keywordType || selectOptions[0].value}
            options={selectOptions}
            onChange={onChangeKeywordType}
          />
          <Form.Field
            control={Input}
            width={10}
            placeholder="검색어를 입력해주세요."
            value={keyword}
            onClick={onClick}
            onBlur={onBlur}
            onChange={onChangeKeyword}
            disabled={keywordDisabled}
          />
        </Form.Group>
      </Grid.Column>
    </>
  );
}
