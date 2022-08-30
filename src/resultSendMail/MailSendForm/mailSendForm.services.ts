import { useEffect } from 'react';

import { SendEmailService } from 'shared/present';
import { commonHelper } from 'shared/helper';
import { SearchFilter, SendEmailModel } from 'shared/model';

export function useClearMailSendForm() {
  useEffect(() => {
    return () => {
      SendEmailService.instance.clearDisplay();
    };
  }, []);
}

export function sendEmailIsBlank(sendEmail: SendEmailModel): string {
  if (!sendEmail.emails || sendEmail.emails.length === 0) return '수신자';
  if (!sendEmail.title) return '타이틀';
  if (!sendEmail.mailContents) {
    return '내용';
  }
  if (sendEmail.sendType === '1' && sendEmail.searchFilter === SearchFilter.SearchOff) {
    if (!sendEmail.dispatcherName) return '담당자 이름';
    if (!sendEmail.dispatcherEmail) {
      return '담당자 이메일';
    }
    if (sendEmail.dispatcherEmail) {
      if (!commonHelper.chkEmailAddr(sendEmail.dispatcherEmail)) {
        return '정확한 이메일 정보';
      }
    }
  }
  return 'success';
}

export function addStyleImg(value: string) {
  const matchCnt = (value.match(/<img src=/g) || []).length;

  const img = new Image();
  let cont = value;
  let first = '';
  let rest = '';
  let firstImg = '';
  for (let i = 0; i < matchCnt; i++) {
    first = cont.substr(0, cont.indexOf('<img src='));
    rest = cont.substr(cont.indexOf('<img src='), cont.length);
    firstImg = rest.substring(rest.indexOf('data:image'), rest.indexOf('><') - 1);
    img.src = firstImg;
    if (img.width >= 1020) {
      cont = cont.replace('<img src=', '<img width="100%" src=');
    } else {
      cont = cont.replace('<img src=', '<img style="max-width: 100%; height: auto !important;" src=');
    }
  }
  return cont;
}
