import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Radio } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { FormTable, Polyglot } from 'shared/components';
import { Language, LangSupport } from 'shared/components/Polyglot';

import CollegeSdo from '../../model/dto/CollegeSdo';
import { isSuperManager } from 'shared/ui';

interface Props {
  onChangeCollegeProps: (name: string, value: any) => void;

  updatable: boolean;
  college: CollegeSdo;
}

interface States {}

@observer
@reactAutobind
class CollegeBasicInfoView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { onChangeCollegeProps } = this.props;
    const { updatable, college } = this.props;
    const isCollegeUpdatable = updatable && isSuperManager();

    const langSupports: LangSupport[] = [
      { defaultLang: true, lang: Language.Ko },
      { defaultLang: false, lang: Language.En },
      { defaultLang: false, lang: Language.Zh },
    ];

    return (
      <Form>
        <Polyglot languages={langSupports}>
          <FormTable title="기본 정보">
            <FormTable.Row name="Category 명" required>
              {/*{updatable ? (*/}
              {/*  <Form.Field*/}
              {/*    width={16}*/}
              {/*    control={Input}*/}
              {/*    placeholder="Please enter the college name."*/}
              {/*    value={college.name}*/}
              {/*    onChange={(e: any, data: any) => onChangeCollegeProps('name', e.target.value)}*/}
              {/*  />*/}
              {/*) : (*/}
              {/*  <span>{college.name}</span>*/}
              {/*)}*/}
              <Polyglot.Input
                languageStrings={college.name}
                name="name"
                onChangeProps={onChangeCollegeProps}
                placeholder="Category명을 입력해주세요."
                readOnly={!isCollegeUpdatable}
              />
            </FormTable.Row>
            <FormTable.Row name="Category 설명" required>
              <Polyglot.Editor
                name="description"
                languageStrings={college.description}
                onChangeProps={onChangeCollegeProps}
                readOnly={!isCollegeUpdatable}
                placeholder="내용을 입력해주세요. (1,000자까지 입력가능)"
                maxLength={1000}
              />
            </FormTable.Row>
            <FormTable.Row name="사용 여부" required>
              <Form.Group>
                <Form.Field
                  control={Radio}
                  disabled={!isCollegeUpdatable}
                  label="사용"
                  checked={college.enabled}
                  onChange={(e: any, data: any) => onChangeCollegeProps('enabled', true)}
                />
                <Form.Field
                  control={Radio}
                  disabled={!isCollegeUpdatable}
                  label="사용중지"
                  checked={!college.enabled}
                  onChange={(e: any, data: any) => onChangeCollegeProps('enabled', false)}
                />
              </Form.Group>
            </FormTable.Row>
          </FormTable>
        </Polyglot>
      </Form>
    );
  }
}

export default CollegeBasicInfoView;
