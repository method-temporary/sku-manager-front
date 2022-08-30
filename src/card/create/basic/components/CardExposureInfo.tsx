import React from 'react';
import { observer } from 'mobx-react';

import { FormTable, Polyglot } from 'shared/components';

import { PermittedCineroom } from '_data/lecture/cards/model/vo';

import PermittedCineroomList from '../../../shared/components/permittedCineroomModal/components/PermittedCineroomList';
import PermittedCineroomModal from '../../../shared/components/permittedCineroomModal/PermittedCineroomModal';
import { CardThumbnailSelectView } from '../../../card/ui/view/CardThumbnailSelectView';

import CardCreateStore from '../../CardCreate.store';
import { onChangeCardCreatePolyglot } from '../../CardCreate.util';
import { CardThumbnail } from './cardThumbnail/CardThumbnail';

interface Props {
  readonly?: boolean;
}

const CardExposureInfo = observer(({ readonly }: Props) => {
  //
  const { tags, permittedCinerooms, setPermittedCinerooms } = CardCreateStore.instance;

  const onClickOk = (permittedCinerooms: PermittedCineroom[]) => {
    //
    setPermittedCinerooms(permittedCinerooms);
  };

  return (
    <FormTable title="노출 정보">
      <FormTable.Row name="썸네일" required>
        {/* <CardThumbnailSelectView isUpdatable={!readonly} /> */}
        <CardThumbnail readonly={readonly} />
      </FormTable.Row>

      <FormTable.Row name="멤버사/핵인싸 적용 범위 설정" required>
        <PermittedCineroomModal
          readonly={readonly}
          title="멤버사/핵인싸 적용 범위 설정하기"
          contentsHeader="멤버사 적용 범위 설정"
          hasRequire
          permittedCinerooms={permittedCinerooms}
          onOk={onClickOk}
        />

        {permittedCinerooms.length > 0 && <PermittedCineroomList permittedCinerooms={permittedCinerooms} hasRequire />}
      </FormTable.Row>
      <FormTable.Row name="Tag 정보">
        <Polyglot.Input
          readOnly={readonly}
          languageStrings={tags}
          onChangeProps={onChangeCardCreatePolyglot}
          name="tags"
          placeholder="단어간에는 쉼표(“,”)로 구분합니다."
        />
      </FormTable.Row>
    </FormTable>
  );
});

export default CardExposureInfo;
