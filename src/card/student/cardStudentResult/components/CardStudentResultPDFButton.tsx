import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import { alert, AlertModel, SubActions } from '../../../../shared/components';
import { useParams } from 'react-router';

interface Params {
  cineroomId: string;
  cardId: string;
}

export const CardStudentResultPDFButton = observer(() => {
  //
  const params = useParams<Params>();
  const onNewWindowResultPage = (fileId: string) => {
    //
    const agent = navigator.userAgent.toLowerCase();
    const isIE = agent.indexOf('msie') > -1 || agent.indexOf('trident') > -1;

    if (isIE) {
      alert(AlertModel.getCustomAlert(true, '알림', 'Internet Explorer는 해당 기능을 지원하지 않습니다.', '확인'));
      return;
    }

    const resultPageURL = process.env.NODE_ENV === 'development' ? `/pdf/${fileId}` : `/manager/pdf/${fileId}`;

    // window.open(resultPageURL, '_blank');
    const uploadURL =
      process.env.NODE_ENV === 'development' ? '/mySUNIResultReport.html' : '/manager/mySUNIResultReport.html';

    window.open(resultPageURL, '_blank');
  };

  return (
    <Button type="button" onClick={() => onNewWindowResultPage(params.cardId)}>
      결과 출력
    </Button>
  );
});
