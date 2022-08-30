import * as React from 'react';
import { observer } from 'mobx-react';
import { convertCardCategory } from '../../../../CardCreate.util';
import { getInitCardCategoryWithInfo, getMainCategoryByCategory } from '../../../../basic/model/CardCategoryWithInfo';
import { ChannelWithAnotherInfo } from '../../../../../../college/shared/components/collegeSelectedModal/model/ChannelWithAnotherInfo';
import { Category } from '../../../../../../_data/college/model';
import { useFindColleges } from '../../../../../../college/College.hook';
import { Table } from 'semantic-ui-react';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import CollegeSelectedModal from '../../../../../../college/shared/components/collegeSelectedModal/CollegeSelectedModal';
import { displayChannelToTable } from '../../../../../shared/utiles';

interface props {
  readonly?: boolean;
}
export const CubeMainChannelRow = observer(({ readonly }: props) => {
  //
  const { mainCategory, setMainCategory } = EnrollmentCubeStore.instance;

  const { data: Colleges } = useFindColleges();

  const getMainChannelWithInfo = () => {
    return convertCardCategory(
      (mainCategory && getMainCategoryByCategory(mainCategory)) || getInitCardCategoryWithInfo()
    );
  };

  const onClickOk = (channels: ChannelWithAnotherInfo[], isSubChannel: boolean) => {
    const selectMainChannel: ChannelWithAnotherInfo | null = (channels && channels.length > 0 && channels[0]) || null;

    const newChannel: Category | null =
      (selectMainChannel && {
        channelId: selectMainChannel.parentId || selectMainChannel.id,
        collegeId: selectMainChannel.collegeId,
        twoDepthChannelId: (selectMainChannel.parentId && selectMainChannel.id) || '',
        mainCategory: true,
      }) ||
      null;

    newChannel && setMainCategory(newChannel);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        메인채널<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        {!readonly && <CollegeSelectedModal mainChannel={getMainChannelWithInfo()} onOk={onClickOk} />}
        {mainCategory && mainCategory.channelId && displayChannelToTable({ ...mainCategory }, Colleges?.results || [])}
      </Table.Cell>
    </Table.Row>
  );
});
