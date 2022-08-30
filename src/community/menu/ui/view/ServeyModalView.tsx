import React from 'react';
import SurveyFormListContainer from './SurveyFormListContainer';

interface ServeyModalViewProps {
  closeModal: () => void;
}

const ServeyModalView: React.FC<ServeyModalViewProps> = function ServeyModalView({
  closeModal,
}) {
  return <SurveyFormListContainer closeModal={closeModal} />;
};

export default ServeyModalView;
