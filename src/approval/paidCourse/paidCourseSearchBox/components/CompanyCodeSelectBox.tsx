import React from 'react';
import { observer } from 'mobx-react';
import { useController, useFormContext } from 'react-hook-form';
import { DropdownProps, Form, Grid, Select } from 'semantic-ui-react';
import { addSelectTypeBoxAllOption } from 'shared/helper/selectTypeBoxHelper';
import { UserWorkspaceService } from 'userworkspace';
import { PaidCourseSearchBoxForm } from '../PaidCourseSearchBox';

export const CompanyCodeSelectBox = observer(() => {
  const { userWorkspaceSelectUsId } = UserWorkspaceService.instance;
  const { control } = useFormContext<PaidCourseSearchBoxForm>();

  const companyOptions = addSelectTypeBoxAllOption(userWorkspaceSelectUsId);

  const {
    field: { onChange, value },
  } = useController({
    name: 'companyCode',
    control,
    defaultValue: '',
  });

  const onChnageCompanyCode = (_: React.SyntheticEvent, date: DropdownProps) => {
    onChange(date.value);
  };

  return (
    <Grid.Column width={8}>
      <Form.Group inline>
        <label>소속사</label>
        <Form.Field
          control={Select}
          placeholder="전체"
          options={companyOptions}
          value={value}
          onChange={onChnageCompanyCode}
        />
      </Form.Group>
    </Grid.Column>
  );
});
