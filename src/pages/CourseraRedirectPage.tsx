import React from 'react';
import { useParams } from 'react-router-dom';
import { alert, AlertModel } from 'shared/components';

interface Params {
  success: string;
}

const CourseraRedirectPage = () => {
  //
  const params = useParams<Params>();
  let message;

  const closeWindow = () => {
    //
    window.close();
  };

  if (params.success === undefined) {
    window.location.href = '/';
  } else {
    message = params.success === 'true' ? 'API 인증 성공했습니다.' : 'API 인증 실패했습니다';
    alert(AlertModel.getCustomAlert(false, '알림', message, '확인', () => closeWindow()));
  }

  return <></>;
};

export default CourseraRedirectPage;
