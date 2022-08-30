import React from 'react';
import { Form, Input, Icon } from 'semantic-ui-react';
import ReactDatePicker from 'react-datepicker';
import { FormTable } from 'shared/components';
import { PortletCreateForm } from './portletCreate.models';
import { CineroomCheckboxContainer } from '../cineroomCheckbox/CineroomCheckboxContainer';
import { PortletContentCreateContainer } from '../portletContentCreate/PortletContentCreateContainer';

interface PortletCreateViewProps {
  createForm: PortletCreateForm;
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date) => void;
  onChangeEndDate: (date: Date) => void;
}

export function PortletCreateView({
  createForm,
  onChangeTitle,
  onChangeStartDate,
  onChangeEndDate,
}: PortletCreateViewProps) {
  return (
    <FormTable title="포틀렛 정보">
      <FormTable.Row name="제목" required>
        <div className={createForm.title.length >= 50 ? 'ui right-top-count input error' : 'ui right-top-count input'}>
          <span className="count">
            <span className="now">{createForm.title.length}</span>/<span className="max">50</span>
          </span>
          <Form.Field
            control={Input}
            width={16}
            placeholder="제목을 입력해 주세요."
            value={createForm.title}
            maxLength={50}
            onChange={onChangeTitle}
          />
        </div>
      </FormTable.Row>
      <CineroomCheckboxContainer />
      <PortletContentCreateContainer />
      <FormTable.Row required name="노출 기간">
        <Form.Group>
          <Form.Field>
            <div className="ui input right icon">
              <ReactDatePicker
                placeholderText="시작날짜를 선택해 주세요."
                selected={createForm.startDate}
                onChange={onChangeStartDate}
                selectsStart
                startDate={createForm.startDate}
                endDate={createForm.endDate}
                maxDate={createForm.endDate}
                dateFormat="yyyy.MM.dd"
              />
              <Icon name="calendar alternate outline" />
            </div>
          </Form.Field>
          <div className="dash">~</div>
          <Form.Field>
            <div className="ui input right icon">
              <ReactDatePicker
                placeholderText="종료날짜를 선택해 주세요."
                selected={createForm.endDate}
                onChange={onChangeEndDate}
                selectsStart
                startDate={createForm.startDate}
                endDate={createForm.endDate}
                minDate={createForm.startDate}
                dateFormat="yyyy.MM.dd"
              />
              <Icon name="calendar alternate outline" />
            </div>
          </Form.Field>
        </Form.Group>
      </FormTable.Row>
    </FormTable >
  );
}