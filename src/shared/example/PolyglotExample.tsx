import * as React from 'react';

import { Container, Form, SegmentGroup } from 'semantic-ui-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { Polyglot, FormTable } from 'shared/components';

import { PolyglotModel } from '../model';
import { DEFAULT_LANGUAGE, LangSupport } from '../components/Polyglot';

interface States {
  model: PolyglotExampleModel;
}

@reactAutobind
class PolyglotExample extends ReactComponent<{}, States> {
  //
  constructor(props: {}) {
    super(props);
    this.state = {
      model: new PolyglotExampleModel(),
    };
  }

  onChange(name: string, value: any): void {
    //
    const { model } = this.state;
    const newValue = { ...model, [`${name}`]: value };
    this.setState({ model: newValue });
  }

  onChangeWithIndex(index: number, value: any): void {
    //
    const { model } = this.state;

    const copiedValues = [...model.indexableInputValue];
    copiedValues[index] = value;

    const newValue = { ...model, indexableInputValue: copiedValues };
    this.setState({ model: newValue });
  }

  render() {
    //
    const { model } = this.state;

    return (
      <Container fluid>
        <Polyglot languages={model.langSupports}>
          <Form>
            <FormTable title="다국어">
              <FormTable.Row name="지원 언어">
                <Polyglot.Languages onChangeProps={this.onChange} />
              </FormTable.Row>
              <FormTable.Row name="기본 언어">
                <Polyglot.Default onChangeProps={this.onChange} />
              </FormTable.Row>
            </FormTable>
            <FormTable title="필드">
              <FormTable.Row name="Input">
                <Polyglot.Input
                  languageStrings={model.inputValue}
                  name="inputValue"
                  onChangeProps={this.onChange}
                  maxLength="50"
                  placeholder="placeholder."
                />
              </FormTable.Row>
              <FormTable.Row name="InputReadOnly">
                <Polyglot.Input
                  languageStrings={model.inputValue}
                  name="inputValue"
                  onChangeProps={this.onChange}
                  maxLength="50"
                  readOnly
                />
              </FormTable.Row>
              <FormTable.Row name="IndexableInput">
                {model.indexableInputValue.map((value, index) => (
                  <SegmentGroup key={index}>
                    <Polyglot.Input
                      languageStrings={value}
                      name={index}
                      onChangeProps={this.onChangeWithIndex}
                      maxLength="120"
                      placeholder="placeholder"
                    />
                  </SegmentGroup>
                ))}
              </FormTable.Row>
              <FormTable.Row name="TextArea">
                <Polyglot.TextArea
                  languageStrings={model.textAreaValue}
                  name="textAreaValue"
                  onChangeProps={this.onChange}
                  maxLength={1000}
                  placeholder="placeholder"
                />
              </FormTable.Row>
              <FormTable.Row name="TextArea">
                <Polyglot.Editor
                  languageStrings={model.htmlEditorValue}
                  name="htmlEditorValue"
                  onChangeProps={this.onChange}
                  maxLength={10}
                />
              </FormTable.Row>
            </FormTable>
          </Form>
        </Polyglot>
      </Container>
    );
  }
}

export default PolyglotExample;

class PolyglotExampleModel {
  //
  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];
  inputValue: PolyglotModel = new PolyglotModel();
  indexableInputValue: PolyglotModel[] = [new PolyglotModel(), new PolyglotModel(), new PolyglotModel()];
  textAreaValue: PolyglotModel = new PolyglotModel();
  htmlEditorValue: PolyglotModel = new PolyglotModel();
}
