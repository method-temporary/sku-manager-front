import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Radio } from 'semantic-ui-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { AccessRuleSettings, FormTable, Polyglot } from 'shared/components';
import { Language, LangSupport, getPolyglotToString } from 'shared/components/Polyglot';
import ChannelSdo from '../../model/dto/ChannelSdo';

interface Props {
  onChangeChannelProps: (name: string, value: any) => void;
  channel: ChannelSdo;
  firstDepthChannelList: ChannelSdo[];
  selectedSecondDepth: boolean;
  isUpdatable?: boolean;
  onChangeDepth: (value: boolean) => void;
}

interface States {}

@observer
@reactAutobind
class ChannelDetailView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const { onChangeChannelProps } = this.props;
    const { channel, firstDepthChannelList, selectedSecondDepth, onChangeDepth, isUpdatable } = this.props;

    const langSupports: LangSupport[] = [
      { defaultLang: false, lang: Language.Ko },
      { defaultLang: false, lang: Language.En },
      { defaultLang: false, lang: Language.Zh },
    ];

    const firstDepthChannelSelectList = firstDepthChannelList.map((channel) => {
      return { key: channel.id, text: getPolyglotToString(channel.name), value: channel.id };
    });

    const parentChannelName =
      channel.parentId && firstDepthChannelList.find((firstChannel) => firstChannel.id === channel.parentId)?.name;

    return (
      <>
        <Form>
          <Polyglot languages={langSupports}>
            <FormTable title="기본 정보">
              <FormTable.Row
                name={(isUpdatable && channel.id && 'Channel Depth') || 'Channel 선택'}
                required={(isUpdatable && channel.id && false) || true}
              >
                {(isUpdatable &&
                  channel.id &&
                  `구분 : ${(channel.parentId && '2 Depth | 상위 채널명 : ') || '1 Depth'} ${
                    (channel.parentId && parentChannelName && getPolyglotToString(parentChannelName)) || ''
                  }`) || (
                  <Form.Group>
                    <Form.Field
                      control={Radio}
                      label="1Depth Channel"
                      checked={!selectedSecondDepth}
                      onChange={(e: any, data: any) => onChangeDepth(false)}
                    />
                    <Form.Field
                      control={Radio}
                      label="2Depth Channel"
                      checked={selectedSecondDepth}
                      onChange={(e: any, data: any) => onChangeDepth(true)}
                    />
                  </Form.Group>
                )}

                {isUpdatable && !channel.id && selectedSecondDepth && (
                  <Form.Select
                    placeholder="상위 Channel 선택"
                    options={firstDepthChannelSelectList}
                    onChange={(event, data) => onChangeChannelProps('parentId', data.value)}
                    value={channel.parentId || ''}
                  />
                )}
              </FormTable.Row>
              <FormTable.Row name="Channel 명" required>
                <Polyglot.Input
                  languageStrings={channel.name}
                  name="name"
                  onChangeProps={onChangeChannelProps}
                  placeholder="Channel 명을 입력해주세요."
                />
              </FormTable.Row>
              <FormTable.Row name="Channel 설명" required>
                <Polyglot.Editor
                  name="description"
                  languageStrings={channel.description}
                  onChangeProps={onChangeChannelProps}
                  placeholder="내용을 입력해주세요. (1,000자까지 입력가능)"
                  maxLength={1000}
                />
              </FormTable.Row>
              <FormTable.Row name="사용 여부" required>
                <Form.Group>
                  <Form.Field
                    control={Radio}
                    label="사용"
                    checked={channel.enabled}
                    onChange={(e: any, data: any) => onChangeChannelProps('enabled', true)}
                  />
                  <Form.Field
                    control={Radio}
                    label="사용중지"
                    checked={!channel.enabled}
                    onChange={(e: any, data: any) => onChangeChannelProps('enabled', false)}
                  />
                </Form.Group>
              </FormTable.Row>
            </FormTable>
          </Polyglot>
        </Form>
        <AccessRuleSettings readOnly={false} multiple={false} inModal />
      </>
    );
  }
}
export default ChannelDetailView;
