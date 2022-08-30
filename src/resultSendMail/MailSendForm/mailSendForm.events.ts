import { CheckboxProps } from 'semantic-ui-react';
import { SendEmailService } from 'shared/present';

export function onChangeTitle(event: React.FormEvent<HTMLInputElement>) {
  SendEmailService.instance.changeSendMailProps('title', event.currentTarget.value);
}

export function onChangeContent(html: string) {
  SendEmailService.instance.changeSendMailProps('mailContents', html === '<p><br></p>' ? '' : html);
}

export function onChangeSearchFilter(event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) {
  SendEmailService.instance.changeSendMailProps('searchFilter', data.value);
}

export function onChangeSendType(event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) {
  SendEmailService.instance.changeSendMailProps('sendType', data.value);
}

export function onChangeSenderName(event: React.FormEvent<HTMLInputElement>) {
  SendEmailService.instance.changeSendMailProps('dispatcherName', event.currentTarget.value);
}

export function onChangeSenderEmail(event: React.FormEvent<HTMLInputElement>) {
  SendEmailService.instance.changeSendMailProps('dispatcherEmail', event.currentTarget.value);
}

export function onChangeSender(event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) {
  SendEmailService.instance.changeSendMailProps('senderEmail', data.value);
}
