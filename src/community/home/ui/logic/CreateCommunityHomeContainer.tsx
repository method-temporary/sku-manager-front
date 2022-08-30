import React from 'react';
import { useHome } from '../../service/useHome';
import CommunityStore from '../../../community/mobx/CommunityStore';
import Home from '../../model/Home';
import CommunityHomeView from '../view/CommunityHomeView';

interface CreateCommunityHomeContainerProps {}
const CreateCommunityHomeContainer: React.FC<CreateCommunityHomeContainerProps> = function CreateCommunityHomeContainer() {
  const [
    home,
    changeType,
    changeIntroduce,
    setThumbnailId,
    changeHtml,
    save,
    previewSave,
  ] = useHome();
  const { type, introduce, thumbnailId, html, color } = home as Home;

  return (
    <CommunityHomeView
      type={type}
      introduce={introduce}
      thumbnailId={thumbnailId}
      html={html}
      color={color}
      changeType={changeType}
      changeIntroduce={changeIntroduce}
      setThumbnailId={setThumbnailId}
      changeHtml={changeHtml}
      save={save}
      previewSave={previewSave}
      homeInfo={home}
    />
  );
};

export default CreateCommunityHomeContainer;
