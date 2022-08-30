import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { FormTable } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BannerModel } from '../..';
import { BannerBundleFormModel } from '../../model/BannerBundleFormModel';

interface Props {
  banner?: BannerModel;
  bannerBundleForm?: BannerBundleFormModel;
}

@observer
@reactAutobind
class BannerCreateHistoryInfoView extends React.Component<Props> {
  //

  componentDidMount() {
    //
  }

  render() {
    const { banner, bannerBundleForm } = this.props;

    return (
      <FormTable title="생성정보">
        <FormTable.Row name="생성자 및 일시">
          {(banner && banner.registrantName && (
            <>
              {getPolyglotToAnyString(banner.registrantName)} |{' '}
              {moment(banner.registeredTime).format('YYYY.MM.DD: HH:mm')}
            </>
          )) ||
            (bannerBundleForm && (
              <>
                {getPolyglotToAnyString(bannerBundleForm.registrantName)} |
                {moment(bannerBundleForm.registeredTime).format('YYYY.MM.DD: HH:mm')}
              </>
            ))}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default BannerCreateHistoryInfoView;
